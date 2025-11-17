// 认证类型
export interface UserLogin {
  user_id: string;
  password: string;
}

export interface UserCreate extends UserLogin {}

export interface Token {
  access_token: string;
  token_type: string;
}

// 备忘录类型
export interface Memo {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface MemoCreate {
  title: string;
  content: string;
  tags?: string[];
}

export interface MemoUpdate {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface MemoListResponse {
  items: Memo[];
  total: number;
  skip: number;
  limit: number;
}

// 知识库类型
export interface KnowledgeBase {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  cover_image?: string;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeBaseCreate {
  name: string;
  description?: string;
  cover_image?: string;
}

export interface KnowledgeBaseUpdate {
  name?: string;
  description?: string;
  cover_image?: string;
}

export interface KnowledgeBaseListResponse {
  items: KnowledgeBase[];
  total: number;
  skip: number;
  limit: number;
}

// 文档类型
export interface Document {
  id: string;
  knowledge_base_id: string;
  folder_id?: string;
  user_id: string;
  name: string;
  summary?: string;
  doc_type: 'note' | 'uploaded' | 'folder';
  content: string;
  path?: string;
  source_file_path?: string;
  source_file_size?: number;
  source_file_format?: string;
  source_file_created_at?: string;
  source_file_modified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentCreate {
  name: string;
  summary?: string;
  folder_id?: string;
  content?: string;
}

export interface FolderCreate {
  name: string;
  folder_id?: string;
}

export interface DocumentUpdate {
  name?: string;
  summary?: string;
  content?: string;
  folder_id?: string;
}

export interface DocumentListResponse {
  items: Document[];
  total: number;
  skip: number;
  limit: number;
}

// 聊天类型
export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  knowledge_base_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSessionCreate {
  title: string;
  knowledge_base_id?: string;
}

export interface ChatSessionUpdate {
  title?: string;
  knowledge_base_id?: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  rag_context?: string;
  rag_sources?: Array<{
    content: string;
    source: string;
    score: number;
    metadata: Record<string, any>;
  }>;
  created_at: string;
}

export interface ChatMessageCreate {
  content: string;
}

// RAG 类型
export interface RAGSearchRequest {
  query: string;
  kb_id?: string;
  top_k?: number;
}

export interface RAGSearchResult {
  content: string;
  source: string;
  score: number;
  metadata: Record<string, any>;
}

export interface RAGSearchResponse {
  query: string;
  kb_id?: string;
  results: RAGSearchResult[];
  total: number;
}
