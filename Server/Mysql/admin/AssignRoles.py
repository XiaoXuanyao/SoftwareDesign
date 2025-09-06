# 仅管理员在本地运行此文件，不参与项目程序运行。

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

user_list = [
    "XiaoMuchen"
]
role = "admin"

try:
    for username in user_list:
        sql = "UPDATE softwaredesign.users SET role=%s WHERE username=%s;"
        cur.execute(sql, (role, username))
        if cur.rowcount == 0:
            print(f"用户 {username} 不存在")
        else:
            print(f"已将用户 {username} 的角色设置为 {role}")
except mysql.connector.Error as err:
    print(f"Error: {err}")
finally:
    cur.close()
    ddl_conn.close()