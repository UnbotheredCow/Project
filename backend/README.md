# Backend Setup Guide

## Quick Start

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Run server
uvicorn app.main:app --reload
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

```bash
# Test upload
curl -X POST "http://localhost:8000/upload" \
  -F "files=@test.pdf"

# Test query
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is this document about?"}'
```

## Development

The backend uses:
- FastAPI for the web framework
- LangChain for document processing
- ChromaDB for vector storage
- Hugging Face Transformers for LLM

Key files:
- `main.py`: API endpoints
- `document_processor.py`: PDF extraction and chunking
- `vector_store.py`: Embedding and retrieval
- `llm_handler.py`: Answer generation
