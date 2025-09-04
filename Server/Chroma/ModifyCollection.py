from typing import Literal
from .AddCollection import check_collection_name
from .Init import client
from ..Mysql.Execute import execute
from .Embedding.Extract import extract
from .Embedding.Embedding import embdding_chunks



def check_permission(collectionname: str, userid: str, type: Literal["w", "r"]):
    is_valid, message = check_collection_name(collectionname)
    if not is_valid:
        return False, message
    if type == "r":
        row = execute(
            "SELECT 1 FROM softwaredesign.collections WHERE collectionname=%s AND permission=%s LIMIT 1",
            [collectionname, "public"],
        )
        if row is not None:
            return True, ""
    row = execute(
        "SELECT 1 FROM softwaredesign.collections WHERE collectionname=%s AND userid=%s LIMIT 1",
        [collectionname, userid],
    )
    if row is not None:
        return True, ""
    return False, "知识库不存在或无权限进行此操作"



def insert(mes: dict):
    is_valid, message = check_permission(mes["collectionname"], "w")
    if not is_valid:
        return False, message
    execute(
        f"INSERT INTO sdcollections.{mes['collectionname']} ("
            + "name, type, description) VALUES (%s, %s, %s)",
        [mes["name"], mes["type"], mes["description"]]
    )
    is_valid, message = extract(mes)
    if not is_valid:
        return False, message
    chunks = message
    embeddings = embdding_chunks(chunks)
    collection = client.get_collection(mes["collectionname"])
    documents = [ch.page_content for ch in chunks]
    metadata = []
    for i, c in enumerate(chunks):
        meta = dict(c.metadata) if hasattr(c, "metadata") else {}
        meta["doc_name"] = mes["name"]
        meta["chunk_index"] = i
        metadata.append(meta)
    ids = [f"{mes['name']}-chunk-{i}" for i in range(len(chunks))]
    collection.add(
        documents=documents,
        metadatas=metadata,
        ids=ids,
        embeddings=embeddings
    )
    return True, ""



def erase(mes: dict):
    is_valid, message = check_permission(mes["collectionname"], "w")
    if not is_valid:
        return False, message
    execute(
        f"DELETE FROM sdcollections.{mes['collectionname']} WHERE name=%s",
        [mes["name"]]
    )
    collection = client.get_collection(mes["collectionname"])
    collection.delete(where={"doc_name": mes["name"]})
    return True, ""