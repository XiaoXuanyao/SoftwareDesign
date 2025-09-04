


def extract_pdf(mes: dict):
    pass



def extract_word(mes: dict):
    pass



def extract_txt(mes: dict):
    pass



def extract(mes: dict):
    if mes["name"].endswith(".pdf"):
        return extract_pdf(mes)
    elif mes["name"].endswith(".docx") or mes["name"].endswith(".doc"):
        return extract_word(mes)
    elif mes["name"].endswith(".txt"):
        return extract_txt(mes)
    return False, "不支持的文件类型"