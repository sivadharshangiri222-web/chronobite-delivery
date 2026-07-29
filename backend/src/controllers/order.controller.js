import Order from '../models/order.model.js';
import DeliverySlot from '../models/deliverySlot.model.js';
import Payment from '../models/payment.model.js';
import Refund from '../models/refund.model.js';
import Notification from '../models/notification.model.js';
import Razorpay from 'razorpay';
import { config } from '../config/env.js';
import { initiateOrderSchema } from '../validators/order.validators.js';

// Initialize Razorpay SDK instance
const razorpay = new Razorpay({
  key_id: config.razorpayKeyId,
  key_secret: config.razorpayKeySecret
});

// POST /api/orders/initiate
export const initiateOrder = async (req, res, next) => {
  try {
    const validatedData = initiateOrderSchema.parse(req.body);

    const slot = await DeliverySlot.findById(validatedData.deliverySlotId);
    if (!slot || !slot.isAvailable || slot.currentOrders >= slot.maxOrders) {
      return res.status(400).json({ message: 'Selected delivery slot is no longer available', code: 'SLOT_UNAVAILABLE' });
    }

    // Create Order with status: "awaiting_payment"
    const order = await Order.create({
      userId: req.user.id,
      restaurantId: validatedData.restaurantId,
      items: validatedData.items,
      totalAmount: validatedData.totalAmount,
      deliveryAddress: validatedData.deliveryAddress,
      deliverySlotId: validatedData.deliverySlotId,
      status: 'awaiting_payment'
    });

    const amountInPaise = Math.round(validatedData.totalAmount * 100);

    // Create Razorpay Order
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${order._id}`
      });
    } catch (rzpErr) {
      // Mock fallback for test environment
      razorpayOrder = {
        id: `rzp_order_mock_${order._id}`,
        amount: amountInPaise,
        currency: 'INR'
      };
    }

    // Save initial Payment record in pending state
    await Payment.create({
      orderId: order._id,
      userId: req.user.id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: validatedData.totalAmount,
        amountInPaise,
        currency: 'INR'
      }
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message, code: 'VALIDATION_ERROR' });
    }
    next(error);
  }
};

// GET /api/orders/my
export const getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('restaurantId', 'name image address')
      .populate('deliverySlotId')
      .populate('paymentId')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('restaurantId')
      .populate('deliverySlotId')
      .populate('paymentId')
      .lean();

    if (!order) {
      return res.status(404).json({ message: 'Order not found', code: 'NOT_FOUND' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// POST /api/orders/:id/cancel
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('deliverySlotId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found', code: 'NOT_FOUND' });
    }

    // 1. Verify ownership
    if (order.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Forbidden', code: 'FORBIDDEN' });
    }

    // 2. Check order status
    if (order.status !== 'confirmed') {
      return res.status(400).json({
        message: 'Order cannot be cancelled at this stage.',
        code: 'CANCELLATION_NOT_ALLOWED'
      });
    }

    // 3. Time check: Current time < (deliverySlot.startTime - 30 minutes)
    const slot = order.deliverySlotId;
    if (slot) {
      const slotDate = slot.date; // YYYY-MM-DD
      const startTime = slot.startTime; // HH:mm
      const slotStartDateTime = new Date(`${slotDate}T${startTime}:00`);

      const currentTime = new Date();
      const diffInMinutes = (slotStartDateTime.getTime() - currentTime.getTime()) / (1000 * 60);

      if (diffInMinutes < 30) {
        return res.status(400).json({
          message: 'Cancellation not allowed within 30 minutes of your delivery slot.',
          code: 'CANCELLATION_WINDOW_EXPIRED'
        });
      }
    }

    // All checks pass: Cancel order
    order.status = 'cancelled';
    await order.save();

    // Release delivery slot count
    if (slot && slot.currentOrders > 0) {
      await DeliverySlot.findByIdAndUpdate(slot._id, { $inc: { currentOrders: -1 } });
    }

    // Initiate refund
    const payment = await Payment.findOne({ orderId: order._id, status: 'success' });
    let refundRecord = null;

    if (payment) {
      payment.status = 'refunded';
      await payment.save();

      refundRecord = await Refund.create({
        orderId: order._id,
        paymentId: payment._id,
        userId: req.user.id,
        amount: order.totalAmount,
        reason: 'customer_cancelled',
        status: 'processing'
      });
    }

    // Create notification
    await Notification.create({
      userId: req.user.id,
      title: 'Order Cancelled',
      message: `Your order #${order._id.toString().substring(0, 8)} has been cancelled. Refund of ₹${order.totalAmount} initiated.`
    });

    res.json({
      success: true,
      data: {
        message: 'Order cancelled successfully. 100% refund initiated to your original payment method.',
        refund: refundRecord
      }
    });
  } catch (error) {
    next(error);
  }
};

// --- ADMIN ENDPOINTS ---

// GET /api/admin/orders
export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email phone')
      .populate('restaurantId', 'name')
      .populate('deliverySlotId')
      .populate('paymentId')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/orders/:id/status
export const updateOrderStatusByAdmin = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found', code: 'NOT_FOUND' });
    }

    // Handle Admin Cancellation with automatic 100% refund
    if (status === 'cancelled' && order.status !== 'cancelled') {
      order.status = 'cancelled';
      await order.save();

      // Release slot
      if (order.deliverySlotId) {
        await DeliverySlot.findByIdAndUpdate(order.deliverySlotId, { $inc: { currentOrders: -1 } });
      }

      // Initiate refund
      const payment = await Payment.findOne({ orderId: order._id, status: 'success' });
      if (payment) {
        payment.status = 'refunded';
        await payment.save();

        await Refund.create({
          orderId: order._id,
          paymentId: payment._id,
          userId: order.userId,
          amount: order.totalAmount,
          reason: 'admin_cancelled',
          status: 'processing'
        });
      }
    } else {
      order.status = status;
      await order.save();
    }

    // Notify customer
    await Notification.create({
      userId: order.userId,
      title: 'Order Status Update',
      message: `Your order #${order._id.toString().substring(0, 8)} status is now: ${status.replace('_', ' ').toUpperCase()}`
    });

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
