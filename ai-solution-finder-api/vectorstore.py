"""
Utility functions for building and querying a vector store of legal documents.

This module is adapted from the original Streamlit implementation. It uses
FAISS and OpenAI embeddings to generate a simple similarity search index for
the GDPR and EU AI Act PDFs. The index is stored on disk (./data/index)
to avoid recomputing embeddings on each startup. When the PDF files change
the index is automatically rebuilt.
"""

import json
import hashlib
from pathlib import Path
from typing import List

import faiss
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS

INDEX_DIR = Path(__file__).parent / 'data' / 'index'
INDEX_FILE = INDEX_DIR / 'faiss.index'
META_FILE = INDEX_DIR / 'meta.json'


def _compute_checksums(pdf_paths: List[str]) -> dict[str, str]:
    checks = {}
    for p in pdf_paths:
        with open(p, 'rb') as f:
            h = hashlib.sha256(f.read()).hexdigest()
        checks[p] = h
    return checks


def get_vectorstore(pdf_paths: List[str]) -> FAISS:
    """Return a FAISS vector store for the provided PDF paths.

    If an existing index is present on disk and the checksums match the current
    files the index will be loaded. Otherwise a new index is built and stored.
    """
    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    current_meta = {"checksums": _compute_checksums(pdf_paths)}
    if INDEX_FILE.exists() and META_FILE.exists():
        try:
            saved = json.loads(META_FILE.read_text())
            if saved.get("checksums") == current_meta["checksums"]:
                return FAISS.load_local(str(INDEX_DIR), OpenAIEmbeddings())
        except Exception:
            pass
    # rebuild index
    docs = []
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    for fn in pdf_paths:
        loader = PyPDFLoader(fn)
        docs.extend(loader.load_and_split(text_splitter=splitter))
    faiss_index = FAISS.from_documents(docs, OpenAIEmbeddings())
    faiss_index.save_local(str(INDEX_DIR))
    META_FILE.write_text(json.dumps(current_meta))
    return faiss_index