import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import DOMPurify from 'dompurify';
import styles from './ThoughtBubble.module.css';

interface ThoughtBubbleProps {
  content: string;
  defaultExpanded?: boolean;
}

export default function ThoughtBubble({ content, defaultExpanded = false }: ThoughtBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'code', 'pre', 'ol', 'ul', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });

  return (
    <div className={styles.thoughtBubble} role="article" aria-label="AI Thinking Process">
      <div className={styles.header}>
        <button
          className={styles.toggleButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="thought-content"
        >
          {isExpanded ? (
            <ChevronUp className={styles.icon} />
          ) : (
            <ChevronDown className={styles.icon} />
          )}
          <span className={styles.headerText}>
            {isExpanded ? '隐藏思考过程' : '显示思考过程'}
          </span>
        </button>
        {isExpanded && (
          <button
            className={styles.copyButton}
            onClick={handleCopy}
            aria-label="Copy thinking process"
            title="复制思考过程"
          >
            {copied ? (
              <Check className={styles.icon} />
            ) : (
              <Copy className={styles.icon} />
            )}
          </button>
        )}
      </div>
      {isExpanded && (
        <div
          id="thought-content"
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      )}
    </div>
  );
}
