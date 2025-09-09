from .Execute import execute
from ..Debug import Debug
import re



NAME_PATTERN = re.compile(r'^[A-Za-z0-9_]+$')



def _check_name(name: str, kind: str):
    if not NAME_PATTERN.fullmatch(name):
        raise ValueError(f"非法{kind}名: {name}")



def check_database(dbname: str):
    _check_name(dbname, "数据库")
    row = execute(
        "SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME=%s LIMIT 1;",
        [dbname],
        fetch='one'
    )
    return row is not None



def check_table(dbname: str, tbname: str):
    _check_name(tbname, "表")
    _check_name(dbname, "数据库")
    row = execute(
        "SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA=%s AND TABLE_NAME=%s LIMIT 1;",
        [dbname, tbname],
        fetch='one'
    )
    return row is not None



def create_database(dbname: str):
    _check_name(dbname, "数据库")
    execute(
        f"CREATE DATABASE IF NOT EXISTS `{dbname}`;"
    )



def create_table(dbname: str, tbname: str, columns: dict, refs: list=[]):
    _check_name(tbname, "表")
    _check_name(dbname, "数据库")
    if len(columns) == 0:
        raise ValueError("必须指定至少一个列")
    for col in columns.keys():
        _check_name(col, "列")
    
    parts = []
    for name, definition in columns.items():
        parts.append(f"`{name}` {definition}")
    for ref in refs:
        parts.append(ref)
    sql = (f"CREATE TABLE IF NOT EXISTS `{dbname}`.`{tbname}` ("
        + ", ".join(parts)
        + f") COLLATE=utf8mb4_bin;"
    )

    execute(sql)



def create_default_database():
    create_database("softwaredesign")



def create_collections_database():
    create_database("sdcollections")



def create_users_table():
    create_table("softwaredesign", "users", {
        "userid": "CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID())",
        "username": "VARCHAR(100) NOT NULL UNIQUE",
        "password": "VARCHAR(100) NOT NULL",
        "nickname": "VARCHAR(100) NOT NULL",
        "role": "ENUM('admin', 'expert', 'user') NOT NULL DEFAULT 'user'",
        "email": "VARCHAR(100) NOT NULL",
        "phone": "VARCHAR(100) NOT NULL UNIQUE",
        "birthday": "DATE",
        "sex": "ENUM('male', 'female') DEFAULT NULL",
        "age": "INT UNSIGNED",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    })



def create_docs_meta_table():
    create_table("softwaredesign", "docs", {
        "docid": "CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID())",
        "docname": "VARCHAR(200) NOT NULL",
        "uploaduserid": "CHAR(36)",
        "path": "VARCHAR(50)",
        "description": "TEXT",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    },
    [
        "FOREIGN KEY (`uploaduserid`) REFERENCES `users`(`userid`) ON DELETE SET NULL"
    ])



def create_collections_meta_table():
    create_table("softwaredesign", "collections", {
        "collectionid": "CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID())",
        "collectionname": "VARCHAR(200) NOT NULL",
        "hash": "CHAR(64) NOT NULL UNIQUE",
        "userid": "CHAR(36) NOT NULL",
        "description": "TEXT",
        "permission": "ENUM('private', 'public') NOT NULL DEFAULT 'private'",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "updated_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
    },
    [
        "UNIQUE KEY `uq_collectionname_user` (`collectionname`, `userid`)",
        "FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE CASCADE"
    ])



def create_collections_table(collectionname: str):
    create_table("sdcollections", collectionname, {
        "vecid": "INT AUTO_INCREMENT PRIMARY KEY",
        "docname": "VARCHAR(200) NOT NULL",
        "docid": "CHAR(36) NOT NULL UNIQUE",
        "uploaduserid": "CHAR(36) NOT NULL",
        "type": "VARCHAR(50)",
        "description": "TEXT",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    })



def check():
    if not check_database("softwaredesign"):
        create_default_database()
    if not check_database("sdcollections"):
        create_collections_database()
    if not check_table("softwaredesign", "users"):
        create_users_table()
    if not check_table("softwaredesign", "collections"):
        create_collections_meta_table()
    if not check_table("softwaredesign", "docs"):
        create_docs_meta_table()
    Debug.log("Debug", "MySQL数据库检验完成")
