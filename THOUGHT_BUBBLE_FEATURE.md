# Thought Bubble Feature

## Overview

The Thought Bubble feature allows the frontend to display AI thinking processes in a collapsible, styled component. This improves user experience by:

- Making AI responses more transparent
- Reducing visual clutter by hiding technical details by default
- Allowing power users to inspect the reasoning process
- Providing a clean, Apple-inspired design

## Components

### 1. ThoughtBubble Component

**Location**: `src/components/ThoughtBubble.tsx`

A self-contained React component that displays thinking process content with:
- Collapsible/expandable UI
- Copy-to-clipboard functionality
- Dark/light mode support
- Smooth animations
- Accessibility support (ARIA)
- XSS protection via DOMPurify

**Props**:
```typescript
interface ThoughtBubbleProps {
  content: string;        // The thinking process text (can include HTML)
  defaultExpanded?: boolean; // Whether to show expanded by default
}
```

**Usage**:
```tsx
import ThoughtBubble from '../components/ThoughtBubble';

<ThoughtBubble 
  content="My thinking process here..." 
  defaultExpanded={false}
/>
```

### 2. MessageRenderer Component

**Location**: `src/components/MessageRenderer.tsx`

A utility component that:
- Parses message content for `<think>...</think>` tags
- Extracts thinking process from message content
- Renders ThoughtBubble for thinking process
- Displays cleaned message content
- Supports backend-provided `thoughts` field

**Props**:
```typescript
interface MessageRendererProps {
  content: string;    // Message content (may contain <think> tags)
  thoughts?: string;  // Optional separate thoughts field from backend
  className?: string; // Optional CSS class
}
```

**Usage**:
```tsx
import MessageRenderer from '../components/MessageRenderer';

// With embedded <think> tags
<MessageRenderer content="<think>Analysis...</think>My response" />

// With separate thoughts field (preferred)
<MessageRenderer 
  content="My response" 
  thoughts="Analysis..."
/>
```

### 3. useThoughtPreference Hook

**Location**: `src/hooks/useThoughtPreference.ts`

Custom React hook for managing user preferences:
- Reads/writes to localStorage
- Provides type-safe preference values
- Handles errors gracefully

**Usage**:
```tsx
import { useThoughtPreference } from '../hooks/useThoughtPreference';

const [preference, setPreference] = useThoughtPreference();

// preference is 'show' | 'hide'
// Default is 'hide'

// Change preference
setPreference('show'); // Automatically saves to localStorage
```

## Integration

### In Chat Messages

The Chat component (`src/pages/Chat.tsx`) integrates MessageRenderer for assistant messages:

```tsx
{msg.role === 'assistant' ? (
  <MessageRenderer
    content={msg.content}
    thoughts={msg.thoughts}
  />
) : (
  <div className="whitespace-pre-wrap break-words">
    {msg.content}
  </div>
)}
```

### Backend Integration

Two integration modes are supported:

#### Mode 1: Embedded `<think>` Tags (No Backend Changes)

The AI model returns messages with thinking process embedded in `<think>` tags:

```
<think>
First, I need to analyze the user's request...
Based on the requirements, I should...
</think>
Here's my response to your question...
```

MessageRenderer automatically detects and extracts these tags.

#### Mode 2: Separate Thoughts Field (Recommended)

The backend provides thoughts as a separate field:

```json
{
  "id": "msg-123",
  "content": "Here's my response to your question...",
  "thoughts": "First, I need to analyze the user's request...",
  "role": "assistant"
}
```

This requires updating the backend to:
1. Parse `<think>` tags during message processing
2. Store thoughts separately in the database
3. Return thoughts in the API response

The TypeScript type has been updated to support this:

```typescript
export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  thoughts?: string;  // ← New field
  rag_context?: string;
  rag_sources?: Array<{...}>;
  created_at: string;
}
```

## Styling

### CSS Module

**Location**: `src/components/ThoughtBubble.module.css`

Features:
- Apple-inspired design with rounded corners and subtle shadows
- Gradient backgrounds
- Smooth expand/collapse animations
- Dark mode support via `@media (prefers-color-scheme: dark)`
- Hover effects for interactive elements
- Responsive design

