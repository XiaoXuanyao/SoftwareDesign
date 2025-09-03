from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from Mysql.Register import register
from Mysql.Login import login

router = APIRouter(prefix="/api", tags=["auth"])

class RegisterIn(BaseModel):
    username: str
    password: str
    nickname: str
    email: EmailStr
    phone: str
    birthday: Optional[str] = None
    sex: Optional[str] = None
    age: Optional[int] = None

class RegisterOut(BaseModel):
    ok: bool
    message: str

class LoginIn(BaseModel):
    username: str
    password: str

class LoginOut(BaseModel):
    ok: bool
    message: str
    userid: Optional[str] = None

@router.post("/register", response_model=RegisterOut)
def api_register(body: RegisterIn):
    try:
        ok, msg = register(body.model_dump())
        if not ok:
            raise HTTPException(status_code=400, detail=msg)
        return {"ok": True, "message": msg}
    except Exception as e:
        return {"ok": False, "message": "注册失败: " + str(e)}

@router.post("/login", response_model=LoginOut)
def api_login(body: LoginIn):
    try:
        ok, msg = login(body.model_dump())
        if not ok:
            raise HTTPException(status_code=400, detail=msg)
        return {"ok": True, "message": "登录成功", "userid": msg["userid"]}
    except Exception as e:
        return {"ok": False, "message": "登录失败: " + str(e)}