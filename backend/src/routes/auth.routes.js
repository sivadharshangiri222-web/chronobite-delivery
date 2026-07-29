import express from 'express';
import { register, login, logout, forgotPassword, resetPassword, getProfile, updateProfile } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { customerOnly } from '../middleware/roleCheck.middleware.js';
import { loginRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginRateLimiter, login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authMiddleware, customerOnly, getProfile);
router.put('/profile', authMiddleware, customerOnly, updateProfile);

export default router;
