from typing import Literal
from .Init import client
from .ModifyCollection import check_collection_name
from ..Mysql.Execute import execute
from .Embedding.Extract import extract
from .Embedding.Embedding import embedding_chunks
from .ModifyCollection import encode_collection_name, decode_collection_name, hash_collection_name
from .Init import DOCS_DIR



def check_permission(collectionname: str, userid: str, type: Literal["w", "r"]):
    is_valid, message = check_collection_name(collectionname)
    if not is_valid:
        return False, message
    if type == "r":
        row = execute(
            "SELECT 1 FROM softwaredesign.collections WHERE collectionname=%s AND permission=%s LIMIT 1;",
            [collectionname, "public"],
        )
        if row is not None:
            return True, ""
    row = execute(
        "SELECT 1 FROM softwaredesign.collections WHERE collectionname=%s AND userid=%s LIMIT 1;",
        [collectionname, userid],
    )
    if row is not None:
        return True, ""
    return False, "知识库不存在或无权限进行此操作"



def check_exist(hash: str, docid: str):
    row = execute(
        f"SELECT 1 FROM sdcollections.{hash} WHERE docid=%s LIMIT 1;",
        [docid],
    )
    if row is not None:
        return True, "文档已存在"
    return False, "文档不存在"



def get_docs_count(hash: str):
    row = execute(
        f"SELECT COUNT(*) AS count FROM sdcollections.{hash};",
        fetch='one'
    )
    if row is None:
        return 0
    return row["count"]



def insert(mes: dict):
    mes["collectionname"] = encode_collection_name(mes["collectionname"])
    mes["hash"] = hash_collection_name(mes["collectionname"], mes["userid"])

    is_valid, message = check_permission(mes["collectionname"], mes["userid"], "w")
    if not is_valid:
        return False, message

    if mes["docids"] is None or len(mes["docids"]) == 0:
        return False, "未提供任何文档ID"
    if len(mes["docids"]) > 50:
        return False, "一次最多添加50个文档"

    for docid in mes["docids"]:
        mes["docid"] = docid
        is_exist, message = check_exist(mes["hash"], mes["docid"])
        if is_exist:
            return False, message
        if get_docs_count(mes["hash"]) >= 50:
            return False, "知识库文档数量已达上限"
        
        row = execute(
            "SELECT docname, path, description FROM softwaredesign.docs WHERE docid=%s LIMIT 1;",
            [mes["docid"]],
        )
        if row is None:
            return False, "文档不存在"
        docname = row["docname"]
        path = DOCS_DIR / row["path"].strip("/") / docname
        if not path.is_file():
            return False, "文档不存在，可能已被删除"
        
        try:
            is_valid, message = extract({
                "type": "file",
                "name": docname,
                "path": str(path)
            })
            if not is_valid:
                return False, message
            chunks = message

            embeddings = embedding_chunks(chunks)
            texts = [getattr(c, "page_content", str(c)) for c in chunks]
            metadatas = []
            for i, c in enumerate(chunks):
                base = dict(getattr(c, "metadata", {}) or {})
                base.update({
                    "docid": mes["docid"],
                    "docname": docname,
                    "chunk_index": i,
                })
                metadatas.append(base)
            collection = client.get_collection(mes["hash"])
            ids = [f"{mes['docid']}-{i}" for i in range(len(texts))]
            collection.add(
                ids=ids,
                documents=texts,
                embeddings=embeddings,
                metadatas=metadatas
            )
        except Exception as e:
            return False, f"文档处理失败: {str(e)}"
        
        try:
            execute(
                f"INSERT INTO sdcollections.{mes['hash']} "
                + "(docid, docname, uploaduserid, type, description) VALUES (%s, %s, %s, %s, %s);",
                (mes["docid"], docname, mes["userid"], "file", row.get("description", ""))
            )
        except Exception as e:
            collection.delete(ids=ids)
            return False, f"数据库操作失败: {str(e)}"
    
    return True, "文档添加成功"



def query(mes: dict):
    mes["collectionname"] = encode_collection_name(mes["collectionname"])
    mes["hash"] = hash_collection_name(mes["collectionname"], mes["userid"])

    is_valid, message = check_permission(mes["collectionname"], mes["userid"], "r")
    if not is_valid:
        return False, message
    
    try:
        rows = execute(
            f"SELECT docid, docname, uploaduserid, type, description, created_at "
            + f"FROM sdcollections.{mes['hash']} ORDER BY docid DESC;",
            fetch="all"
        )
        if rows is None:
            return True, []
        return True, rows
    except Exception as e:
        return False, f"查询失败: {str(e)}"