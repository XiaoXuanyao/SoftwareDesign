from typing import Optional, Literal, Any, Dict, List
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, Field
from .Chroma.ModifyCollection import add_collection
from .Chroma.ModifyCollection import delete_collection
from .Chroma.ModifyCollection import query_all_collections
from .Chroma.ModifyDocs import upload as upload_doc
from .Chroma.ModifyDocs import delete as delete_doc
from .Chroma.ModifyDocs import query as query_doc
from .Chroma.ModifyDocs import move as move_doc
from .Chroma.ModifyKnowledgeSet import insert as insert_knowledgeset
from .Chroma.ModifyKnowledgeSet import query as query_knowledgeset

router = APIRouter(prefix="/api/knowledge", tags=["knowledge"])



class QueryCollectionsIn(BaseModel):
    userid: str

class CreateCollectionIn(BaseModel):
    collectionname: str
    userid: str
    description: Optional[str] = ""
    permission: Optional[Literal["private", "public"]] = "private"

class DeleteCollectionIn(BaseModel):
    collectionname: str
    userid: str

class CollectionRespOut(BaseModel):
    ok: bool
    message: str
    collections: Optional[list[Dict]] = None



class DocDeleteIn(BaseModel):
    userid: str
    docids: List[str]

class DocQueryIn(BaseModel):
    userid: str
    keyword: Optional[str] = ""

class DocMoveIn(BaseModel):
    userid: str
    docid: str
    newname: str
    newpath: str

class DocRespOut(BaseModel):
    ok: bool
    message: str
    docs: Optional[List[Dict[str, Any]]] = None



class SetInsertIn(BaseModel):
    collectionname: str
    userid: str
    docids: list[str]

class SetQueryIn(BaseModel):
    collectionname: str
    userid: str



@router.post("/query", response_model=CollectionRespOut)
def api_query_collections(body: QueryCollectionsIn):
    try:
        mes = {"userid": body.userid}
        ok, msg = query_all_collections(mes)
        if not ok:
            raise HTTPException(status_code=400, detail=msg)
        return {"ok": True, "message": "查询成功", "collections": msg}
    except Exception as e:
        return {"ok": False, "message": f"查询失败: {e}"}



@router.post("/create", response_model=CollectionRespOut)
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



@router.post("/delete", response_model=CollectionRespOut)
def api_delete_collection(body: DeleteCollectionIn):
    try:
        mes = {
            "collectionname": body.collectionname,
            "userid": body.userid
        }
        ok, msg = delete_collection(mes)
        if not ok:
            raise HTTPException(status_code=400, detail=msg)
        return {"ok": True, "message": "删除成功"}
    except Exception as e:
        return {"ok": False, "message": f"删除失败: {e}"}



@router.post("/doc/upload", response_model=DocRespOut)
async def api_upload_document(
    files: list[UploadFile] = File(...),
    path: str = Form(...),
    userid: str = Form(...)
):
    try:
        ok, msg = upload_doc(
            {
                "files": files,
                "path": path,
                "userid": userid
            }
        )
        return {"ok": ok, "message": msg}
    except Exception as e:
        return {"ok": False, "message": f"上传失败: {e}"}



@router.post("/doc/query", response_model=DocRespOut)
def api_query_document(body: DocQueryIn):
    try:
        mes = {
            "userid": body.userid,
            "keyword": body.keyword
        }
        ok, msg = query_doc(mes)
        if not ok:
            raise HTTPException(status_code=400, detail=msg)
        return {"ok": True, "message": "查询成功", "docs": msg}
    except Exception as e:
        return {"ok": False, "message": f"查询失败: {e}"}



@router.post("/doc/delete", response_model=DocRespOut)
def api_delete_document(body: DocDeleteIn):
    try:
        mes = {
            "userid": body.userid,
            "docids": body.docids
        }
        ok, msg = delete_doc(mes)
        if not ok:
            raise HTTPException(status_code=400, detail=msg)
        return {"ok": True, "message": "删除成功"}
    except Exception as e:
        return {"ok": False, "message": f"删除失败: {e}"}



@router.post("/doc/move", response_model=DocRespOut)
def api_move_document(body: DocMoveIn):
    try:
        mes = {
            "userid": body.userid,
            "docid": body.docid,
            "newname": body.newname,
            "newpath": body.newpath
        }
        ok, msg = move_doc(mes)
        if not ok:
            raise HTTPException(status_code=400, detail=msg)
        return {"ok": True, "message": "移动成功"}
    except Exception as e:
        return {"ok": False, "message": f"移动失败: {e}"}



@router.post("/set/insert", response_model=DocRespOut)
def api_insert_knowledge_set(body: SetInsertIn):
    try:
        mes = {
            "collectionname": body.collectionname,
            "userid": body.userid,
            "docids": body.docids
        }
        ok, msg = insert_knowledgeset(mes)
        if not ok:
            raise HTTPException(status_code=400, detail=msg)
        return {"ok": True, "message": msg}
    except Exception as e:
        return {"ok": False, "message": f"添加失败: {e}"}



@router.post("/set/query", response_model=DocRespOut)
def api_query_knowledge_set(body: SetQueryIn):
    try:
        mes = {
            "collectionname": body.collectionname,
            "userid": body.userid
        }
        ok, data = query_knowledgeset(mes)
        if not ok:
            raise HTTPException(status_code=400, detail=data)
        return {"ok": True, "message": "查询成功", "docs": data}
    except Exception as e:
        return {"ok": False, "message": f"查询失败: {e}"}