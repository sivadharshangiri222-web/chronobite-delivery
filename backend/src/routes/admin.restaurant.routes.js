import express from 'express';
import {
  createAdminRestaurant,
  getAdminRestaurants,
  getAdminRestaurantById,
  updateAdminRestaurant,
  toggleRestaurantStatus,
  deleteAdminRestaurant
} from '../controllers/restaurant.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.post('/', createAdminRestaurant);
router.get('/', getAdminRestaurants);
router.get('/:id', getAdminRestaurantById);
router.put('/:id', updateAdminRestaurant);
router.patch('/:id/toggle-status', toggleRestaurantStatus);
router.delete('/:id', deleteAdminRestaurant);

export default router;
