import express from 'express';
import {
  getFoodsByRestaurant,
  createFood,
  updateFood,
  toggleFoodAvailability,
  deleteFood
} from '../controllers/food.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

router.get('/restaurant/:restaurantId', getFoodsByRestaurant);

// Admin protected endpoints
router.post('/', authMiddleware, adminOnly, createFood);
router.put('/:id', authMiddleware, adminOnly, updateFood);
router.patch('/:id/toggle-availability', authMiddleware, adminOnly, toggleFoodAvailability);
router.delete('/:id', authMiddleware, adminOnly, deleteFood);

export default router;
