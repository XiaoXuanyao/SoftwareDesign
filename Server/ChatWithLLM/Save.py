from ..Chroma.Init import CHAT_DIR
from ..Mysql.Execute import execute
import os
import json

def readChatSave(mes: dict):
    try:
        os.makedirs(CHAT_DIR, exist_ok=True)
        userid = mes["userid"]
        filepath = CHAT_DIR / f"{userid}.json"
        row = execute("SELECT 1 FROM softwaredesign.users WHERE userid=%s;", (userid,))
        if row is None:
            return False, "用户不存在"

        with open(filepath, "r", encoding="utf-8") as f:
            content = json.load(f)
        return True, content
    except Exception as e:
        return False, f"读取失败: {e}"

def writeChatSave(mes: dict):
    try:
        os.makedirs(CHAT_DIR, exist_ok=True)
        userid = mes["userid"]
        filepath = CHAT_DIR / f"{userid}.json"
        content = mes["content"]
        row = execute("SELECT 1 FROM softwaredesign.users WHERE userid=%s;", (userid,))
        if row is None:
            return False, "用户不存在"

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(content, f, ensure_ascii=False, indent=4)
        return True, "保存成功"
    except Exception as e:
        return False, f"保存失败: {e}"