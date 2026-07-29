import express from 'express';
import { getAdminAnalytics } from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

router.get('/admin', authMiddleware, adminOnly, getAdminAnalytics);

export default router;
