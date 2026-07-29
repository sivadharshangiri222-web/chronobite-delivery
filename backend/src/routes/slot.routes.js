import express from 'express';
import {
  getAvailableSlots,
  createSlot,
  getAdminSlots,
  toggleSlotAvailability
} from '../controllers/slot.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

// Public / Customer endpoint
router.get('/', getAvailableSlots);

// Admin endpoints
router.post('/admin', authMiddleware, adminOnly, createSlot);
router.get('/admin/:restaurantId', authMiddleware, adminOnly, getAdminSlots);
router.patch('/admin/:id/toggle', authMiddleware, adminOnly, toggleSlotAvailability);

export default router;
