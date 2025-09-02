from Execute import execute
import re

def checkusername(username):
    if 8 < len(username) < 24:
        return True, ""
    return False, "用户名长度必须在8到24之间"

def checkpassword(password):
    if 8 < len(password) < 24:
        return True, ""
    return False, "密码长度必须在8到24之间"

def check(username, password):
    execute("SELECT * FROM user WHERE name=%s AND password=%s", (username, password))

def login(username, password):
    is_valid, message = checkusername(username)
    if not is_valid:
        return False, message
    is_valid, message = checkpassword(password)
    if not is_valid:
        return False, message
    
    return True, "登录成功"
