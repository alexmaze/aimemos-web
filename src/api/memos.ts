import apiClient from './client';
import type { Memo, MemoCreate, MemoUpdate, MemoListResponse } from '../types';

export const memoApi = {
  list: async (skip = 0, limit = 100): Promise<MemoListResponse> => {
    const response = await apiClient.get<MemoListResponse>('/api/v1/memos', {
      params: { skip, limit },
    });
    return response.data;
  },

  search: async (query: string): Promise<Memo[]> => {
    const response = await apiClient.get<Memo[]>('/api/v1/memos/search', {
      params: { q: query },
    });
    return response.data;
  },

  get: async (id: string): Promise<Memo> => {
    const response = await apiClient.get<Memo>(`/api/v1/memos/${id}`);
    return response.data;
  },

  create: async (data: MemoCreate): Promise<Memo> => {
    const response = await apiClient.post<Memo>('/api/v1/memos', data);
    return response.data;
  },

  update: async (id: string, data: MemoUpdate): Promise<Memo> => {
    const response = await apiClient.put<Memo>(`/api/v1/memos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/memos/${id}`);
  },
};
