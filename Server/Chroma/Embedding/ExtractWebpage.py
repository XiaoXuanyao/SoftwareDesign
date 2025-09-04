import requests
from bs4 import BeautifulSoup
from readability import Document as ReadabilityDoc
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter



DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}



def fetch_html(url: str, headers=None, timeout=10):
    resp = requests.get(url, headers=headers or DEFAULT_HEADERS, timeout=timeout)
    resp.raise_for_status()
    resp.encoding = resp.apparent_encoding or resp.encoding
    return resp.text



def extract_main_text(html: str):
    try:
        doc = ReadabilityDoc(html)
        content_html = doc.summary()
        soup = BeautifulSoup(content_html, "html.parser")
        return soup.get_text(separator="\n")
    except Exception:
        pass

    # 回退简单清洗
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    text = soup.get_text(separator="\n")

    # 规范空行
    lines = [ln.strip() for ln in text.splitlines()]
    return "\n".join([l for l in lines if l])



def extract_text(mes: dict, text: str, chunk_size: int = 256, chunk_overlap: int = 32):
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



def extract(mes: dict):
    try:
        html = fetch_html(mes["url"])
    except Exception as e:
        return False, f"获取网页失败: {str(e)}"
    
    text = extract_main_text(html)
    if not text.strip():
        return False, "网页为空或正文提取失败"
    
    return extract_text(mes, text)