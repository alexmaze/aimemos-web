import { Link } from 'react-router-dom';
import { StickyNote, BookOpen, MessageSquare, FileText } from 'lucide-react';
import Layout from '../components/Layout';

export default function Home() {
  const features = [
    {
      icon: StickyNote,
      title: 'Memos',
      description: 'Quick notes and lightweight memos for your daily thoughts',
      path: '/memos',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: BookOpen,
      title: 'Knowledge Bases',
      description: 'Organize your documents and notes in structured knowledge bases',
      path: '/knowledge-bases',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: MessageSquare,
      title: 'AI Chat',
      description: 'Chat with AI assistant powered by your knowledge bases',
      path: '/chat',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: FileText,
      title: 'Documents',
      description: 'Upload and manage documents with powerful search capabilities',
      path: '/knowledge-bases',
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to AI Memos
          </h1>
          <p className="text-lg text-gray-600">
            Your personal AI-powered knowledge management system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className="card-hover group"
              >
                <div
                  className={`w-12 h-12 ${feature.color} rounded-apple flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h2>
                <p className="text-gray-600">{feature.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="card mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Getting Started
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">1.</span>
              <span>
                Create a <strong>Knowledge Base</strong> to organize your
                documents and notes
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">2.</span>
              <span>
                Add <strong>Documents</strong> and <strong>Notes</strong> to
                your knowledge bases
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">3.</span>
              <span>
                Use <strong>Memos</strong> for quick thoughts and reminders
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">4.</span>
              <span>
                Chat with the <strong>AI Assistant</strong> using your knowledge
                bases as context
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
