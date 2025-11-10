from typing import List, Tuple
from langchain.schema import Document
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from app.config import settings

class LLMHandler:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(settings.llm_model)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(settings.llm_model)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device)

    def generate_answer(self, question: str, context_docs: List[Tuple[Document, float]]) -> Tuple[str, List[dict]]:
        if not context_docs:
            return "I don't have any documents to answer this question.", []

        context_parts = []
        sources = []

        for doc, score in context_docs:
            snippet = doc.page_content[:300]
            context_parts.append(f"From {doc.metadata['source']} (Page {doc.metadata['page']}): {snippet}")

            sources.append({
                "doc": doc.metadata['source'],
                "page": doc.metadata['page'],
                "snippet": snippet,
                "score": float(1 - score)
            })

        context_text = "\n\n".join(context_parts)

        system_prompt = """You are a document assistant. Use only the provided text chunks from the user's uploaded PDFs to answer questions.
If the answer is not in the provided context, say "I don't know based on the available documents."
Provide a clear and concise answer based on the context."""

        prompt = f"{system_prompt}\n\nContext:\n{context_text}\n\nQuestion: {question}\n\nAnswer:"

        inputs = self.tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_length=256,
                num_beams=4,
                early_stopping=True,
                temperature=0.7
            )

        answer = self.tokenizer.decode(outputs[0], skip_special_tokens=True)

        if not answer.strip():
            answer = "I don't know based on the available documents."

        return answer, sources
