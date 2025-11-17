import apiClient from './client';
import type {
  Document,
  DocumentCreate,
  FolderCreate,
  DocumentUpdate,
  DocumentListResponse,
} from '../types';

export const documentApi = {
  list: async (
    kbId: string,
    folderId?: string,
    skip = 0,
    limit = 100
  ): Promise<DocumentListResponse> => {
    const response = await apiClient.get<DocumentListResponse>(
      '/api/v1/documents',
      {
        params: { kb_id: kbId, folder_id: folderId, skip, limit },
      }
    );
    return response.data;
  },

  search: async (kbId: string, query: string): Promise<Document[]> => {
    const response = await apiClient.get<Document[]>(
      '/api/v1/documents/search',
      {
        params: { kb_id: kbId, q: query },
      }
    );
    return response.data;
  },

  get: async (id: string): Promise<Document> => {
    const response = await apiClient.get<Document>(`/api/v1/documents/${id}`);
    return response.data;
  },

  createNote: async (kbId: string, data: DocumentCreate): Promise<Document> => {
    const response = await apiClient.post<Document>('/api/v1/documents', data, {
      params: { kb_id: kbId },
    });
    return response.data;
  },

  createFolder: async (kbId: string, data: FolderCreate): Promise<Document> => {
    const response = await apiClient.post<Document>(
      '/api/v1/documents/folder',
      data,
      {
        params: { kb_id: kbId },
      }
    );
    return response.data;
  },

  upload: async (
    kbId: string,
    file: File,
    folderId?: string,
    summary?: string
  ): Promise<Document> => {
    const formData = new FormData();
    formData.append('kb_id', kbId);
    formData.append('file', file);
    if (folderId) formData.append('folder_id', folderId);
    if (summary) formData.append('summary', summary);

    const response = await apiClient.post<Document>(
      '/api/v1/documents/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  update: async (id: string, data: DocumentUpdate): Promise<Document> => {
    const response = await apiClient.put<Document>(
      `/api/v1/documents/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/documents/${id}`);
  },
};
