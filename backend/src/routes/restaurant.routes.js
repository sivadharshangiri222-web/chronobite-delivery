import express from 'express';
import { getCustomerRestaurants, getCustomerRestaurantById } from '../controllers/restaurant.controller.js';

const router = express.Router();

router.get('/', getCustomerRestaurants);
router.get('/:id', getCustomerRestaurantById);

export default router;
