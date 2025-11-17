import apiClient from './client';
import type { UserLogin, UserCreate, Token } from '../types';

export const authApi = {
  login: async (data: UserLogin): Promise<Token> => {
    const response = await apiClient.post<Token>('/api/v1/auth/login', data);
    return response.data;
  },

  register: async (data: UserCreate): Promise<Token> => {
    const response = await apiClient.post<Token>('/api/v1/auth/register', data);
    return response.data;
  },
};
