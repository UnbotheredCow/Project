from typing import List
from pathlib import Path
from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from app.config import settings

class DocumentProcessor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            length_function=len,
        )

    def extract_text_from_pdf(self, pdf_path: Path) -> List[Document]:
        documents = []

        try:
            reader = PdfReader(str(pdf_path))

            for page_num, page in enumerate(reader.pages, start=1):
                text = page.extract_text()

                if text.strip():
                    doc = Document(
                        page_content=text,
                        metadata={
                            "source": pdf_path.name,
                            "page": page_num
                        }
                    )
                    documents.append(doc)

        except Exception as e:
            raise Exception(f"Error processing PDF {pdf_path.name}: {str(e)}")

        return documents

    def chunk_documents(self, documents: List[Document]) -> List[Document]:
        chunks = self.text_splitter.split_documents(documents)
        return chunks

    def process_pdf(self, pdf_path: Path) -> List[Document]:
        documents = self.extract_text_from_pdf(pdf_path)
        chunks = self.chunk_documents(documents)
        return chunks
