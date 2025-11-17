import apiClient from './client';
import type {
  KnowledgeBase,
  KnowledgeBaseCreate,
  KnowledgeBaseUpdate,
  KnowledgeBaseListResponse,
} from '../types';

export const knowledgeBaseApi = {
  list: async (skip = 0, limit = 100): Promise<KnowledgeBaseListResponse> => {
    const response = await apiClient.get<KnowledgeBaseListResponse>(
      '/api/v1/knowledge-bases',
      { params: { skip, limit } }
    );
    return response.data;
  },

  get: async (id: string): Promise<KnowledgeBase> => {
    const response = await apiClient.get<KnowledgeBase>(
      `/api/v1/knowledge-bases/${id}`
    );
    return response.data;
  },

  create: async (data: KnowledgeBaseCreate): Promise<KnowledgeBase> => {
    const response = await apiClient.post<KnowledgeBase>(
      '/api/v1/knowledge-bases',
      data
    );
    return response.data;
  },

  update: async (
    id: string,
    data: KnowledgeBaseUpdate
  ): Promise<KnowledgeBase> => {
    const response = await apiClient.put<KnowledgeBase>(
      `/api/v1/knowledge-bases/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/knowledge-bases/${id}`);
  },
};
