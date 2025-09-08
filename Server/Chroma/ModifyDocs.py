from typing import Literal
from ..Mysql.Execute import execute
from .Init import DOCS_DIR
import os



def check_admin_or_expert(userid: str):
    row = execute(
        "SELECT 1 FROM softwaredesign.users WHERE userid=%s AND role IN ('admin', 'expert') LIMIT 1;",
        [userid],
    )
    if row is not None:
        return True, ""
    return False, "用户不存在或无权限进行此操作"



def upload(mes: dict):
    is_valid, message = check_admin_or_expert(mes["userid"])
    if not is_valid:
        return False, message
    
    try:
        files = mes["files"]
        path = mes["path"]
        save_dir = DOCS_DIR / path.strip("/").replace("..", "")
        os.makedirs(save_dir, exist_ok=True)

        for file in files:
            filename = getattr(file, "filename", "unknown")
            file_path = os.path.join(save_dir, filename)
            with open(file_path, "wb") as f:
                content = file.file.read() if hasattr(file, "file") else file.read()
                f.write(content)
            execute(
                "INSERT INTO softwaredesign.docs (docname, uploaduserid, path, description) VALUES (%s, %s, %s, %s);",
                [filename, mes["userid"], path, mes.get("description", "")]
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