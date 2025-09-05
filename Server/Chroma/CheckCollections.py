from .Init import client
from ..Mysql.Execute import execute
from ..Mysql.CreateTable import create_collections_table



def query_all_collections(mes: dict):
    rows = execute(
        "SELECT collectionname, userid, description, permission FROM softwaredesign.collections "
        + "WHERE userid=%s",
        [mes["userid"]],
        fetch="all"
    )
    return True, rows