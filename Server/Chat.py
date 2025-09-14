from typing import Optional, Literal, Any, Dict, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .ChatWithLLM.LLM import chat_with_context
from .ChatWithLLM.Save import readChatSave, writeChatSave

router = APIRouter(prefix="/api", tags=["chat"])


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatIn(BaseModel):
    userid: str
    collectionname: str
    question: str
    top_k: Optional[int] = 5
    history: Optional[List[ChatMessage]] = []

class ChatOut(BaseModel):
    ok: bool
    message: str
    answer: Optional[str] = None
    contexts: Optional[List[Dict[str, Any]]] = None



class ChatSaveIn(BaseModel):
    userid: str
    content: Optional[dict] = None

class ChatSaveOut(BaseModel):
    ok: bool
    message: str
    content: Optional[dict] = None



@router.post("/chat", response_model=ChatOut)
def api_chat(body: ChatIn):
    try:
        mes = {
            "userid": body.userid or "",
            "collectionname": body.collectionname,
            "question": body.question,
            "top_k": body.top_k or 5,
            "history": [m.model_dump() for m in (body.history or [])],
        }
        ok, data = chat_with_context(mes)
        if not ok:
            return {"ok": False, "message": data}
        return {"ok": True, "message": "success", "answer": data.get("answer", ""), "contexts": data.get("contexts", [])}
    except HTTPException:
        raise
    except Exception as e:
        return {"ok": False, "message": f"聊天失败: {e}"}



@router.post("/chat/readsave", response_model=ChatSaveOut)
def api_read_chat_save(body: ChatSaveIn):
    try:
        ok, data = readChatSave(
            {
                "userid": body.userid
            }
        )
        if not ok:
            return {"ok": False, "message": data, "content": None}
        return {"ok": True, "message": "success", "content": data}
    except Exception as e:
        return {"ok": False, "message": f"读取失败: {e}", "content": None}



@router.post("/chat/writesave", response_model=ChatSaveOut)
def api_write_chat_save(body: ChatSaveIn):
    try:
        ok, data = writeChatSave(
            {
                "userid": body.userid,
                "content": body.content
            }
        )
        if not ok:
            return {"ok": False, "message": data, "content": None}
        return {"ok": True, "message": "success", "content": None}
    except Exception as e:
        return {"ok": False, "message": f"保存失败: {e}", "content": None}