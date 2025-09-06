import mysql.connector
from typing import Literal

USER_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "server",
    "password": "d9j>nM&1!Hp2",
    "autocommit": True
}

def execute(sql, params=[], dictionary=True, fetch: Literal["one", "all"]="one"):
    res = None
    conn = mysql.connector.connect(**USER_CONFIG)
    if not conn.is_connected():
        conn.reconnect(attempts=2, delay=1)
    if not conn.is_connected():
        raise ConnectionError("无法连接到数据库")
    try:
        cur = conn.cursor(dictionary=dictionary)
        cur.execute(sql, params)
        if fetch == "one":
            res = cur.fetchone()
        else:
            res = cur.fetchall()
    finally:
        cur.close()
        conn.close()
    return res