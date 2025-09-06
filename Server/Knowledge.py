from typing import Optional, Literal, Any, Dict
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from .Chroma.AddCollection import add_collection
from .Chroma.ModifyCollection import insert as insert_doc
from .Chroma.ModifyCollection import erase as erase_doc
from .Chroma.CheckCollections import query_all_collections

router = APIRouter(prefix="/api/knowledge", tags=["knowledge"])



class CollectionCreateIn(BaseModel):
    collectionname: str = Field(..., min_length=1, max_length=40)
    userid: str
    description: str = ""
    permission: Literal["private", "public"] = "private"

class DocInsertIn(BaseModel):
    collectionname: str
    userid: str
    name: str
    type: str
    description: str = ""
    extra: Dict[str, Any] = Field(default_factory=dict)

class DocEraseIn(BaseModel):
    collectionname: str
    userid: str
    name: str

class QueryCollectionsIn(BaseModel):
    userid: str

class CreateCollectionIn(BaseModel):
    collectionname: str
    userid: str
    description: Optional[str] = ""
    permission: Optional[Literal["private", "public"]] = "private"

class RespOut(BaseModel):
    ok: bool
    message: str
    collections: Optional[list[Dict]] = None



@router.post("/collection/create", response_model=RespOut)
def api_create_collection(body: CollectionCreateIn):
    try:
        ok, msg = add_collection(body.model_dump())
        if not ok:
            raise HTTPException(status_code=400, detail=msg)
        return {"ok": True, "message": "创建成功"}
    except Exception as e:
        return {"ok": False, "message": f"创建失败: {e}"}



@router.post("/collection/doc/insert", response_model=RespOut)
def api_insert_document(body: DocInsertIn):
    """
    说明：
    - body.extra 里的键会合并进传给 insert 的字典，兼容 extract 需要的参数
    """
    try:
        mes = {
            "collectionname": body.collectionname,
            "userid": body.userid,
            "name": body.name,
            "type": body.type,
            "description": body.description,
            **(body.extra or {})
        }
        ok, msg = insert_doc(mes)
        if not ok:
            raise HTTPException(status_code=400, detail=msg)
        return {"ok": True, "message": "插入成功"}
    except Exception as e:
        return {"ok": False, "message": f"插入失败: {e}"}



@router.post("/collection/doc/delete", response_model=RespOut)
def api_delete_document(body: DocEraseIn):
    try:
        mes = {
            "collectionname": body.collectionname,
            "userid": body.userid,
            "name": body.name
        }
        ok, msg = erase_doc(mes)
        if not ok:
            raise HTTPException(status_code=400, detail=msg)
        return {"ok": True, "message": "删除成功"}
    except Exception as e:
        return {"ok": False, "message": f"删除失败: {e}"}



@router.post("/collections/query", response_model=RespOut)
def api_query_collections(body: QueryCollectionsIn):
    try:
        mes = {"userid": body.userid}
        ok, msg = query_all_collections(mes)
        if not ok:
            raise HTTPException(status_code=400, detail=msg)
        return {"ok": True, "message": "查询成功", "collections": msg}
    except Exception as e:
        return {"ok": False, "message": f"查询失败: {e}"}



@router.post("/collections/create", response_model=RespOut)
def api_create_collection(body: CreateCollectionIn):
    try:
        mes = {
            "collectionname": body.collectionname,
            "userid": body.userid,
            "description": body.description,
            "permission": body.permission
        }
        ok, msg = add_collection(mes)
        if not ok:
            raise HTTPException(status_code=400, detail=msg)
        return {"ok": True, "message": "创建成功"}
    except Exception as e:
        return {"ok": False, "message": f"创建失败: {e}"}