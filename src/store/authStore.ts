import { create } from 'zustand';
import apiService from '../utils/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  xp?: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.login(credentials);
      const { user, token } = response.data;
      
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ isAuthenticated: true, user, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Gagal login. Periksa kembali email dan password Anda.' 
      });
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.register(userData);
      const { user, token } = response.data;
      
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ isAuthenticated: true, user, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Gagal mendaftar. Silakan coba lagi.' 
      });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Remove token and user from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      set({ isAuthenticated: true, user: JSON.parse(storedUser) });
      
      // Optional: Verify token with backend
      try {
        const response = await apiService.getUser();
        set({ user: response.data });
      } catch (error) {
        // If token is invalid, log out the user
        get().logout();
      }
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));