import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import ThoughtBubble from './ThoughtBubble';
import { useThoughtPreference } from '../hooks/useThoughtPreference';

interface MessageRendererProps {
  content: string;
  thoughts?: string;
  className?: string;
}

export default function MessageRenderer({ content, thoughts, className = '' }: MessageRendererProps) {
  const [thoughtPreference] = useThoughtPreference();

  const parsedMessage = useMemo(() => {
    // If thoughts are provided as a separate field, use them directly
    if (thoughts) {
      return {
        hasThoughts: true,
        thoughtContent: thoughts,
        messageContent: content,
      };
    }

    // Otherwise, parse content for <think> tags
    const thinkRegex = /<think>([\s\S]*?)<\/think>/gi;
    const matches = [...content.matchAll(thinkRegex)];

    if (matches.length === 0) {
      return {
        hasThoughts: false,
        thoughtContent: '',
        messageContent: content,
      };
    }

    // Extract all thought content
    const thoughtContent = matches.map(match => match[1]).join('\n\n');
    
    // Remove <think> tags from the message content
    const messageContent = content.replace(thinkRegex, '').trim();

    return {
      hasThoughts: true,
      thoughtContent,
      messageContent,
    };
  }, [content, thoughts]);

  const sanitizedMessageContent = useMemo(() => {
    // Sanitize HTML to prevent XSS
    return DOMPurify.sanitize(parsedMessage.messageContent, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }, [parsedMessage.messageContent]);

  return (
    <div className={className}>
      {parsedMessage.hasThoughts && (
        <ThoughtBubble
          content={parsedMessage.thoughtContent}
          defaultExpanded={thoughtPreference === 'show'}
        />
      )}
      <div className="whitespace-pre-wrap break-words">
        {sanitizedMessageContent}
      </div>
    </div>
  );
}
