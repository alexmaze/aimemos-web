import { useState } from 'react';
import Layout from '../components/Layout';
import MessageRenderer from '../components/MessageRenderer';
import { useThoughtPreference } from '../hooks/useThoughtPreference';

export default function ThoughtBubbleDemo() {
  const [thoughtPreference, setThoughtPreference] = useThoughtPreference();
  
  // Example messages with think tags
  const exampleMessages = [
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Let me help you with that. <think>First, I need to analyze the user\'s request. They\'re asking about implementing a feature. I should break this down into steps and consider the best approach. The key considerations are: 1) Maintainability, 2) Performance, 3) User experience. Based on this analysis, I recommend...</think> Based on my analysis, I recommend starting with a modular approach that focuses on maintainability and performance.',
    },
    {
      id: '2',
      role: 'assistant' as const,
      content: '<think>这是一个关于中文思考过程的例子。我需要考虑以下几点：\n1. 用户的具体需求是什么？\n2. 最佳实现方案是什么？\n3. 可能遇到的问题有哪些？\n\n综合考虑后，我认为...</think>基于我的分析，我建议采用以下方案来实现这个功能。',
    },
    {
      id: '3',
      role: 'assistant' as const,
      content: 'This message has no thinking process, just a direct response.',
    },
    {
      id: '4',
      role: 'assistant' as const,
      content: '<think>Multiple thoughts example.\n\nThought 1: Initial analysis shows that we need to consider performance.\nThought 2: Security is also a major concern here.\nThought 3: User experience should not be compromised.\n\nConclusion: We need a balanced approach.</think>After careful consideration, here\'s my recommendation...',
    },
  ];

  const [customMessage, setCustomMessage] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-apple shadow-apple p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thought Bubble Component Demo
          </h1>
          <p className="text-gray-600 mb-4">
            This demo showcases the ThoughtBubble component that displays AI thinking processes.
          </p>

          {/* Preference Toggle */}
          <div className="bg-blue-50 rounded-apple p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">User Preference</h2>
            <div className="flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="preference"
                  value="hide"
                  checked={thoughtPreference === 'hide'}
                  onChange={(e) => setThoughtPreference(e.target.value as 'hide')}
                  className="mr-2"
                />
                <span className="text-gray-700">Default Hidden</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="preference"
                  value="show"
                  checked={thoughtPreference === 'show'}
                  onChange={(e) => setThoughtPreference(e.target.value as 'show')}
                  className="mr-2"
                />
                <span className="text-gray-700">Default Shown</span>
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Current preference: <strong>{thoughtPreference}</strong>
              <br />
              This preference is saved to localStorage and persists across page reloads.
            </p>
          </div>

          {/* Custom Message Tester */}
          <div className="bg-gray-50 rounded-apple p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Test Custom Message</h2>
            <textarea
              className="input-field mb-3"
              rows={4}
              placeholder="Enter a message with <think>your thinking process here</think> tags..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
            <button
              onClick={() => setShowCustom(true)}
              className="btn-primary"
              disabled={!customMessage.trim()}
            >
              Render Custom Message
            </button>
            {showCustom && customMessage && (
              <div className="mt-4 bg-white rounded-apple p-4 border border-gray-200">
                <MessageRenderer content={customMessage} />
              </div>
            )}
          </div>
        </div>

        {/* Example Messages */}
        <div className="bg-white rounded-apple shadow-apple p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Example Messages</h2>
          <div className="space-y-4">
            {exampleMessages.map((msg, idx) => (
              <div key={msg.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Example {idx + 1}</h3>
                <div className="bg-gray-100 text-gray-900 rounded-apple p-4">
                  <MessageRenderer content={msg.content} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-white rounded-apple shadow-apple p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Automatic detection and parsing of <code className="bg-gray-100 px-2 py-0.5 rounded">&lt;think&gt;</code> tags</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Collapsible thought bubbles with smooth animations</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Copy thought content to clipboard</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Dark/light mode styling support</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>User preference persistence via localStorage</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>XSS protection using DOMPurify</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>ARIA accessibility support</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Support for separate thoughts field from backend</span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
