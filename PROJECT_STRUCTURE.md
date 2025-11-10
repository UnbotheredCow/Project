# Complete Project Structure

```
docsearch-ai/
│
├── README.md                      # Main documentation
├── QUICKSTART.md                  # 5-minute setup guide
├── ARCHITECTURE.md                # System design & tech decisions
├── DEMO.md                        # Usage examples & screenshots
├── PROJECT_STRUCTURE.md           # This file
│
├── package.json                   # Frontend dependencies
├── package-lock.json
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript config
├── tsconfig.app.json
├── tsconfig.node.json
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js
├── eslint.config.js
├── index.html                     # HTML entry point
├── .gitignore
│
├── docker-compose.yml             # Docker orchestration
├── Dockerfile.frontend            # Frontend container
│
├── src/                           # Frontend source code
│   ├── main.tsx                   # React entry point
│   ├── App.tsx                    # Main application component
│   ├── index.css                  # Global styles
│   ├── vite-env.d.ts
│   │
│   ├── components/                # React components
│   │   ├── Header.tsx             # Top navigation bar
│   │   ├── UploadZone.tsx         # Drag-and-drop upload
│   │   ├── ChatInterface.tsx      # Chat UI container
│   │   ├── MessageBubble.tsx      # Individual message
│   │   └── SourcesPanel.tsx       # Source citations panel
│   │
│   ├── services/                  # API communication
│   │   └── api.ts                 # Backend API calls
│   │
│   └── types/                     # TypeScript definitions
│       └── index.ts               # Shared types/interfaces
│
└── backend/                       # Backend source code
    ├── README.md                  # Backend setup guide
    ├── requirements.txt           # Python dependencies
    ├── Dockerfile                 # Backend container
    ├── .dockerignore
    ├── .env.example               # Environment variables template
    │
    └── app/                       # Python application
        ├── __init__.py
        ├── main.py                # FastAPI app & routes
        ├── config.py              # Configuration management
        ├── models.py              # Pydantic models
        ├── document_processor.py  # PDF extraction & chunking
        ├── vector_store.py        # ChromaDB wrapper
        └── llm_handler.py         # LLM inference logic
```

## File Descriptions

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Complete documentation with setup, API, troubleshooting |
| `QUICKSTART.md` | Get running in 5 minutes |
| `ARCHITECTURE.md` | System design, data flows, tech choices |
| `DEMO.md` | Example interactions and visual guide |
| `PROJECT_STRUCTURE.md` | This file - project organization |

### Frontend Files

#### Root Configuration
- `package.json` - Dependencies (React, TypeScript, Tailwind)
- `vite.config.ts` - Build tool configuration
- `tsconfig.*.json` - TypeScript compiler settings
- `tailwind.config.js` - CSS utility classes
- `eslint.config.js` - Code quality rules

#### Source Code (`src/`)
- `main.tsx` - React application bootstrap
- `App.tsx` - Main component with state management
- `index.css` - Tailwind imports and global styles

#### Components (`src/components/`)
- `Header.tsx` - App title, status, clear button (90 lines)
- `UploadZone.tsx` - File upload with drag-and-drop (150 lines)
- `ChatInterface.tsx` - Message list and input box (100 lines)
- `MessageBubble.tsx` - Single message rendering (40 lines)
- `SourcesPanel.tsx` - Document sources display (80 lines)

#### Services (`src/services/`)
- `api.ts` - HTTP requests to backend (50 lines)

#### Types (`src/types/`)
- `index.ts` - TypeScript interfaces (30 lines)

### Backend Files

#### Root
- `requirements.txt` - Python packages (LangChain, FastAPI, etc.)
- `Dockerfile` - Container definition
- `.env.example` - Configuration template

#### Application (`backend/app/`)

