import { create } from 'zustand';
import api from '../services/api';

export const useAdminAuthStore = create((set) => ({
  admin: JSON.parse(localStorage.getItem('chronobite_admin_user') || 'null'),
  token: localStorage.getItem('chronobite_admin_token') || null,
  isAuthenticated: !!localStorage.getItem('chronobite_admin_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/admin/login', { email, password });
      const { token, admin } = res.data.data;

      localStorage.setItem('chronobite_admin_token', token);
      localStorage.setItem('chronobite_admin_user', JSON.stringify(admin));

      set({ admin, token, isAuthenticated: true, isLoading: false });
      return admin;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('chronobite_admin_token');
    localStorage.removeItem('chronobite_admin_user');
    set({ admin: null, token: null, isAuthenticated: false });
  }
}));
