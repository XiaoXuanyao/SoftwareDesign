import chromadb

PERSIST_DIR = "./ChromaStore"

client = chromadb.PersistentClient(path=PERSIST_DIR)