from .Init import client
from ..Mysql.Execute import execute
from ..Mysql.CreateTable import create_collections_table
import base64



def decode_collection_name(name: str):
    name_bytes = name.encode('utf-8')
    base32_bytes = base64.b32decode(name_bytes + b"=" * ((8 - len(name_bytes) % 8) % 8))
    return base32_bytes.decode('utf-8')

def query_all_collections(mes: dict):
    rows = execute(
        "SELECT collectionname, userid, description, permission FROM softwaredesign.collections "
        + "WHERE userid=%s;",
        [mes["userid"]],
        dictionary=True,
        fetch="all",
    )
    if (rows is not None):
        for row in rows:
            row["collectionname"] = decode_collection_name(row["collectionname"])
    return True, rows
