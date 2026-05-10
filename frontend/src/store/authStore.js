import { create } from 'zustand';
import axiosInstance from '@/api/axios';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token, user } = response.data.data;

      localStorage.setItem('traveloop_token', token);
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      throw errorMsg;
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/auth/register', { name, email, password });
      const { token, user } = response.data.data;

      localStorage.setItem('traveloop_token', token);
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      throw error.response?.data?.message || error.message || 'Signup failed';
    }
  },

  logout: () => {
    localStorage.removeItem('traveloop_token');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('traveloop_token');
    if (!token) {
      set({ user: null, isAuthenticated: false, isInitialized: true });
      return;
    }

    try {
      const response = await axiosInstance.get('/auth/profile');
      set({ user: response.data.data, isAuthenticated: true, isInitialized: true });
    } catch (error) {
      localStorage.removeItem('traveloop_token');
      set({ user: null, isAuthenticated: false, isInitialized: true });
    }
  }
}));
