from fastapi import FastAPI
from Mysql.CreateTable import check

check()

app = FastAPI()