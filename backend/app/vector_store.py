from typing import List, Tuple
from pathlib import Path
import shutil
from langchain.schema import Document
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from app.config import settings

class VectorStoreManager:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name=settings.model_name,
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
        self.vector_store = None
        self._load_or_create_store()

    def _load_or_create_store(self):
        chroma_path = Path(settings.chroma_dir)

        if chroma_path.exists() and any(chroma_path.iterdir()):
            self.vector_store = Chroma(
                persist_directory=settings.chroma_dir,
                embedding_function=self.embeddings
            )
        else:
            self.vector_store = Chroma(
                persist_directory=settings.chroma_dir,
                embedding_function=self.embeddings
            )

    def add_documents(self, documents: List[Document]) -> int:
        if not documents:
            return 0

        self.vector_store.add_documents(documents)
        self.vector_store.persist()
        return len(documents)

    def similarity_search(self, query: str, k: int = None) -> List[Tuple[Document, float]]:
        if k is None:
            k = settings.top_k

        results = self.vector_store.similarity_search_with_score(query, k=k)
        return results

    def clear_store(self):
        chroma_path = Path(settings.chroma_dir)

        if chroma_path.exists():
            shutil.rmtree(chroma_path)
            chroma_path.mkdir(parents=True, exist_ok=True)

        self._load_or_create_store()

    def get_document_count(self) -> int:
        if self.vector_store._collection:
            return self.vector_store._collection.count()
        return 0
