from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pathlib import Path
import shutil
from app.config import settings
from app.models import UploadResponse, QueryRequest, QueryResponse, ClearResponse, Source
from app.document_processor import DocumentProcessor
from app.vector_store import VectorStoreManager
from app.llm_handler import LLMHandler

app = FastAPI(title="DocSearch AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

document_processor = DocumentProcessor()
vector_store = VectorStoreManager()
llm_handler = LLMHandler()

@app.get("/")
async def root():
    return {"message": "DocSearch AI API is running", "status": "healthy"}

@app.post("/upload", response_model=UploadResponse)
async def upload_pdfs(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    total_chunks = 0
    processed_files = 0

    try:
        for file in files:
            if not file.filename.lower().endswith('.pdf'):
                continue

            file_path = Path(settings.upload_dir) / file.filename

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            chunks = document_processor.process_pdf(file_path)

            vector_store.add_documents(chunks)

            total_chunks += len(chunks)
            processed_files += 1

        if processed_files == 0:
            raise HTTPException(status_code=400, detail="No valid PDF files provided")

        return UploadResponse(
            success=True,
            message=f"Successfully processed {processed_files} document(s)",
            document_count=processed_files,
            chunk_count=total_chunks
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing files: {str(e)}")

@app.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    try:
        if not request.question.strip():
            raise HTTPException(status_code=400, detail="Question cannot be empty")

        doc_count = vector_store.get_document_count()
        if doc_count == 0:
            raise HTTPException(status_code=400, detail="No documents uploaded yet. Please upload PDFs first.")

        relevant_docs = vector_store.similarity_search(request.question)

        answer, sources = llm_handler.generate_answer(request.question, relevant_docs)

        return QueryResponse(
            answer=answer,
            sources=[Source(**source) for source in sources]
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.post("/clear", response_model=ClearResponse)
async def clear_documents():
    try:
        vector_store.clear_store()

        upload_path = Path(settings.upload_dir)
        if upload_path.exists():
            shutil.rmtree(upload_path)
            upload_path.mkdir(parents=True, exist_ok=True)

        return ClearResponse(
            success=True,
            message="All documents and embeddings cleared successfully"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing documents: {str(e)}")

@app.get("/status")
async def get_status():
    doc_count = vector_store.get_document_count()
    return {
        "document_chunks": doc_count,
        "model": settings.model_name,
        "llm": settings.llm_model
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
