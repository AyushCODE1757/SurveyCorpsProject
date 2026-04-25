"""
FoundrAI 2.0 — RAG Query Module
Queries the ChromaDB knowledge base for relevant startup wisdom.
"""

import os
import time
import requests
from dotenv import load_dotenv
import chromadb
from chromadb import EmbeddingFunction, Documents, Embeddings

load_dotenv()

CHROMA_PATH = "/app/chroma_data"
COLLECTION_NAME = "yc_knowledge"

_client = None
_collection = None


class RobustHFEmbeddingFunction(EmbeddingFunction):
    def __init__(self, api_key: str):
        self.api_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
        self.headers = {"Authorization": f"Bearer {api_key}"}

    def __call__(self, input: Documents) -> Embeddings:
        retries = 3
        for i in range(retries):
            try:
                resp = requests.post(self.api_url, headers=self.headers, json={"inputs": input, "options": {"wait_for_model": True}}, timeout=20)
                if resp.status_code == 200:
                    data = resp.json()
                    if isinstance(data, list) and len(data) > 0: return data
            except: pass
            time.sleep(2)
        return [[0.0] * 384 for _ in input]


def _get_collection():
    global _client, _collection
    if _collection is None:
        try:
            _client = chromadb.PersistentClient(path=CHROMA_PATH)
            ef = RobustHFEmbeddingFunction(api_key=os.getenv("HF_TOKEN"))
            _collection = _client.get_collection(COLLECTION_NAME, embedding_function=ef)
        except: _collection = None
    return _collection


def query_knowledge(query: str, n_results: int = 3) -> str:
    collection = _get_collection()
    if collection is None: return "[RAG UNAVAILABLE]"
    try:
        results = collection.query(query_texts=[query], n_results=min(n_results, collection.count()))
        docs = results.get("documents", [[]])[0]
        metas = results.get("metadatas", [[]])[0]
        formatted = [f"[{m.get('source', 'KB')}] {d.strip()}" for d, m in zip(docs, metas)]
        return "\n\n---\n\n".join(formatted)
    except: return "[RAG ERROR]"


def query_for_idea(idea: str):
    return query_knowledge(f"startup strategy for: {idea}", 3)

def query_for_risks(idea: str):
    return query_knowledge(f"startup failure risks for: {idea}", 2)

def query_for_pitch(idea: str):
    return query_knowledge(f"pitch deck strategy for: {idea}", 2)

def query_legal_kb(topic: str):
    """Query the knowledge base specifically for legal and labour law context."""
    return query_knowledge(f"legal requirements and labour laws for: {topic}", 3)

def query_for_salary(role: str, location: str):
    """Query the knowledge base for salary benchmarks."""
    return query_knowledge(f"salary benchmark for {role} in {location}", 2)
