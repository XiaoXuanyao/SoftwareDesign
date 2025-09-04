import chromadb
from chromadb.utils import embedding_functions
from sentence_transformers import SentenceTransformer
from langchain_core.documents import Document
from typing import List

EMBEDDING_MODEL_NAME = "BAAI/bge-small-zh-v1.5"

embedding_model = SentenceTransformer(
    model_name=EMBEDDING_MODEL_NAME
)
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name=EMBEDDING_MODEL_NAME,
    device="0"
)



def embdding_chunks(chunks: List[Document]):
    sentences = [chunk.page_content for chunk in chunks]
    embeddings = embedding_model.encode(sentences, convert_to_tensor=True)
    embeddings = embeddings.cpu().numpy().tolist()
    return embeddings