| File | Lines | Purpose |
|------|-------|---------|
| `main.py` | 120 | FastAPI routes: /upload, /query, /clear, /status |
| `config.py` | 25 | Settings from environment variables |
| `models.py` | 35 | Request/response schemas |
| `document_processor.py` | 70 | PDF → text → chunks pipeline |
| `vector_store.py` | 80 | ChromaDB CRUD operations |
| `llm_handler.py` | 75 | LLM inference and prompt formatting |

### Docker Files

- `docker-compose.yml` - Runs both frontend and backend
- `Dockerfile.frontend` - Node.js container
- `backend/Dockerfile` - Python container

## Key Relationships

```
User Browser
    ↓
App.tsx (orchestrates everything)
    ├─→ Header.tsx (status display)
    ├─→ UploadZone.tsx → api.uploadPDFs() → POST /upload
    ├─→ ChatInterface.tsx
    │       ├─→ MessageBubble.tsx (each message)
    │       └─→ api.query() → POST /query
    └─→ SourcesPanel.tsx (displays sources from query)

Backend Flow:
POST /upload → main.py → document_processor.py → vector_store.py
POST /query → main.py → vector_store.py → llm_handler.py
```

## Code Statistics

### Frontend
- **Total Lines**: ~800
- **Components**: 5
- **TypeScript**: 100%
- **Styling**: Tailwind CSS

### Backend
- **Total Lines**: ~500
- **Modules**: 5
- **Python**: 100%
- **Framework**: FastAPI

### Dependencies

**Frontend** (12 packages):
- react, react-dom
- typescript
- tailwindcss
- lucide-react
- vite

**Backend** (13 packages):
- fastapi, uvicorn
- langchain, langchain-community
- sentence-transformers
- chromadb
- pypdf
- torch, transformers

## Generated/Runtime Directories

Not in repo (created at runtime):

```
backend/
├── uploads/              # Uploaded PDF files
├── chroma_db/            # Vector database storage
├── venv/                 # Python virtual environment
└── __pycache__/          # Python bytecode

dist/                     # Frontend build output
node_modules/             # NPM packages
```

## Configuration Files

### Development
- `backend/.env` - Backend settings (created from .env.example)

### Production
- Environment variables injected into Docker containers
- CORS settings in `main.py`
- API base URL in `api.ts`

## Entry Points

### Development
- Frontend: `npm run dev` → `vite` → `src/main.tsx`
- Backend: `uvicorn app.main:app` → `backend/app/main.py`

### Production
- Frontend: `npm run build` → `dist/`
- Backend: Docker container with Gunicorn

### Docker
- `docker-compose up` → Starts both services
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

## Import Patterns

### Frontend
```typescript
// Relative imports for components
import Header from './components/Header';

// Service layer
import { api } from './services/api';

// Type definitions
import { Message, Source } from './types';
```

### Backend
```python
# Absolute imports from app package
from app.config import settings
from app.models import QueryRequest
from app.vector_store import VectorStoreManager
```

## Testing Structure

Currently no test files. Recommended structure:

```
backend/
└── tests/
    ├── test_document_processor.py
    ├── test_vector_store.py
    └── test_api.py

src/
└── __tests__/
    ├── components/
    └── services/
```

## Build Artifacts

### Frontend (`npm run build`)
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── vite.svg
```

### Backend (no build step)
- Pure Python, runs directly
- Models download to `~/.cache/huggingface/`

## Environment Variables

### Backend (.env)
```bash
UPLOAD_DIR=./uploads
CHROMA_DIR=./chroma_db
CHUNK_SIZE=800
CHUNK_OVERLAP=150
TOP_K=6
MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
LLM_MODEL=google/flan-t5-base
```

### Frontend
- API URL hardcoded in `services/api.ts`
- Could be moved to `.env` for production

## Git Workflow

`.gitignore` excludes:
- `node_modules/`
- `dist/`
- `backend/venv/`
- `backend/uploads/`
- `backend/chroma_db/`
- `backend/__pycache__/`
- `.env`

Commit the rest!
