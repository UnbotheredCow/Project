from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    upload_dir: str = "./uploads"
    chroma_dir: str = "./chroma_db"
    chunk_size: int = 800
    chunk_overlap: int = 150
    top_k: int = 6
    model_name: str = "sentence-transformers/all-MiniLM-L6-v2"
    llm_model: str = "google/flan-t5-base"

    class Config:
        env_file = ".env"

    def create_dirs(self):
        Path(self.upload_dir).mkdir(parents=True, exist_ok=True)
        Path(self.chroma_dir).mkdir(parents=True, exist_ok=True)

settings = Settings()
settings.create_dirs()
