import mysql.connector

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
    cur.execute("CREATE USER IF NOT EXISTS %s@%s IDENTIFIED BY %s;", (new_user, new_host, new_password))
    cur.execute("GRANT CREATE, INSERT, ALTER, SELECT, REFERENCES ON *.* TO %s@%s;", (new_user, new_host))
    cur.execute("GRANT DELETE ON softwaredesign.* TO %s@%s;", (new_user, new_host))
    cur.execute("GRANT ALL ON sdcollections.* TO %s@%s;", (new_user, new_host))
    cur.execute("FLUSH PRIVILEGES;")
except mysql.connector.Error as err:
    print(f"Error: {err}")
finally:
    cur.close()
    ddl_conn.close()