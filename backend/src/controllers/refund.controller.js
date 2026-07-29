import Refund from '../models/refund.model.js';

// GET /api/refunds/my
export const getMyRefunds = async (req, res, next) => {
  try {
    const refunds = await Refund.find({ userId: req.user.id })
      .populate('orderId', 'items totalAmount status')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: refunds });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/refunds
export const getAdminRefunds = async (req, res, next) => {
  try {
    const refunds = await Refund.find()
      .populate('userId', 'name email phone')
      .populate('orderId')
      .populate('paymentId')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: refunds });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/refunds/:id
export const getAdminRefundById = async (req, res, next) => {
  try {
    const refund = await Refund.findById(req.params.id)
      .populate('userId')
      .populate('orderId')
      .populate('paymentId')
      .lean();

    if (!refund) {
      return res.status(404).json({ message: 'Refund record not found', code: 'NOT_FOUND' });
    }

    res.json({ success: true, data: refund });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/refunds/:id/approve
export const approveAdminRefund = async (req, res, next) => {
  try {
    const refund = await Refund.findById(req.params.id);
    if (!refund) {
      return res.status(404).json({ message: 'Refund record not found', code: 'NOT_FOUND' });
    }

    refund.status = 'processed';
    refund.processedAt = new Date();
    refund.razorpayRefundId = `rfnd_${Date.now()}`;
    await refund.save();

    res.json({ success: true, data: refund });
  } catch (error) {
    next(error);
  }
};
