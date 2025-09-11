from typing import Literal
from ..Mysql.Execute import execute
from .Init import DOCS_DIR
import os
import re
import shutil



def check_admin_or_expert(userid: str):
    row = execute(
        "SELECT 1 FROM softwaredesign.users WHERE userid=%s AND role IN ('admin', 'expert') LIMIT 1;",
        [userid],
    )
    if row is not None:
        return True, ""
    return False, "用户不存在或无权限进行此操作"



def check_doc_name(docname: str):
    if not docname.endswith((".pdf", ".doc", ".docx", ".txt")):
        return False, "仅支持上传 PDF、Word、TXT 格式的文件"
    return True, ""

def check_doc_path(docpath: str):
    if len(docpath) > 63:
        return False, "路径过长"
    
    if re.match(r"^[A-Za-z]:[\\/]", docpath) or docpath.startswith("\\\\"):
        return False, "必须使用相对路径"
    
    path_check = docpath.lstrip("/\\")
    parts = [p for p in re.split(r"[\\/]+", path_check) if p]
    if any(p in (".", "..") for p in parts):
        return False, "路径不能包含 . 或 .."
    
    allowed = re.compile(r"^[A-Za-z0-9_\- .]+$")
    for p in parts:
        if not allowed.fullmatch(p):
            return False, "路径包含非法字符"
        if len(p) > 16:
            return False, "路径段过长"
    
    return True, ""



def upload(mes: dict):
    is_valid, message = check_admin_or_expert(mes["userid"])
    if not is_valid:
        return False, message
    
    try:
        is_valid, message = check_doc_path(mes["path"])
        if not is_valid:
            return False, message
        mes["path"] = mes["path"].strip("/").replace("..", "")
        
        save_dir = DOCS_DIR / mes["path"]
        os.makedirs(save_dir, exist_ok=True)

        for file in mes["files"]:
            is_valid, message = check_doc_name(file.filename)
            if not is_valid:
                return False, message

            file_path = os.path.join(save_dir, file.filename)
            if os.path.exists(file_path):
                return False, f"当前目录下文件 {file.filename} 已存在"
            with open(file_path, "wb") as f:
                content = file.file.read() if hasattr(file, "file") else file.read()
                f.write(content)
            execute(
                "INSERT INTO softwaredesign.docs (docname, uploaduserid, path, description) VALUES (%s, %s, %s, %s);",
                [file.filename, mes["userid"], mes["path"], mes.get("description", "")]
            )
        return True, ""

    except Exception as e:
        return False, f"文件保存失败: {e}"



def query(mes: dict):
    is_valid, message = check_admin_or_expert(mes["userid"])
    if not is_valid:
        return False, message
    
    keyword = mes.get("keyword", "")
    try:
        rows = execute(
            "SELECT docid, docname, uploaduserid, path, description FROM softwaredesign.docs WHERE docname LIKE %s ORDER BY docid DESC LIMIT 50;",
            [f"%{keyword}%"],
            dictionary=True,
            fetch="all"
        )
        return True, rows
    except Exception as e:
        return False, f"查询失败: {e}"



def delete(mes: dict):
    is_valid, message = check_admin_or_expert(mes["userid"])
    if not is_valid:
        return False, message

    docids = mes.get("docids", [])
    try:
        for docid in docids:
            row = execute(
                "SELECT docname, path FROM softwaredesign.docs WHERE docid=%s;",
                [docid],
                dictionary=True,
                fetch="one"
            )
            if not row:
                return False, "文档不存在"

            filename = row["docname"]
            path = row["path"]
            file_path = DOCS_DIR / path.strip("/").replace("..", "") / filename

            if os.path.exists(file_path):
                os.remove(file_path)

            execute(
                "DELETE FROM softwaredesign.docs WHERE docid=%s;",
                [docid]
            )
        return True, ""
    except Exception as e:
        return False, f"删除失败: {e}"



def move(mes: dict):
    is_valid, message = check_admin_or_expert(mes["userid"])
    if not is_valid:
        return False, message

    try:
        row = execute(
            "SELECT docname, path FROM softwaredesign.docs WHERE docid=%s LIMIT 1;",
            [mes["docid"]],
            dictionary=True,
            fetch="one"
        )
        if not row:
            return False, "文档不存在"
        
        old_name = row["docname"]
        old_path = row["path"]
        new_name = mes["newname"]
        new_path = mes["newpath"]
        is_valid, message = check_doc_name(new_name)
        if not is_valid:
            return False, message
        is_valid, message = check_doc_path(new_path)
        if not is_valid:
            return False, message
        
        old_file_path = DOCS_DIR / old_path.strip("/").replace("..", "") / old_name
        new_dir = DOCS_DIR / new_path.strip("/").replace("..", "")
        new_file_path = new_dir / new_name

        if old_file_path == new_file_path:
            return False, "新文件路径与原文件路径相同"
        if new_file_path.exists():
            return False, "目标位置已存在同名文件"
        
        os.makedirs(new_dir, exist_ok=True)
        shutil.move(old_file_path, new_file_path)

        try:
            execute(
                "UPDATE softwaredesign.docs SET docname=%s, path=%s WHERE docid=%s;",
                [new_name, new_path, mes["docid"]]
            )
        except Exception as e:
            os.makedirs(old_file_path.parent, exist_ok=True)
            try:
                shutil.move(str(new_file_path), str(old_file_path))
            except Exception as e:
                return False, f"数据库更新失败，且文件恢复失败: {e}"
            print(e)
            print(e.__traceback__.tb_lineno)
            return False, f"数据库更新失败: {e}"
        
        return True, ""

    except Exception as e:
        return False, f"移动失败: {e}"