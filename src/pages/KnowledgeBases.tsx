import { useState, useEffect } from 'react';
import { Plus, BookOpen, Edit, Trash2, X, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { knowledgeBaseApi } from '../api/knowledgeBases';
import type { KnowledgeBase, KnowledgeBaseCreate } from '../types';

export default function KnowledgeBases() {
  const navigate = useNavigate();
  const [kbs, setKbs] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingKb, setEditingKb] = useState<KnowledgeBase | null>(null);
  const [formData, setFormData] = useState<KnowledgeBaseCreate>({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadKnowledgeBases();
  }, []);

  const loadKnowledgeBases = async () => {
    try {
      setLoading(true);
      const response = await knowledgeBaseApi.list();
      setKbs(response.items);
    } catch (error) {
      console.error('Failed to load knowledge bases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingKb(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (kb: KnowledgeBase) => {
    setEditingKb(kb);
    setFormData({
      name: kb.name,
      description: kb.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingKb) {
        await knowledgeBaseApi.update(editingKb.id, formData);
      } else {
        await knowledgeBaseApi.create(formData);
      }
      setShowModal(false);
      loadKnowledgeBases();
    } catch (error) {
      console.error('Failed to save knowledge base:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this knowledge base?'))
      return;
    try {
      await knowledgeBaseApi.delete(id);
      loadKnowledgeBases();
    } catch (error) {
      console.error('Failed to delete knowledge base:', error);
    }
  };

  const openKnowledgeBase = (id: string) => {
    navigate(`/knowledge-bases/${id}/documents`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Bases</h1>
          <button onClick={handleCreate} className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            New Knowledge Base
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : kbs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No knowledge bases yet</p>
            <button onClick={handleCreate} className="btn-primary">
              Create Your First Knowledge Base
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kbs.map((kb) => (
              <div
                key={kb.id}
                className="card-hover group relative"
              >
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(kb);
                    }}
                    className="p-2 bg-white rounded-apple shadow-apple text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(kb.id);
                    }}
                    className="p-2 bg-white rounded-apple shadow-apple text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div onClick={() => openKnowledgeBase(kb.id)}>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-apple flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {kb.name}
                  </h3>
                  {kb.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {kb.description}
                    </p>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Click to view documents
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    Created {new Date(kb.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-apple shadow-apple-lg max-w-lg w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingKb ? 'Edit Knowledge Base' : 'New Knowledge Base'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="input-field"
                      required
                      maxLength={200}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="input-field min-h-[100px]"
                      maxLength={1000}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      {editingKb ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
