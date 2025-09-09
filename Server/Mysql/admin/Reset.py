import mysql.connector
from ...Chroma.Init import client

ADMIN_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "zaq123EWQ",
    "autocommit": True
}

ddl_conn = mysql.connector.connect(**ADMIN_CONFIG)
cur = ddl_conn.cursor()



new_host = "localhost"
new_user = "server"
new_password = "d9j>nM&1!Hp2"

try:
    cur.execute("DROP DATABASE IF EXISTS softwaredesign;")
    cur.execute("DROP DATABASE IF EXISTS sdcollections;")
    client.reset()

except mysql.connector.Error as err:
    print(f"Error: {err}")
finally:
    cur.close()
    ddl_conn.close()