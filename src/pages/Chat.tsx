import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Send,
  MessageSquare,
  Trash2,
  X,
  BookOpen,
} from 'lucide-react';
import Layout from '../components/Layout';
import { chatApi } from '../api/chats';
import { knowledgeBaseApi } from '../api/knowledgeBases';
import type {
  ChatSession,
  ChatMessage,
  ChatSessionCreate,
  KnowledgeBase,
} from '../types';

export default function Chat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionKbId, setNewSessionKbId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessions();
    loadKnowledgeBases();
  }, []);

  useEffect(() => {
    if (currentSession) {
      loadMessages();
    }
  }, [currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSessions = async () => {
    try {
      const data = await chatApi.listSessions();
      setSessions(data);
      if (data.length > 0 && !currentSession) {
        setCurrentSession(data[0]);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const loadKnowledgeBases = async () => {
    try {
      const response = await knowledgeBaseApi.list();
      setKnowledgeBases(response.items);
    } catch (error) {
      console.error('Failed to load knowledge bases:', error);
    }
  };

  const loadMessages = async () => {
    if (!currentSession) return;
    try {
      setLoading(true);
      const data = await chatApi.getMessages(currentSession.id);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: ChatSessionCreate = {
        title: newSessionTitle,
        knowledge_base_id: newSessionKbId || undefined,
      };
      const newSession = await chatApi.createSession(data);
      setSessions([newSession, ...sessions]);
      setCurrentSession(newSession);
      setShowNewSessionModal(false);
      setNewSessionTitle('');
      setNewSessionKbId('');
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!confirm('确定要删除这个对话会话吗？')) return;
    try {
      await chatApi.deleteSession(id);
      setSessions(sessions.filter((s) => s.id !== id));
      if (currentSession?.id === id) {
        setCurrentSession(sessions[0] || null);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentSession || sending) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setSending(true);

    // Add user message to UI immediately
    const tempUserMsg: ChatMessage = {
      id: 'temp-' + Date.now(),
      session_id: currentSession.id,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages([...messages, tempUserMsg]);

    try {
      // Note: For proper streaming, we would need to use fetch API with EventSource
      // This is a simplified version that uses the API
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/chats/${currentSession.id}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({ content: userMessage }),
        }
      );

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'message' && data.content) {
                  assistantContent += data.content;
                  // Update the assistant message in real-time
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg && lastMsg.role === 'assistant') {
                      lastMsg.content = assistantContent;
                    } else {
                      newMessages.push({
                        id: 'temp-assistant-' + Date.now(),
                        session_id: currentSession.id,
                        role: 'assistant',
                        content: assistantContent,
                        created_at: new Date().toISOString(),
                      });
                    }
                    return newMessages;
                  });
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }

      // Reload messages to get the final state from server
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-8rem)] space-x-6">
        {/* Sessions Sidebar */}
        <div className="w-80 bg-white rounded-apple shadow-apple flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setShowNewSessionModal(true)}
              className="btn-primary w-full flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setCurrentSession(session)}
                className={`p-3 rounded-apple cursor-pointer group relative ${
                  currentSession?.id === session.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <h3 className="font-medium text-gray-900 truncate">
                        {session.title}
                      </h3>
                    </div>
                    {session.knowledge_base_id && (
                      <div className="flex items-center text-xs text-gray-500">
                        <BookOpen className="w-3 h-3 mr-1" />
                        With KB
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(session.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-apple shadow-apple flex flex-col">
          {currentSession ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentSession.title}
                </h2>
                {currentSession.knowledge_base_id && (
                  <p className="text-sm text-gray-500 mt-1">
                    Using knowledge base context
                  </p>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loading ? (
                  <div className="text-center text-gray-500">加载中...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    Start a conversation by sending a message below
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-apple p-4 ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {msg.content}
                        </div>
                        {msg.rag_sources && msg.rag_sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <p className="text-xs font-semibold mb-2">
                              Sources:
                            </p>
                            {msg.rag_sources.map((source, idx) => (
                              <div key={idx} className="text-xs mb-1">
                                📄 {source.source}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="输入您的消息..."
                    className="input-field flex-1"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputMessage.trim()}
                    className="btn-primary flex items-center"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="mb-4">未选择对话会话</p>
                <button
                  onClick={() => setShowNewSessionModal(true)}
                  className="btn-primary"
                >
                  Start New Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Session Modal */}
      {showNewSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-apple shadow-apple-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">新建对话</h2>
              <button
                onClick={() => setShowNewSessionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Project Discussion"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Knowledge Base (optional)
                </label>
                <select
                  value={newSessionKbId}
                  onChange={(e) => setNewSessionKbId(e.target.value)}
                  className="input-field"
                >
                  <option value="">无 - 普通对话</option>
                  {knowledgeBases.map((kb) => (
                    <option key={kb.id} value={kb.id}>
                      {kb.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Select a knowledge base to enable RAG-powered responses
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewSessionModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
