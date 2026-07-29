import express from 'express';
import { getMyRefunds, getAdminRefunds, getAdminRefundById, approveAdminRefund } from '../controllers/refund.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { customerOnly, adminOnly } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

router.get('/my', authMiddleware, customerOnly, getMyRefunds);
router.get('/admin/all', authMiddleware, adminOnly, getAdminRefunds);
router.get('/admin/:id', authMiddleware, adminOnly, getAdminRefundById);
router.post('/admin/:id/approve', authMiddleware, adminOnly, approveAdminRefund);

export default router;
