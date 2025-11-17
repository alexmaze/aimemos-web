import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Save, ArrowLeft, Eye, Edit2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from '../components/Layout';
import { documentApi } from '../api/documents';
import type { Document, DocumentCreate } from '../types';

export default function DocumentEditor() {
  const { docId } = useParams<{ docId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isNewDocument = docId === 'new';
  const kbId = searchParams.get('kb_id');
  const folderId = searchParams.get('folder_id');

  useEffect(() => {
    if (!isNewDocument && docId) {
      loadDocument();
    }
  }, [docId]);

  const loadDocument = async () => {
    if (!docId) return;
    try {
      setLoading(true);
      const doc = await documentApi.get(docId);
      setDocument(doc);
      setName(doc.name);
      setContent(doc.content || '');
      setSummary(doc.summary || '');
    } catch (error) {
      console.error('Failed to load document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNewDocument) {
        if (!kbId) {
          alert('Knowledge base ID is required');
          return;
        }
        const data: DocumentCreate = {
          name,
          content,
          summary,
          folder_id: folderId || undefined,
        };
        const newDoc = await documentApi.createNote(kbId, data);
        navigate(`/documents/${newDoc.id}`);
      } else if (docId) {
        await documentApi.update(docId, { name, content, summary });
        loadDocument();
      }
    } catch (error) {
      console.error('Failed to save document:', error);
      alert('Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (document) {
      navigate(`/knowledge-bases/${document.knowledge_base_id}/documents`);
    } else if (kbId) {
      navigate(`/knowledge-bases/${kbId}/documents`);
    } else {
      navigate('/knowledge-bases');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12 text-gray-500">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="btn-secondary flex items-center"
            >
              {isPreview ? (
                <>
                  <Edit2 className="w-5 h-5 mr-2" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5 mr-2" />
                  Preview
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Document Form */}
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field text-2xl font-bold"
              placeholder="Untitled Document"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary (optional)
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="input-field"
              placeholder="Brief summary of the document..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            {isPreview ? (
              <div className="prose max-w-none min-h-[500px] p-6 border border-gray-200 rounded-apple bg-gray-50">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || '*No content*'}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field min-h-[500px] font-mono text-sm"
                placeholder="Write your content in Markdown..."
              />
            )}
            <p className="mt-2 text-sm text-gray-500">
              Supports Markdown formatting
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
