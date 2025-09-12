from openai import OpenAI
from . import Lib as lib
from ..Mysql.Execute import execute
from ..Chroma.Embedding.Embedding import embedding_model, embedding_function
from ..Chroma.ModifyCollection import encode_collection_name, hash_collection_name
from ..Chroma.ModifyKnowledgeSet import check_permission
from ..Chroma.Init import PERSIST_DIR, client
from ..Debug import Debug
import json



Debug.log("Debug", "正在加载聊天模型")
LLM = lib.load_deepseek_online()
Debug.log("Debug", "加载Deepseek API完成")



def retrieve_context(collectionname: str, query: str, top_k: int = 5):
    collection = client.get_collection(
        name=collectionname,
        embedding_function=embedding_function
    )
    results = collection.query(
        query_texts=[query],
        n_results=top_k
    )
    docs = (results.get("documents") or [[]])[0]
    metas = (results.get("metadatas") or [[]])[0]
    dists = (results.get("distances") or [[]])[0]

    return {
        "documents": docs,
        "metadatas": metas,
        "distances": dists
    }



def build_context_block(ctx: dict):
    lines = []
    docs = ctx.get("documents", [])
    metas = ctx.get("metadatas", [])

    for i, t in enumerate(docs):
        meta = metas[i] if i < len(metas) else {}
        src = meta.get("docname") or meta.get("source") or "片段"
        path = meta.get("path") or ""
        head = f"- [{src}]({path})" if path else f"- {src}"
        snippet = (t or "").strip().replace("\n", " ")

        lines.append(f"{head}: {snippet}")
    return "\n".join(lines)



def chat_with_context(mes: dict):
    if mes.get("collectionname", "") != "":
        mes["collectionname"] = encode_collection_name(mes["collectionname"])
        mes["hash"] = hash_collection_name(mes["collectionname"], mes["userid"])

        is_valid, message = check_permission(mes["collectionname"], mes["userid"], "r")
        if not is_valid:
            return False, message
    
    try:
        collectionname = mes["hash"] if mes.get("collectionname", "") != "" else ""
        question = mes["question"]
        top_k = mes.get("top_k", 5)

        ctx = {}
        if collectionname != "":
            try:
                ctx = retrieve_context(collectionname, question, top_k)
            except Exception as e:
                return False, f"检索失败: {str(e)}"
            
            context_block = build_context_block(ctx)
            has_context = bool(context_block.strip())
        else:
            has_context = False
        system_prompt = (
            "你是一个基于知识库的程序设计竞赛知识问答智能助手。"
            "请严格依据下方提供的“知识库上下文”来回答用户问题；"
            "如果上下文无法回答，请说“我不知道这个问题的答案。”，不要编造。"
            "回答要使用中文，尽量简洁、结构清晰。"
            "语言要友好、富有热情且专业。"
        )
        user_prompt = (
            f"知识库上下文:\n{context_block if has_context else '（无可用上下文）'}\n\n"
            f"问题: {question}\n"
            "请基于上下文作答。"
        )

        messages = [{"role": "system", "content": system_prompt}]
        history = mes.get("history", [])

        for m in history:
            r = m.get("role")
            c = m.get("content")
            if r in ("user", "assistant") and isinstance(c, str) and c.strip():
                messages.append({"role": r, "content": c})
        messages.append({"role": "user", "content": user_prompt})

        model_name = "deepseek-chat"

        resp = LLM.chat.completions.create(model=model_name, messages=messages)
        text = (resp.choices[0].message.content or "").strip()

        references = []
        if has_context:
            docs = ctx.get("documents") or []
            metas = ctx.get("metadatas") or []
            for i in range(min(len(docs), len(metas))):
                meta = metas[i] or {}
                references.append({
                    "docname": meta.get("docname") or meta.get("source"),
                    "path": meta.get("path"),
                    "chunk_index": meta.get("chunk_index"),
                })

        return True, {
            "answer": text,
            "contexts": references,
        }
        
    except Exception as e:
        return False, f"响应错误: {str(e)}"