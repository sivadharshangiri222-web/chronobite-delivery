import express from 'express';
import {
  initiateOrder,
  getCustomerOrders,
  getOrderById,
  cancelOrder,
  getAdminOrders,
  updateOrderStatusByAdmin
} from '../controllers/order.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { customerOnly, adminOnly } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

// Customer endpoints
router.post('/initiate', authMiddleware, customerOnly, initiateOrder);
router.get('/my', authMiddleware, customerOnly, getCustomerOrders);
router.get('/:id', authMiddleware, customerOnly, getOrderById);
router.post('/:id/cancel', authMiddleware, customerOnly, cancelOrder);

// Admin endpoints
router.get('/admin/all', authMiddleware, adminOnly, getAdminOrders);
router.patch('/admin/:id/status', authMiddleware, adminOnly, updateOrderStatusByAdmin);

export default router;
