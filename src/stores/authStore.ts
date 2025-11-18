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

// 在同步创建 store 时读取 localStorage，避免首次渲染闪烁/重定向问题
const getInitialAuth = () => {
  if (typeof window === 'undefined') {
    return {
      isAuthenticated: false,
      userId: null,
      token: null,
    };
  }
  const token = localStorage.getItem('access_token');
  const userId = localStorage.getItem('user_id');
  const isAuthenticated = Boolean(token && userId);
  return {
    isAuthenticated,
    userId,
    token,
  };
};

const initial = getInitialAuth();

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: initial.isAuthenticated,
  userId: initial.userId,
  token: initial.token,

  // 兼容方法：如果你在别处还调用 initialize，可以继续使用它
  initialize: () => {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');
    if (token && userId) {
      set({ isAuthenticated: true, token, userId });
    } else {
      set({ isAuthenticated: false, token: null, userId: null });
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
