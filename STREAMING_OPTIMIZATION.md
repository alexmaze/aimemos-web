# Streaming Thought Bubble Optimization

## Issue
When AI responses stream in with `<think>` tags, the thinking process would initially appear as plain text including the visible `<think>` tags. Only after the complete closing `</think>` tag was received would the content suddenly change to display in the styled ThoughtBubble component. This created a jarring visual flash.

## Root Cause
The `MessageRenderer` component uses `useMemo` to parse the message content for `<think>` tags. During streaming:
1. Content is accumulated character by character
2. The parser only recognizes a complete thought when both `<think>` and `</think>` tags are present
3. Until then, the raw text with tags shows as regular content

## Solution
Modified the streaming logic in `src/pages/Chat.tsx` to parse `<think>` tags in real-time as content streams in. The parser:

### Key Features
1. **Real-time Parsing**: Separates thought content from regular content during streaming
2. **Buffer Management**: Handles tags that are split across multiple chunks (e.g., chunk 1: `<thi`, chunk 2: `nk>`)
3. **Dual Content Tracking**: Maintains separate `thoughtContent` and `regularContent` variables
4. **Immediate Display**: Stores thoughts in the `thoughts` field from the moment `<think>` is detected

### Implementation Details

#### Variables
- `buffer`: Temporary storage for incomplete tag boundaries
- `thoughtContent`: Accumulated content inside `<think>` tags
- `regularContent`: Accumulated content outside `<think>` tags
- `insideThinkTag`: Boolean flag tracking current parsing state

#### Parsing Logic
```
For each streaming chunk:
  1. Add chunk to buffer
  2. While buffer has content:
     If inside <think> tag:
       - Look for </think>
       - If found: extract thought, continue with remaining
       - If not found but might be partial: keep in buffer
       - Otherwise: add to thought content
     Else:
       - Look for <think>
       - If found: extract regular content, enter think mode
       - If not found but might be partial: keep in buffer
       - Otherwise: add to regular content
```

#### Edge Cases Handled
1. **Complete tags in one chunk**: `<think>thought</think>text`
2. **Split opening tag**: `<thi` → `nk>content`
3. **Split closing tag**: `content</th` → `ink>text`
4. **Multiple think blocks**: `<think>A</think>text<think>B</think>`
5. **No think tags**: Regular messages work as before
6. **Incomplete closing tag**: Properly buffered until complete

## Result
- ThoughtBubble displays with correct styling immediately when `<think>` starts
- No more flash of raw `<think>` tags as plain text
- Smooth streaming experience for users
- All content properly separated between thoughts and regular response

## Testing
Comprehensive test suite validates:
- ✓ Complete tags in single chunk
- ✓ Tags split across multiple chunks
- ✓ Multiple think blocks in same message
- ✓ Messages without think tags
- ✓ Incomplete tags at chunk boundaries

## Security
- No security vulnerabilities introduced (verified with CodeQL)
- Uses existing DOMPurify sanitization in ThoughtBubble and MessageRenderer
- No XSS risks

## Backward Compatibility
- Fully compatible with existing `MessageRenderer` component
- Existing messages with separate `thoughts` field continue to work
- No changes needed to ThoughtBubble component
- No breaking changes to API or data structures
