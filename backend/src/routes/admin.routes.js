import express from 'express';
import { adminLogin, adminLogout, getAdminProfile, updateAdminProfile } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/roleCheck.middleware.js';
import { loginRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

router.post('/login', loginRateLimiter, adminLogin);
router.post('/logout', adminLogout);
router.get('/profile', authMiddleware, adminOnly, getAdminProfile);
router.put('/profile', authMiddleware, adminOnly, updateAdminProfile);

export default router;
