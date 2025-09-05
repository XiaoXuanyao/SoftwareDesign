import chromadb
from chromadb.utils import embedding_functions
from sentence_transformers import SentenceTransformer
from langchain_core.documents import Document
from ...Debug import Debug
from ..Init import MODEL_DIR
from typing import List

EMBEDDING_MODEL_NAME = "BAAI/bge-small-zh-v1.5"

Debug.log("Debug", f"正在加载句向量模型")
embedding_model = SentenceTransformer(
    model_name_or_path=EMBEDDING_MODEL_NAME,
    local_files_only=True
)
Debug.log("Debug", f"加载句向量模型 {EMBEDDING_MODEL_NAME} 完成")
Debug.log("Debug", f"正在加载句向量函数")
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name=EMBEDDING_MODEL_NAME,
    device="cuda",
    local_files_only=True
)
Debug.log("Debug", f"加载句向量函数 {EMBEDDING_MODEL_NAME} 完成")


def embedding_chunks(chunks: List[Document]):
    sentences = [chunk.page_content for chunk in chunks]
    embeddings = embedding_model.encode(sentences, convert_to_tensor=True)
    embeddings = embeddings.cpu().numpy().tolist()
    return embeddings
