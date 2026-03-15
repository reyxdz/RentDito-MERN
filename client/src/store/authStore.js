import { create } from 'zustand';
import axios from 'axios';

const API_URL = '/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  register: async (fullName, email, password, role, phone = '') => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        fullName,
        email,
        password,
        role,
        phone
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({
        user,
        token,
        isAuthenticated: true,
        loading: false
      });
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({
        user,
        token,
        isAuthenticated: true,
        loading: false
      });
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },

  setUser: (user) => set({ user }),
  clearError: () => set({ error: null })
}));

export default useAuthStore;
