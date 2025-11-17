# Quick Start Guide

## Prerequisites

1. **Backend Server**: You need to have the [aimemos](https://github.com/alexmaze/aimemos) backend running
   ```bash
   # In the aimemos repository
   uv run aimemos
   # Server will start on http://localhost:8000
   ```

2. **Node.js**: Version 18 or higher

## Installation

1. Clone and install:
   ```bash
   git clone https://github.com/alexmaze/aimemos-web.git
   cd aimemos-web
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   
   Open http://localhost:5173 in your browser

## First Use

1. **Register Account**: Click "Sign up" on the login page
2. **Create Knowledge Base**: Navigate to Knowledge Bases → New Knowledge Base
3. **Add Documents**: 
   - Click on a knowledge base to view documents
   - Create notes with "New Note"
   - Upload files with "Upload"
   - Organize with "New Folder"
4. **Use Memos**: Quick notes for daily thoughts at Memos page
5. **Chat with AI**: 
   - Go to Chat page
   - Create new session
   - Select a knowledge base for RAG-powered responses
   - Start chatting!

## Common Tasks

### Create a Memo
1. Go to Memos page
2. Click "New Memo"
3. Enter title, content, and optional tags
4. Click "Create"

### Create a Note
1. Navigate to Knowledge Bases
2. Click on a knowledge base
3. Click "New Note"
4. Write in Markdown format
5. Use "Preview" to see rendered content
6. Click "Save"

### Upload a Document
1. Navigate to a knowledge base
2. Click "Upload"
3. Select file (PDF, Word, Markdown, etc.)
4. Add optional summary
5. Click "Upload"

### Chat with Knowledge Base
1. Go to Chat page
2. Click "New Chat"
3. Enter a title
4. Select knowledge base (enables RAG)
5. Type your question and send

## Production Build

```bash
npm run build
npm run preview  # Preview production build
```

For deployment, serve the `dist` directory with any static file server.

## Troubleshooting

**Can't connect to API**
- Ensure aimemos backend is running on port 8000
- Check VITE_API_BASE_URL in .env file
- Check browser console for CORS errors

**Build errors**
- Delete node_modules and package-lock.json
- Run `npm install` again
- Ensure Node.js version is 18+

**Login not working**
- Check that backend has ENABLE_REGISTRATION=true
- Verify SECRET_KEY is set in backend
- Clear browser localStorage and try again

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Architecture

- **State Management**: Zustand for auth state
- **Routing**: React Router v6 with protected routes
- **API Client**: Axios with auth interceptors
- **Styling**: TailwindCSS with custom utilities
- **Type Safety**: Full TypeScript coverage
