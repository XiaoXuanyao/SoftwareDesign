from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader, UnstructuredWordDocumentLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from ..Init import DOCS_DIR
import os



def extract_pdf(mes: dict, chunk_size: int = 256, chunk_overlap: int = 32):
    path = DOCS_DIR + "/" + mes["name"]
    pdf_abs_path = os.path.abspath(path)
    if not os.path.exists(pdf_abs_path):
        return False, "文件不存在"
    
    loader = PyPDFLoader(pdf_abs_path)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
    )
    chunks = text_splitter.split_documents(documents)
    for i, chunk in enumerate(chunks):
        chunk.metadata["source"] = mes["name"]
        chunk.metadata["chunk_index"] = i + 1
    return True, chunks



def extract_word(mes: dict, chunk_size: int = 256, chunk_overlap: int = 32):
    path = DOCS_DIR + "/" + mes["name"]
    pdf_abs_path = os.path.abspath(path)
    if not os.path.exists(pdf_abs_path):
        return False, "文件不存在"
    
    loader = UnstructuredWordDocumentLoader(pdf_abs_path)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
    )
    chunks = text_splitter.split_documents(documents)
    for i, chunk in enumerate(chunks):
        chunk.metadata["source"] = mes["name"]
        chunk.metadata["chunk_index"] = i + 1
    return True, chunks


def extract_txt(mes: dict, chunk_size: int = 256, chunk_overlap: int = 32):
    path = DOCS_DIR + "/" + mes["name"]
    pdf_abs_path = os.path.abspath(path)
    if not os.path.exists(pdf_abs_path):
        return False, "文件不存在"

    with open(pdf_abs_path, "r", encoding="utf-8") as f:
        text = f.read()
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
    )
    chunks = text_splitter.split_text(text)
    for i, chunk in enumerate(chunks):
        chunk.metadata["source"] = mes["name"]
        chunk.metadata["chunk_index"] = i + 1
    return True, chunks



def extract(mes: dict, chunk_size: int = 256, chunk_overlap: int = 32):
    if mes["name"].endswith(".pdf"):
        return extract_pdf(mes, chunk_size, chunk_overlap)
    elif mes["name"].endswith(".docx") or mes["name"].endswith(".doc"):
        return extract_word(mes, chunk_size, chunk_overlap)
    elif mes["name"].endswith(".txt"):
        return extract_txt(mes, chunk_size, chunk_overlap)
    return False, "不支持的文件类型"