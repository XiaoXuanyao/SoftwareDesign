from .Init import client
from ..Mysql.Execute import execute
from ..Mysql.CreateTable import create_collections_table
from .Embedding.Embedding import embedding_function


def check_collection_name(name: str):
    if not (1 <= len(name) <= 40):
        return False, "集合名长度必须在1到40之间"
    return True, ""



def check_collection(name: str):
    is_valid, message = check_collection_name(name)
    if not is_valid:
        return False, message
    row = execute(
        "SELECT 1 FROM softwaredesign.collections WHERE collectionname=%s LIMIT 1",
        [name],
    )
    if row is not None:
        return True, ""
    return False, "集合不存在"



def add_collection(mes: dict):
    is_valid, message = check_collection(mes["collectionname"])
    if not is_valid:
        return False, message
    execute(
        "INSERT INTO softwaredesign.collections (collectionname, userid, description, permission) VALUES (%s, %s, %s, %s)",
        [mes["collectionname"], mes["userid"], mes["description"], mes["permission"]],
    )
    create_collections_table(mes["collectionname"])
    client.get_or_create_collection(
        name=mes["collectionname"],
        metadata={"hnsw:space": "cosine"},
        embedding_function=embedding_function
    )
    return True, ""