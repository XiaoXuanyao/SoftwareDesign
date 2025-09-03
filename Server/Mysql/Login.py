from .Execute import execute
import re

def checkusername(username):
    if 2 <= len(username) <= 36:
        return True, ""
    return False, "用户名长度必须在8到24之间"

def checkpassword(password):
    if 8 <= len(password) <= 24:
        return True, ""
    return False, "密码长度必须在8到24之间"

def check(username, password):
    row = execute("SELECT * FROM softwaredesign.users WHERE username=%s AND password=%s", (username, password))
    if row == None:
        return False, "用户名或密码错误"
    return True, row["userid"]

def login(mes):
    try:
        is_valid, message = checkusername(mes["username"])
        if not is_valid:
            return False, message
        is_valid, message = checkpassword(mes["password"])
        if not is_valid:
            return False, message

        return check(mes["username"], mes["password"])
    except Exception as e:
        return False, "登录失败: " + str(e)