import { create } from 'zustand';
import { authApi } from '../api/auth';
import type { UserLogin, UserCreate } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  token: string | null;
  login: (data: UserLogin) => Promise<void>;
  register: (data: UserCreate) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  token: null,

  initialize: () => {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');
    if (token && userId) {
      set({ isAuthenticated: true, token, userId });
    }
  },

  login: async (data: UserLogin) => {
    const response = await authApi.login(data);
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user_id', data.user_id);
    set({
      isAuthenticated: true,
      token: response.access_token,
      userId: data.user_id,
    });
  },

  register: async (data: UserCreate) => {
    const response = await authApi.register(data);
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user_id', data.user_id);
    set({
      isAuthenticated: true,
      token: response.access_token,
      userId: data.user_id,
    });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    set({ isAuthenticated: false, token: null, userId: null });
  },
}));
