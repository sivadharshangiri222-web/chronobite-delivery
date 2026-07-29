import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    razorpayRefundId: { type: String, default: '' },
    amount: { type: Number, required: true },
    reason: {
      type: String,
      enum: ['customer_cancelled', 'admin_cancelled', 'failed_delivery'],
      default: 'customer_cancelled'
    },
    cancelledAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['processing', 'processed', 'failed', 'rejected'],
      default: 'processing'
    },
    processedAt: { type: Date }
  },
  { timestamps: true }
);

const Refund = mongoose.model('Refund', refundSchema);
export default Refund;
