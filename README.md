# DocSearch AI - RAG Document Q&A System

A beautiful, production-ready Retrieval-Augmented Generation (RAG) application that lets users upload PDFs, ask questions, and get answers with exact source citations.

## Features

- **PDF Upload**: Drag-and-drop interface supporting multiple PDF files
- **Smart Chunking**: Automatically extracts and chunks text while preserving page numbers
- **Free Models**: Uses open-source models (no API keys required)
  - Embeddings: `sentence-transformers/all-MiniLM-L6-v2`
  - LLM: `google/flan-t5-base`
- **Vector Search**: ChromaDB for efficient similarity search
- **Source Citations**: Shows exact document snippets with page numbers and relevance scores
- **Chat Interface**: Clean, modern UI with message history
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **LangChain**: Document processing and RAG pipeline
- **ChromaDB**: Vector database for embeddings
- **Hugging Face Transformers**: Local LLM inference
- **PyPDF**: PDF text extraction

### Frontend
- **React**: UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **Vite**: Fast build tool

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration settings
│   │   ├── models.py            # Pydantic models
│   │   ├── document_processor.py # PDF processing logic
│   │   ├── vector_store.py      # ChromaDB management
│   │   └── llm_handler.py       # LLM inference
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── UploadZone.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   └── SourcesPanel.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   └── App.tsx
├── docker-compose.yml
└── README.md
```

## Installation & Setup

### Option 1: Local Development

#### Prerequisites
- Python 3.11+
- Node.js 18+
- 4GB+ RAM (for running local models)

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run the backend
uvicorn app.main:app --reload
```

The backend will start on `http://localhost:8000`

#### Frontend Setup

```bash
# From project root
npm install

# Run the frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Option 2: Docker

```bash
# Build and run both services
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

Access:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

## Usage

### 1. Upload Documents

- Click or drag-and-drop PDF files into the upload zone
- Multiple files can be uploaded at once
- Wait for processing to complete

### 2. Ask Questions

- Type your question in the chat input
- Press Send or hit Enter
- View the AI-generated answer with source citations

### 3. Review Sources

- Check the right sidebar for relevant document snippets
- See which PDF and page number each fact came from
- View relevance scores for each source

### 4. Clear Documents

- Click "Clear All" button to remove all uploaded documents
- Confirms before deletion

## API Endpoints

### POST `/upload`
Upload and process PDF files
```bash
curl -X POST "http://localhost:8000/upload" \
  -F "files=@document.pdf"
```

### POST `/query`
Ask a question about uploaded documents
```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the main topic?"}'
```

Response:
```json
{
  "answer": "The main topic is...",
  "sources": [
    {
      "doc": "document.pdf",
      "page": 5,
      "snippet": "Exact text from document...",
      "score": 0.82
    }
  ]
}
```

### POST `/clear`
Clear all documents and embeddings
```bash
curl -X POST "http://localhost:8000/clear"
```

### GET `/status`
Get current system status
```bash
curl "http://localhost:8000/status"
```

## Configuration

Edit `backend/.env` to customize:

```env
UPLOAD_DIR=./uploads
CHROMA_DIR=./chroma_db
CHUNK_SIZE=800
CHUNK_OVERLAP=150
TOP_K=6
MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
LLM_MODEL=google/flan-t5-base
```
## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.
