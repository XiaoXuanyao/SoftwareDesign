from .Init import client
from ..Mysql.Execute import execute
from ..Mysql.CreateTable import create_collections_table
from .Embedding.Embedding import embedding_function
import base64
import hashlib



def encode_collection_name(name: str):
    name_bytes = name.encode("utf-8")
    base32_bytes = base64.b32encode(name_bytes)
    return base32_bytes.decode("utf-8").strip("=")

def hash_collection_name(name: str):
    h = hashlib.sha256(name.encode("utf-8")).hexdigest().upper()
    return h[:32]



def check_collection_name(name: str):
    if not (1 <= len(name) <= 90):
        return False, "名称过长"
    return True, ""



def check_collection(name: str):
    is_valid, message = check_collection_name(name)
    if not is_valid:
        return False, message
    row = execute(
        "SELECT 1 FROM softwaredesign.collections WHERE collectionname=%s LIMIT 1;",
        [name],
    )
    if row is None:
        return True, ""
    return False, "项名称已存在"



def add_collection(mes: dict):
    mes["collectionname"] = encode_collection_name(mes["collectionname"])
    mes["hash"] = hash_collection_name(mes["collectionname"])
    is_valid, message = check_collection(mes["collectionname"])
    if not is_valid:
        return False, message
    execute(
        "INSERT INTO softwaredesign.collections (collectionname, hash, userid, description, permission) VALUES (%s, %s, %s, %s, %s);",
        [mes["collectionname"], mes["hash"], mes["userid"], mes["description"], mes["permission"]],
    )
    create_collections_table(mes["hash"])
    client.get_or_create_collection(
        name=mes["hash"],
        metadata={"hnsw:space": "cosine"},
        embedding_function=embedding_function
    )
    return True, ""



def delete_collection(mes: dict):
    is_valid, message = check_collection_name(mes["collectionname"])
    if not is_valid:
        return False, message
    
    collection_name = encode_collection_name(mes["collectionname"])
    user_id = mes["userid"]
    row = execute(
        "SELECT hash FROM softwaredesign.collections WHERE collectionname=%s AND userid=%s LIMIT 1;",
        [collection_name, user_id],
    )
    if row is None:
        return False, "知识库不存在或无权限进行此操作"
    
    collection_hash = row["hash"]
    execute(
        "DELETE FROM softwaredesign.collections WHERE collectionname=%s AND userid=%s;",
        [collection_name, user_id],
    )
    execute(
        f"DROP TABLE IF EXISTS sdcollections.{collection_hash};"
    )
    client.delete_collection(collection_hash)
    return True, ""