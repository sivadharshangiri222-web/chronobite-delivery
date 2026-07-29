import express from 'express';
import {
  verifyPayment,
  markPaymentFailed,
  retryPayment,
  getTransactionHistory,
  downloadInvoice,
  handleRazorpayWebhook,
  getAdminPayments
} from '../controllers/payment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { customerOnly, adminOnly } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

// Public Webhook endpoint
router.post('/webhook/razorpay', handleRazorpayWebhook);

// Customer endpoints
router.post('/verify', authMiddleware, customerOnly, verifyPayment);
router.post('/failed', authMiddleware, customerOnly, markPaymentFailed);
router.get('/retry/:orderId', authMiddleware, customerOnly, retryPayment);
router.get('/history', authMiddleware, customerOnly, getTransactionHistory);
router.get('/:id/invoice', authMiddleware, downloadInvoice);

// Admin endpoints
router.get('/admin/all', authMiddleware, adminOnly, getAdminPayments);

export default router;
