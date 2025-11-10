# Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Upload Zone  │  │ Chat UI      │  │ Sources Panel│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP/REST
┌────────────────────────────┴────────────────────────────────┐
│                      Backend (FastAPI)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    API Layer (main.py)                │   │
│  └─────────┬──────────────────────────┬─────────────────┘   │
│            │                          │                      │
│  ┌─────────▼──────────┐    ┌─────────▼──────────┐          │
│  │ Document Processor │    │   Vector Store     │          │
│  │  - PDF extraction  │    │  - ChromaDB        │          │
│  │  - Text chunking   │    │  - Embeddings      │          │
│  │  - Metadata        │    │  - Similarity      │          │
│  └────────────────────┘    └────────────────────┘          │
│                                     │                        │
│                          ┌──────────▼──────────┐            │
│                          │    LLM Handler      │            │
│                          │  - Answer generation│            │
│                          │  - Prompt template  │            │
│                          └─────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Upload Flow

1. User drops PDF files
2. Frontend sends multipart/form-data to `/upload`
3. Backend saves files to disk
4. DocumentProcessor extracts text page by page
5. Text is chunked (800 chars, 150 overlap)
6. Chunks embedded using sentence-transformers
7. Embeddings stored in ChromaDB
8. Success response sent back

### Query Flow

1. User types question
2. Frontend sends POST to `/query`
3. Question embedded using same model
4. ChromaDB performs cosine similarity search
5. Top 6 chunks retrieved
6. LLMHandler formats prompt with context
7. Flan-T5 generates answer
8. Response includes answer + sources
9. Frontend displays in chat + sources panel

## Key Components

### Frontend Components

- **App.tsx**: Main orchestrator, state management
- **Header.tsx**: Top bar with status and clear button
- **UploadZone.tsx**: Drag-and-drop file upload
- **ChatInterface.tsx**: Message list and input
- **MessageBubble.tsx**: Individual message rendering
- **SourcesPanel.tsx**: Document citations display

### Backend Modules

- **main.py**: FastAPI routes and CORS
- **config.py**: Environment configuration
- **models.py**: Pydantic schemas
- **document_processor.py**: PDF → chunks pipeline
- **vector_store.py**: ChromaDB wrapper
- **llm_handler.py**: LLM inference logic

## Technology Choices

### Why These Models?

**Embeddings: all-MiniLM-L6-v2**
- Small (80MB)
- Fast inference
- Good quality for semantic search
- Runs on CPU

**LLM: flan-t5-base**
- Moderate size (250MB)
- Instruction-tuned
- Good at Q&A tasks
- No API key required

### Why ChromaDB?

- Embedded database (no server needed)
- Automatic persistence
- Simple Python API
- Built-in similarity search

### Why FastAPI?

- High performance
- Auto-generated API docs
- Native async support
- Type hints and validation

## Security Considerations

### Current State (Development)

- CORS allows all origins
- No authentication
- Local file storage
- No rate limiting

### Production Recommendations

1. **Authentication**: Add JWT tokens
2. **CORS**: Whitelist specific domains
3. **File Validation**: Scan uploads for malware
4. **Rate Limiting**: Prevent abuse
5. **Storage**: Use S3/cloud storage
6. **Secrets**: Move to environment variables
7. **HTTPS**: Enable SSL/TLS
8. **Monitoring**: Add logging and alerts

## Scalability

### Current Limits

- Single process
- Local file storage
- In-memory models
- CPU-only inference

### Scaling Options

1. **Horizontal**: Multiple backend instances + load balancer
2. **GPU Acceleration**: Move to GPU for faster inference
3. **Model Optimization**: Quantization, ONNX runtime
4. **Caching**: Redis for frequent queries
5. **Async Workers**: Celery for background processing
6. **Cloud Vector DB**: Pinecone, Weaviate for larger datasets

## Performance Optimization

### Current Optimizations

- Batch embeddings
- Persistent ChromaDB
- Efficient chunking
- Cosine similarity (fast)

### Future Improvements

- Model quantization (INT8)
- Chunk caching
- Lazy model loading
- Connection pooling
- Response streaming

## Error Handling

- File upload errors → User feedback
- Processing errors → Logged + 500 response
- Query errors → Fallback message
- Model errors → Graceful degradation

## Testing Strategy

### Unit Tests
- Document chunking logic
- Embedding generation
- Query formatting

### Integration Tests
- Upload → Query flow
- Multi-document scenarios
- Error cases

### E2E Tests
- Full user workflow
- Upload → Ask → View sources
- Clear functionality

## Future Enhancements

1. **Multi-modal**: Support images, tables
2. **Advanced RAG**: Re-ranking, HyDE
3. **Streaming**: Real-time answer generation
4. **Citations**: Inline references in answers
5. **Chat History**: Persistent conversations
6. **Export**: Download Q&A as PDF
7. **Analytics**: Usage tracking
8. **Collaboration**: Multi-user support
