import chromadb
import os
from pathlib import Path
from ..Debug import Debug

PERSIST_DIR = Path(__file__).resolve().parent / "data/ChromaStore"
DOCS_DIR = Path(__file__).resolve().parent / "data/Docs"
MODEL_DIR = Path(__file__).resolve().parent / "data/Model"
CHAT_DIR = Path(__file__).resolve().parent / "data/Chat"

Debug.log("Debug", f"正在加载Chroma向量数据库完成")
client = chromadb.PersistentClient(path=PERSIST_DIR)
Debug.log("Debug", f"加载Chroma向量数据库完成")