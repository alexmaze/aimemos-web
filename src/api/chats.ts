import apiClient from './client';
import type {
  ChatSession,
  ChatSessionCreate,
  ChatSessionUpdate,
  ChatMessage,
  ChatMessageCreate,
} from '../types';

export const chatApi = {
  // Sessions
  listSessions: async (skip = 0, limit = 100): Promise<ChatSession[]> => {
    const response = await apiClient.get<ChatSession[]>('/api/v1/chats', {
      params: { skip, limit },
    });
    return response.data;
  },

  getSession: async (id: string): Promise<ChatSession> => {
    const response = await apiClient.get<ChatSession>(`/api/v1/chats/${id}`);
    return response.data;
  },

  createSession: async (data: ChatSessionCreate): Promise<ChatSession> => {
    const response = await apiClient.post<ChatSession>('/api/v1/chats', data);
    return response.data;
  },

  updateSession: async (
    id: string,
    data: ChatSessionUpdate
  ): Promise<ChatSession> => {
    const response = await apiClient.put<ChatSession>(
      `/api/v1/chats/${id}`,
      data
    );
    return response.data;
  },

  deleteSession: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/chats/${id}`);
  },

  // Messages
  getMessages: async (
    sessionId: string,
    skip = 0,
    limit = 100
  ): Promise<ChatMessage[]> => {
    const response = await apiClient.get<ChatMessage[]>(
      `/api/v1/chats/${sessionId}/messages`,
      {
        params: { skip, limit },
      }
    );
    return response.data;
  },

  sendMessage: async (
    sessionId: string,
    data: ChatMessageCreate
  ): Promise<ReadableStream> => {
    const response = await apiClient.post(
      `/api/v1/chats/${sessionId}/messages`,
      data,
      {
        responseType: 'stream',
        headers: {
          Accept: 'text/event-stream',
        },
      }
    );
    return response.data;
  },
};
