import { create } from 'zustand';
import api from '../services/api';

export const useCartStore = create((set, get) => ({
  cart: {
    restaurantId: null,
    items: [],
    totalAmount: 0
  },
  isLoading: false,

  fetchCart: async () => {
    try {
      const res = await api.get('/cart');
      set({ cart: res.data.data });
    } catch (err) {
      console.error('Cart fetch failed:', err);
    }
  },

  addItem: async (food, restaurantId) => {
    try {
      const res = await api.post('/cart/items', {
        foodId: food._id,
        restaurantId,
        quantity: 1
      });
      set({ cart: res.data.data });
    } catch (err) {
      // Local fallback if unauthenticated
      const currentCart = get().cart;
      let items = [...currentCart.items];
      let newRestId = restaurantId;

      if (currentCart.restaurantId && currentCart.restaurantId !== restaurantId) {
        items = [];
      }

      const existingIndex = items.findIndex((i) => i.foodId === food._id);
      if (existingIndex > -1) {
        items[existingIndex].quantity += 1;
      } else {
        items.push({ foodId: food._id, name: food.name, price: food.price, quantity: 1 });
      }

      const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      set({ cart: { restaurantId: newRestId, items, totalAmount } });
    }
  },

  updateQuantity: async (foodId, quantity) => {
    try {
      const res = await api.put(`/cart/items/${foodId}`, { quantity });
      set({ cart: res.data.data });
    } catch (err) {
      const currentCart = get().cart;
      let items = [...currentCart.items];
      const index = items.findIndex((i) => (i.foodId._id || i.foodId) === foodId);

      if (index > -1) {
        if (quantity <= 0) {
          items.splice(index, 1);
        } else {
          items[index].quantity = quantity;
        }
      }

      const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      set({ cart: { ...currentCart, items, totalAmount } });
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart/clear');
    } catch (err) {}
    set({ cart: { restaurantId: null, items: [], totalAmount: 0 } });
  }
}));
