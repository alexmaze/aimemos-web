import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Tag, X } from 'lucide-react';
import Layout from '../components/Layout';
import { memoApi } from '../api/memos';
import type { Memo, MemoCreate } from '../types';

export default function Memos() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);
  const [formData, setFormData] = useState<MemoCreate>({
    title: '',
    content: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = async () => {
    try {
      setLoading(true);
      const response = await memoApi.list();
      setMemos(response.items);
    } catch (error) {
      console.error('Failed to load memos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadMemos();
      return;
    }
    try {
      const results = await memoApi.search(searchQuery);
      setMemos(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleCreate = () => {
    setEditingMemo(null);
    setFormData({ title: '', content: '', tags: [] });
    setShowModal(true);
  };

  const handleEdit = (memo: Memo) => {
    setEditingMemo(memo);
    setFormData({
      title: memo.title,
      content: memo.content,
      tags: memo.tags,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMemo) {
        await memoApi.update(editingMemo.id, formData);
      } else {
        await memoApi.create(formData);
      }
      setShowModal(false);
      loadMemos();
    } catch (error) {
      console.error('Failed to save memo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memo?')) return;
    try {
      await memoApi.delete(id);
      loadMemos();
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Memos</h1>
          <button onClick={handleCreate} className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            New Memo
          </button>
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
              placeholder="Search memos..."
              className="input-field pl-10"
            />
          </div>
          <button onClick={handleSearch} className="btn-secondary">
            Search
          </button>
        </div>

        {/* Memos List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : memos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No memos yet</p>
            <button onClick={handleCreate} className="btn-primary">
              Create Your First Memo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memos.map((memo) => (
              <div key={memo.id} className="card hover:shadow-apple-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {memo.title}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(memo)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(memo.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {memo.content}
                </p>
                {memo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {memo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-apple"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-3 text-xs text-gray-400">
                  {new Date(memo.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-apple shadow-apple-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingMemo ? 'Edit Memo' : 'New Memo'}
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
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="input-field"
                      required
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      className="input-field min-h-[200px]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        className="input-field flex-1"
                        placeholder="Add a tag..."
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="btn-secondary"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-apple"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
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
                      {editingMemo ? 'Update' : 'Create'}
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
