from Execute import execute
import re



NAME_PATTERN = re.compile(r'^[A-Za-z0-9_]+$')



def _check_name(name: str, kind: str):
    if not NAME_PATTERN.fullmatch(name):
        raise ValueError(f"非法{kind}名: {name}")



def check_database(dbname: str):
    _check_name(dbname, "数据库")
    row = execute(
        "SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME=%s LIMIT 1",
        (dbname,),
        fetch='one'
    )
    return row is not None



def check_table(dbname: str, tbname: str):
    _check_name(tbname, "表")
    _check_name(dbname, "数据库")
    row = execute(
        "SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA=%s AND TABLE_NAME=%s LIMIT 1",
        (dbname, tbname),
        fetch='one'
    )
    return row is not None



def create_database(dbname: str):
    _check_name(dbname, "数据库")
    execute(
        f"CREATE DATABASE IF NOT EXISTS `{dbname}`"
    )



def create_table(dbname: str, tbname: str, columns: dict):
    _check_name(tbname, "表")
    _check_name(dbname, "数据库")
    if len(columns) == 0:
        raise ValueError("必须指定至少一个列")
    for col in columns.keys():
        _check_name(col, "列")
    
    parts = []
    for name, definition in columns.items():
        parts.append(f"`{name}` {definition}")
    sql = (f"CREATE TABLE IF NOT EXISTS `{dbname}`.`{tbname}` ("
        + ", ".join(parts)
        + f")"
    )

    execute(sql)



def create_default_database():
    create_database("softwaredesign")



def create_user_table():
    create_table("softwaredesign", "users", {
        "userid": "CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID())",
        "username": "VARCHAR(100) NOT NULL UNIQUE",
        "password": "VARCHAR(100) NOT NULL",
        "nickname": "VARCHAR(100) NOT NULL",
        "email": "VARCHAR(100) NOT NULL",
        "phone": "VARCHAR(100) NOT NULL UNIQUE",
        "birthday": "DATE",
        "sex": "ENUM('male', 'female') DEFAULT NULL",
        "age": "INT UNSIGNED",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    })



def check():
    if not check_database("softwaredesign"):
        create_default_database()
    if not check_table("softwaredesign", "users"):
        create_user_table()