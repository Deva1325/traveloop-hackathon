import { create } from 'zustand';
import { mockUser } from '@/data/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      await delay(1000); // Simulate API call
      // Mock validation
      if (email === 'alex@traveloop.com' && password === 'password') {
        localStorage.setItem('traveloop_token', 'mock_token_123');
        set({ user: mockUser, isAuthenticated: true, isLoading: false });
        return { success: true };
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true });
    try {
      await delay(1000);
      localStorage.setItem('traveloop_token', 'mock_token_123');
      const newUser = { id: 'u2', name, email, avatar: 'https://i.pravatar.cc/150?u=newuser' };
      set({ user: newUser, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('traveloop_token');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem('traveloop_token');
    if (token) {
      // In a real app, we'd fetch the user profile with the token
      set({ user: mockUser, isAuthenticated: true });
    } else {
      set({ user: null, isAuthenticated: false });
    }
  }
}));
