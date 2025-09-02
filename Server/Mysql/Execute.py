import mysql.connector

USER_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "server",
    "password": "d9j>nM&1!Hp2",
    "autocommit": True
}
conn = mysql.connector.connect(**USER_CONFIG)

def ensure_conn():
    if not conn.is_connected():
        conn.reconnect(attempts=2, delay=1)

def execute(sql, *params, dictionary=False, fetch: str="one"|"all"):
    ensure_conn()
    res = None
    try:
        cur = conn.cursor(dictionary=dictionary)
        cur.execute(sql, params)
        if fetch == "one":
            res = cur.fetchone()
        else:
            res = cur.fetchall()
    finally:
        cur.close()
    return res

def close():
    conn.close()