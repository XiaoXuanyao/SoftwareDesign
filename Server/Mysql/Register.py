from .Execute import execute
import re

_USERNAME_PATTERN = re.compile(r'^[A-Za-z0-9]{2,36}$')
def check_username(username: str):
    if _USERNAME_PATTERN.fullmatch(username):
        return True, ""
    if not (2 <= len(username) <= 36):
        return False, "用户名长度必须在2到36之间"
    if not username.isalnum():
        return False, "用户名只能包含字母和数字"
    return False, "用户名不符合规则"

_ALLOWED_SPECIALS = r"!@#$%^&*?_~\-+=."
_PASSWORD_PATTERN = re.compile(
    rf"^(?=.*[A-Za-z])(?=.*\d)(?=.*[{_ALLOWED_SPECIALS}])[A-Za-z\d{_ALLOWED_SPECIALS}]{{8,24}}$"
)
def check_password(password: str):
    if _PASSWORD_PATTERN.fullmatch(password):
        return True, ""
    if not (8 <= len(password) <= 24):
        return False, "密码长度需8-24"
    if not re.search(r"[A-Za-z]", password):
        return False, "需至少一个字母"
    if not re.search(r"\d", password):
        return False, "需至少一个数字"
    if not re.search(rf"[{_ALLOWED_SPECIALS}]", password):
        return False, "需至少一个特殊字符"
    bad = re.search(rf"[^{_ALLOWED_SPECIALS}A-Za-z0-9]", password)
    if bad:
        return False, f"含非法字符: {bad.group()}"
    return False, "密码不符合规则"

def check_nickname(nickname: str):
    if 2 <= len(nickname) <= 14:
        return True, ""
    return False, "昵称长度必须在2到14之间"

def check_phone(phone: str):
    if re.fullmatch(r"^\d{11}$", phone):
        return True, ""
    return False, "手机号格式不正确"

def check_email(email: str):
    if re.fullmatch(r"^[\w\.-]+@[\w\.-]+\.\w+$", email):
        return True, ""
    return False, "邮箱格式不正确"

def check_birthday(birthday: str):
    if re.fullmatch(r"^\d{2}-\d{2}$", birthday):
        return True, ""
    return False, "生日格式不正确"

def check_sex(sex: str):
    if sex in ["male", "female"]:
        return True, ""
    return False, "性别必须是 male 或 female"

def check_age(age: int):
    if 3 <= age <= 150:
        return True, ""
    return False, "年龄必须在 3 到 150 之间"

def check(mes: dict):
    is_valid, message = check_username(mes["username"])
    if not is_valid:
        return False, message
    is_valid, message = check_password(mes["password"])
    if not is_valid:
        return False, message
    is_valid, message = check_nickname(mes["nickname"])
    if not is_valid:
        return False, message
    is_valid, message = check_email(mes["email"])
    if not is_valid:
        return False, message
    is_valid, message = check_phone(mes["phone"])
    if not is_valid:
        return False, message
    if mes["birthday"] != None:
        is_valid, message = check_birthday(mes["birthday"])
        if not is_valid:
            return False, message
    if mes["sex"] != None:
        is_valid, message = check_sex(mes["sex"])
        if not is_valid:
            return False, message
    if mes["age"] != None:
        is_valid, message = check_age(mes["age"])
        if not is_valid:
            return False, message
    return True, ""

def check_username_exists(username):
    row = execute("SELECT * FROM softwaredesign.users WHERE username=%s;", (username,), fetch="one")
    return row is not None

def register(mes: dict):
    if (mes.get("birthday") is None):
        mes["birthday"] = None
    if (mes.get("sex") is None):
        mes["sex"] = None
    if (mes.get("age") is None):
        mes["age"] = None
        
    is_valid, message = check(mes)
    if not is_valid:
        return False, message
    if check_username_exists(mes["username"]):
        return False, "用户名已存在"
    execute("INSERT INTO softwaredesign.users (username, password, nickname, email, phone, birthday, sex, age) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);",
             (mes["username"], mes["password"], mes["nickname"], mes["email"], mes["phone"], mes["birthday"], mes["sex"], mes["age"]))
    return True, "注册成功"