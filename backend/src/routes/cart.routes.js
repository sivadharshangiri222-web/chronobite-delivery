import express from 'express';
import { getCart, addToCart, updateCartItem, clearCart } from '../controllers/cart.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { customerOnly } from '../middleware/roleCheck.middleware.js';

const router = express.Router();

router.use(authMiddleware, customerOnly);

router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items/:foodId', updateCartItem);
router.delete('/clear', clearCart);

export default router;
