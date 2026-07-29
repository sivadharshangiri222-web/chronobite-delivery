import express from 'express';
import {
  getCategoriesByRestaurant,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory
} from '../controllers/category.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

// Public customer view categories for restaurant
router.get('/restaurant/:restaurantId', getCategoriesByRestaurant);

// Admin protected endpoints
router.post('/', authMiddleware, adminOnly, createCategory);
router.put('/:id', authMiddleware, adminOnly, updateCategory);
router.patch('/:id/toggle-status', authMiddleware, adminOnly, toggleCategoryStatus);
router.delete('/:id', authMiddleware, adminOnly, deleteCategory);

export default router;
