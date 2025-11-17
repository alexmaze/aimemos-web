# aimemos-web

Web frontend for the [aimemos](https://github.com/alexmaze/aimemos) project - an AI-powered personal knowledge management system.

## Features

- **Memos**: Lightweight notes for quick thoughts and reminders
- **Knowledge Bases**: Organized collections of documents and notes
- **Document Management**: Create, edit, and organize Markdown notes and upload various document formats
- **AI Chat**: Interactive chat with AI assistant powered by your knowledge bases (RAG)
- **Clean UI**: Apple-inspired design with a focus on simplicity and elegance

## Tech Stack

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library
- **React Markdown** - Markdown rendering

## Prerequisites

- Node.js 18+ and npm
- Running instance of [aimemos](https://github.com/alexmaze/aimemos) backend

## Installation

1. Clone the repository:
```bash
git clone https://github.com/alexmaze/aimemos-web.git
cd aimemos-web
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure the API endpoint in `.env`:
```
VITE_API_BASE_URL=http://localhost:8000
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── api/              # API client and service modules
├── components/       # Reusable React components
├── pages/            # Page components
├── stores/           # Zustand state stores
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── App.tsx           # Main app component with routing
├── main.tsx          # Application entry point
└── index.css         # Global styles and Tailwind directives
```

## Usage

### First Time Setup

1. Start the aimemos backend server
2. Open the frontend application in your browser
3. Register a new account or login
4. Create your first knowledge base
5. Add documents and notes
6. Start chatting with the AI assistant

### Features Guide

#### Memos
- Quick, lightweight notes for daily thoughts
- Tag-based organization
- Full-text search

#### Knowledge Bases
- Organize documents by topic or project
- Support for folders and hierarchical structure
- Upload documents (PDF, Word, Markdown, etc.)

#### Documents
- Create and edit Markdown notes
- Upload external documents
- Organize with folders
- Search across all documents

#### AI Chat
- Create chat sessions
- Associate sessions with knowledge bases for RAG-powered responses
- View conversation history
- Access to knowledge base context

## API Integration

The frontend connects to the aimemos backend API. Key endpoints:

- `/api/v1/auth/*` - Authentication
- `/api/v1/memos/*` - Memo management
- `/api/v1/knowledge-bases/*` - Knowledge base management
- `/api/v1/documents/*` - Document management
- `/api/v1/chats/*` - Chat sessions and messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Backend API: [aimemos](https://github.com/alexmaze/aimemos)
- Design inspiration: Apple's design principles

