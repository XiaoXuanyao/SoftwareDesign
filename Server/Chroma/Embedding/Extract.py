from . import ExtractFile
from . import ExtractWebpage

def extract(mes: dict):
    if mes["type"] == "file":
        return ExtractFile.extract(mes)
    elif mes["type"] == "webpage":
        return ExtractWebpage.extract(mes)
    else:
        return False, "不支持的文档类型"