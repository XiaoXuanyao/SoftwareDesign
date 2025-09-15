from pathlib import Path
import json
import torch
import chromadb
import random
import time
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from langchain_core.documents import Document
from openai import OpenAI
from transformers import AutoTokenizer, AutoModelForCausalLM, AutoModelForSeq2SeqLM, pipelines
from ..Debug import Debug



API_KEY_PATH = Path(__file__).resolve().parent / "APIKey.json"
API_KEY = json.load(open(API_KEY_PATH))["key"]



def load_local_llm(
        model_path: str
    ) -> pipelines.pipeline:
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForCausalLM.from_pretrained(model_path, torch_dtype=torch.bfloat16)
    llm = pipelines.pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        max_length=512,
        temperature=0.1,
        top_p=0.9,
        pad_token_id=tokenizer.eos_token_id,
        eos_token_id=tokenizer.eos_token_id,
    )
    return llm



def load_deepseek_online() -> OpenAI:
    return OpenAI(
        api_key=API_KEY,
        base_url="https://api.deepseek.com/v1"
    )



def query_message(
        model: SentenceTransformer,
        path: str,
        collection_name: str,
        query: str,
        n_results: int=2
    ) -> dict:
    
    Client = chromadb.PersistentClient(path=path)
    collection = Client.get_collection(name=collection_name)
    query_embedding = model.encode([query], convert_to_tensor=True).cpu().numpy().tolist()
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=n_results
    )
    return results
