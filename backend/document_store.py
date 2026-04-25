"""
FoundrAI — Document Store
Handles user-uploaded files for per-agent context injection.

Flow:
  1. /upload receives a file → extract text → chunk → embed → store in ChromaDB
  2. Each agent calls query_user_document(document_id, specialty_query)
  3. Agent gets back 3-5 chunks relevant to its domain only
  4. Max 400 tokens added to any single agent prompt regardless of file size

Supported: PDF, DOCX, TXT, CSV
"""

import os
import uuid
import logging
from pathlib import Path
from typing import Optional

import chromadb
from chromadb import EmbeddingFunction, Documents, Embeddings
import requests

logger = logging.getLogger(__name__)

CHROMA_PATH      = os.getenv("CHROMA_PATH", "/app/chroma_data")
USER_DOCS_COLLECTION = "user_documents"
CHUNK_SIZE       = 512    # characters, not tokens (safe approximation)
CHUNK_OVERLAP    = 50     # characters
MAX_AGENT_TOKENS = 400    # ~400 tokens ≈ 1600 characters

_client     = None
_collection = None


class HFEmbeddingFunction(EmbeddingFunction):
    def __init__(self):
        self.api_url = (
            "https://api-inference.huggingface.co/pipeline/feature-extraction/"
            "sentence-transformers/all-MiniLM-L6-v2"
        )
        self.headers = {"Authorization": f"Bearer {os.getenv('HF_TOKEN', '')}"}

    def __call__(self, input: Documents) -> Embeddings:
        for attempt in range(3):
            try:
                resp = requests.post(
                    self.api_url,
                    headers=self.headers,
                    json={"inputs": input, "options": {"wait_for_model": True}},
                    timeout=20,
                )
                if resp.status_code == 200:
                    data = resp.json()
                    if isinstance(data, list) and data:
                        return data
            except Exception:
                pass
        return [[0.0] * 384 for _ in input]


def _get_collection():
    global _client, _collection
    if _collection is not None:
        return _collection
    try:
        _client     = chromadb.PersistentClient(path=CHROMA_PATH)
        ef          = HFEmbeddingFunction()
        _collection = _client.get_or_create_collection(
            USER_DOCS_COLLECTION, embedding_function=ef
        )
        return _collection
    except Exception as e:
        logger.error(f"ChromaDB unavailable: {e}")
        return None


# ── Text Extraction ───────────────────────────────────────────────────────────

def _extract_text(file_bytes: bytes, filename: str) -> str:
    ext = Path(filename).suffix.lower()

    if ext == ".pdf":
        return _extract_pdf(file_bytes)
    elif ext == ".docx":
        return _extract_docx(file_bytes)
    elif ext in (".txt", ".md"):
        return file_bytes.decode("utf-8", errors="replace")
    elif ext == ".csv":
        return file_bytes.decode("utf-8", errors="replace")
    else:
        raise ValueError(f"Unsupported file type: {ext}")


def _extract_pdf(file_bytes: bytes) -> str:
    import io
    import pdfplumber
    text_parts = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text_parts.append(t)
    return "\n\n".join(text_parts)


def _extract_docx(file_bytes: bytes) -> str:
    import io
    from docx import Document
    doc        = Document(io.BytesIO(file_bytes))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n\n".join(paragraphs)


# ── Chunking ──────────────────────────────────────────────────────────────────

def _chunk_text(text: str) -> list[str]:
    """
    Simple sliding-window chunker.
    CHUNK_SIZE=512 chars, CHUNK_OVERLAP=50 chars.
    Production upgrade: use tiktoken for token-accurate chunking.
    """
    chunks = []
    start  = 0
    while start < len(text):
        end = start + CHUNK_SIZE
        chunks.append(text[start:end].strip())
        start = end - CHUNK_OVERLAP
    return [c for c in chunks if len(c) > 30]  # drop tiny trailing chunks


# ── Public API ────────────────────────────────────────────────────────────────

async def ingest_document(file_bytes: bytes, filename: str) -> str:
    """
    Extract → chunk → embed → store.
    Returns document_id. Raises on unsupported file type.
    """
    text        = _extract_text(file_bytes, filename)
    chunks      = _chunk_text(text)
    document_id = str(uuid.uuid4())
    collection  = _get_collection()

    if collection is None:
        raise RuntimeError("ChromaDB unavailable — cannot store document")

    ids        = [f"{document_id}:{i}" for i in range(len(chunks))]
    metadatas  = [
        {"document_id": document_id, "chunk_index": i, "source": filename}
        for i in range(len(chunks))
    ]

    # ChromaDB upsert in batches of 100 to avoid request size limits
    batch_size = 100
    for i in range(0, len(chunks), batch_size):
        collection.upsert(
            ids=ids[i : i + batch_size],
            documents=chunks[i : i + batch_size],
            metadatas=metadatas[i : i + batch_size],
        )

    logger.info(f"Ingested {len(chunks)} chunks for document {document_id} ({filename})")
    return document_id


def query_user_document(document_id: str, specialty_query: str, n_results: int = 4) -> str:
    """
    Per-agent targeted RAG query.
    Each agent uses a different specialty_query so they get domain-relevant chunks.
    Returns at most MAX_AGENT_TOKENS chars (~400 tokens) regardless of doc size.
    """
    collection = _get_collection()
    if collection is None:
        return ""

    try:
        results = collection.query(
            query_texts=[specialty_query],
            n_results=n_results,
            where={"document_id": document_id},
        )
        docs = results.get("documents", [[]])[0]
        if not docs:
            return ""

        combined = "\n\n---\n\n".join(docs)
        # Hard cap at MAX_AGENT_TOKENS chars to protect context budget
        return combined[:MAX_AGENT_TOKENS * 4]   # 4 chars ≈ 1 token
    except Exception as e:
        logger.error(f"User document query failed: {e}")
        return ""