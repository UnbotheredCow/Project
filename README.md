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

### Alternative Models

You can use different Hugging Face models:

**Larger LLM (better quality, slower)**:
```env
LLM_MODEL=mistralai/Mistral-7B-Instruct-v0.1
```

**Smaller LLM (faster, lower quality)**:
```env
LLM_MODEL=google/flan-t5-small
```

## Example Demo

### Sample Interaction

**User**: "What are the main findings of the research?"

**AI Response**: "Based on the uploaded documents, the research found three main findings: 1) X increased by 45%, 2) Y showed significant correlation with Z, and 3) The methodology proved effective across all test cases."

**Sources Shown**:
- **research_paper.pdf** - Page 12 (87% relevance)
  - "The results demonstrated a 45% increase in X across all experimental groups..."

- **research_paper.pdf** - Page 15 (82% relevance)
  - "Correlation analysis revealed significant relationships between Y and Z (p < 0.01)..."

- **methodology.pdf** - Page 8 (79% relevance)
  - "Our methodology was validated across diverse test cases with consistent results..."

## Performance Notes

- **First Query**: May take 10-20 seconds (model loading)
- **Subsequent Queries**: 2-5 seconds
- **Upload Time**: ~1-2 seconds per MB
- **RAM Usage**: 2-4GB (depending on model size)

## Troubleshooting

### "No module named 'app'"
Make sure you're in the `backend` directory when running uvicorn.

### Models downloading slowly
First run downloads models from Hugging Face. This is one-time and may take 5-10 minutes depending on connection.

### Out of memory errors
Try using smaller models:
- `google/flan-t5-small` instead of `flan-t5-base`
- Reduce `CHUNK_SIZE` in .env

### CORS errors
Ensure backend is running on port 8000 and frontend on 5173, or update CORS settings in `backend/app/main.py`.

## Production Deployment

For production:

1. Set proper CORS origins in `main.py`
2. Use a production ASGI server (Gunicorn + Uvicorn)
3. Add authentication/authorization
4. Use persistent storage for uploads and ChromaDB
5. Consider GPU acceleration for faster inference
6. Implement rate limiting
7. Add monitoring and logging

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.
