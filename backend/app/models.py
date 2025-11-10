from pydantic import BaseModel
from typing import List, Optional

class UploadResponse(BaseModel):
    success: bool
    message: str
    document_count: int
    chunk_count: int

class Source(BaseModel):
    doc: str
    page: int
    snippet: str
    score: float

class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    answer: str
    sources: List[Source]

class ClearResponse(BaseModel):
    success: bool
    message: str
