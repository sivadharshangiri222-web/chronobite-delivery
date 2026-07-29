import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('chronobite_user') || 'null'),
  token: localStorage.getItem('chronobite_token') || null,
  isAuthenticated: !!localStorage.getItem('chronobite_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data.data;
      localStorage.setItem('chronobite_token', token);
      localStorage.setItem('chronobite_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', userData);
      const { token, user } = res.data.data;
      localStorage.setItem('chronobite_token', token);
      localStorage.setItem('chronobite_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('chronobite_token');
    localStorage.removeItem('chronobite_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateProfile: async (updatedData) => {
    try {
      const res = await api.put('/auth/profile', updatedData);
      const user = res.data.data;
      localStorage.setItem('chronobite_user', JSON.stringify(user));
      set({ user });
      return user;
    } catch (err) {
      throw err;
    }
  }
}));
