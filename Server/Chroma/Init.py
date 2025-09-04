import chromadb
import os
from pathlib import Path

PERSIST_DIR = Path(__file__).resolve().parent + "/ChromaStore"
DOCS_DIR = Path(__file__).resolve().parent + "/Docs"

client = chromadb.PersistentClient(path=PERSIST_DIR)