### Customization

To customize styling, edit `ThoughtBubble.module.css`:

```css
.thoughtBubble {
  /* Modify card appearance */
}

.header {
  /* Modify header layout */
}

.content {
  /* Modify content area */
}
```

## Security

### XSS Protection

All HTML content is sanitized using DOMPurify:

```typescript
const sanitizedContent = DOMPurify.sanitize(content, {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'code', 'pre', 
                  'ol', 'ul', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
});
```

This prevents XSS attacks while allowing safe HTML formatting.

### Message Content

Regular message content is sanitized with no HTML tags allowed:

```typescript
const sanitizedMessageContent = DOMPurify.sanitize(messageContent, {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
});
```

## User Preferences

Preferences are stored in `localStorage` under the key `thought-bubble-preference`.

Values:
- `'hide'` (default): Thought bubbles start collapsed
- `'show'`: Thought bubbles start expanded

Users can toggle this preference, and it persists across page reloads and sessions.

## Accessibility

The ThoughtBubble component includes:

- **ARIA attributes**: `role`, `aria-label`, `aria-expanded`, `aria-controls`
- **Keyboard navigation**: Buttons are focusable and follow standard keyboard patterns
- **Focus indicators**: Clear visual focus states for keyboard users
- **Semantic HTML**: Proper button elements and landmarks

## Demo Page

A demo page is available at `/demo/thought-bubble` (requires authentication).

**Location**: `src/pages/ThoughtBubbleDemo.tsx`

Features:
- Interactive preference toggle
- Example messages with various thought patterns
- Custom message tester
- Feature documentation

To access:
1. Start the dev server: `npm run dev`
2. Log in to the application
3. Navigate to `/demo/thought-bubble`

## Testing

### Manual Testing

1. **Test with `<think>` tags**:
   ```
   <think>Step 1: Analyze request\nStep 2: Generate response</think>Final answer
   ```

2. **Test without `<think>` tags**:
   ```
   Just a normal message
   ```

3. **Test with multiple `<think>` blocks**:
   ```
   <think>First thought</think>Some text<think>Second thought</think>More text
   ```

4. **Test with separate thoughts field**:
   ```typescript
   {
     content: "Final answer",
     thoughts: "My thinking process"
   }
   ```

5. **Test preference persistence**:
   - Toggle preference to "show"
   - Refresh page
   - Verify thought bubbles are expanded by default

6. **Test copy functionality**:
   - Expand a thought bubble
   - Click copy button
   - Paste to verify content copied

### Expected Behavior

✓ Thought bubbles are collapsed by default (unless preference is 'show')
✓ Clicking toggle button expands/collapses content
✓ Copy button appears when expanded
✓ Copy button copies raw text content
✓ Preference persists after page reload
✓ No `<think>` tags appear in message content
✓ XSS attempts are sanitized
✓ Dark mode styling works correctly

## Dependencies

### New Dependencies

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

### Existing Dependencies Used

- React (hooks: useState, useMemo)
- lucide-react (icons: ChevronDown, ChevronUp, Copy, Check)
- TypeScript

## Future Enhancements

Potential improvements:

1. **Syntax highlighting** for code in thoughts
2. **Markdown rendering** for formatted thoughts
3. **Collapsible sections** within thoughts
4. **Export thoughts** to file
5. **Search within thoughts**
6. **Statistics** on thinking time/complexity
7. **Settings page** for managing preferences
8. **Streaming thoughts** during generation

## Troubleshooting

### Thoughts not appearing

1. Check message content contains `<think>` tags or has `thoughts` field
2. Verify MessageRenderer is being used (not direct content rendering)
3. Check browser console for errors

### Styling issues

1. Ensure CSS module is imported correctly
2. Check dark mode media query support
3. Verify Tailwind classes are available

### Preference not persisting

1. Check localStorage is enabled in browser
2. Verify no browser extensions are blocking localStorage
3. Check browser console for errors

### Copy not working

1. Ensure HTTPS or localhost (clipboard API requirement)
2. Check browser clipboard permissions
3. Verify navigator.clipboard is available

## License

Same as main project license.
