import Cart from '../models/cart.model.js';
import Food from '../models/food.model.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.foodId');
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [], totalAmount: 0 });
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { foodId, restaurantId, quantity = 1 } = req.body;

    const food = await Food.findById(foodId);
    if (!food || !food.isAvailable) {
      return res.status(400).json({ message: 'Food item is not available', code: 'UNAVAILABLE' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        restaurantId,
        items: [{ foodId, name: food.name, price: food.price, quantity }],
        totalAmount: food.price * quantity
      });
    } else {
      // If adding from a different restaurant, reset cart for new restaurant
      if (cart.restaurantId && cart.restaurantId.toString() !== restaurantId && cart.items.length > 0) {
        cart.restaurantId = restaurantId;
        cart.items = [];
      } else {
        cart.restaurantId = restaurantId;
      }

      const existingItemIndex = cart.items.findIndex((item) => item.foodId.toString() === foodId);
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ foodId, name: food.name, price: food.price, quantity });
      }

      cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found', code: 'NOT_FOUND' });
    }

    const itemIndex = cart.items.findIndex((item) => item.foodId.toString() === foodId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not in cart', code: 'NOT_FOUND' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { items: [], totalAmount: 0, restaurantId: null },
      { new: true }
    );
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};
