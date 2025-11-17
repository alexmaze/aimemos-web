import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Folder,
  FileText,
  Trash2,
  ChevronRight,
  Home,
  Upload,
  FolderPlus,
  Search,
} from 'lucide-react';
import Layout from '../components/Layout';
import { documentApi } from '../api/documents';
import { knowledgeBaseApi } from '../api/knowledgeBases';
import type { Document, KnowledgeBase } from '../types';

export default function Documents() {
  const { kbId } = useParams<{ kbId: string }>();
  const navigate = useNavigate();
  const [kb, setKb] = useState<KnowledgeBase | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>();
  const [folderPath, setFolderPath] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSummary, setUploadSummary] = useState('');

  useEffect(() => {
    if (kbId) {
      loadKnowledgeBase();
      loadDocuments();
    }
  }, [kbId, currentFolderId]);

  const loadKnowledgeBase = async () => {
    if (!kbId) return;
    try {
      const data = await knowledgeBaseApi.get(kbId);
      setKb(data);
    } catch (error) {
      console.error('Failed to load knowledge base:', error);
    }
  };

  const loadDocuments = async () => {
    if (!kbId) return;
    try {
      setLoading(true);
      const response = await documentApi.list(kbId, currentFolderId);
      setDocuments(response.items);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!kbId || !searchQuery.trim()) {
      loadDocuments();
      return;
    }
    try {
      const results = await documentApi.search(kbId, searchQuery);
      setDocuments(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const openFolder = async (folder: Document) => {
    setCurrentFolderId(folder.id);
    setFolderPath([...folderPath, folder]);
  };

  const navigateToFolder = (index: number) => {
    if (index === -1) {
      setCurrentFolderId(undefined);
      setFolderPath([]);
    } else {
      const folder = folderPath[index];
      setCurrentFolderId(folder.id);
      setFolderPath(folderPath.slice(0, index + 1));
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kbId) return;
    try {
      await documentApi.createFolder(kbId, {
        name: folderName,
        folder_id: currentFolderId,
      });
      setShowCreateFolder(false);
      setFolderName('');
      loadDocuments();
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kbId || !uploadFile) return;
    try {
      await documentApi.upload(kbId, uploadFile, currentFolderId, uploadSummary);
      setShowUpload(false);
      setUploadFile(null);
      setUploadSummary('');
      loadDocuments();
    } catch (error) {
      console.error('Failed to upload document:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除吗？')) return;
    try {
      await documentApi.delete(id);
      loadDocuments();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const openDocument = (doc: Document) => {
    if (doc.doc_type === 'folder') {
      openFolder(doc);
    } else {
      navigate(`/documents/${doc.id}`);
    }
  };

  const createNote = () => {
    navigate(`/documents/new?kb_id=${kbId}&folder_id=${currentFolderId || ''}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <button
              onClick={() => navigate('/knowledge-bases')}
              className="hover:text-blue-600"
            >
              Knowledge Bases
            </button>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-gray-900 font-medium">{kb?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">文档</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCreateFolder(true)}
                className="btn-secondary flex items-center"
              >
                <FolderPlus className="w-5 h-5 mr-2" />
                New Folder
              </button>
              <button
                onClick={() => setShowUpload(true)}
                className="btn-secondary flex items-center"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload
              </button>
              <button onClick={createNote} className="btn-primary flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                New Note
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={() => navigateToFolder(-1)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <Home className="w-4 h-4 mr-1" />
            Root
          </button>
          {folderPath.map((folder, index) => (
            <div key={folder.id} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => navigateToFolder(index)}
                className="text-gray-600 hover:text-blue-600"
              >
                {folder.name}
              </button>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索文档..."
              className="input-field pl-10"
            />
          </div>
          <button onClick={handleSearch} className="btn-secondary">
            Search
          </button>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">此文件夹中没有文档</p>
            <button onClick={createNote} className="btn-primary">
              Create Your First Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => openDocument(doc)}
                className="card-hover group relative"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc.id);
                    }}
                    className="p-2 bg-white rounded-apple shadow-apple text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-start space-x-3">
                  <div
                    className={`w-12 h-12 ${
                      doc.doc_type === 'folder'
                        ? 'bg-yellow-50 text-yellow-600'
                        : doc.doc_type === 'note'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-green-50 text-green-600'
                    } rounded-apple flex items-center justify-center flex-shrink-0`}
                  >
                    {doc.doc_type === 'folder' ? (
                      <Folder className="w-6 h-6" />
                    ) : (
                      <FileText className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">
                      {doc.name}
                    </h3>
                    {doc.summary && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {doc.summary}
                      </p>
                    )}
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(doc.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Folder Modal */}
        {showCreateFolder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-apple shadow-apple-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Create Folder
              </h2>
              <form onSubmit={handleCreateFolder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    className="input-field"
                    required
                    autoFocus
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateFolder(false)}
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

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-apple shadow-apple-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Upload Document
              </h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setUploadFile(e.target.files?.[0] || null)
                    }
                    className="input-field"
                    accept=".txt,.md,.doc,.docx,.pdf"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: txt, md, doc, docx, pdf
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Summary (optional)
                  </label>
                  <textarea
                    value={uploadSummary}
                    onChange={(e) => setUploadSummary(e.target.value)}
                    className="input-field min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUpload(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
