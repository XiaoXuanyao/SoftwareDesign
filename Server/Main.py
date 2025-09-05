from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .Auth import router as auth_router
from .Knowledge import router as knowledge_router
from .Mysql import CreateTable

CreateTable.check()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)
app.include_router(auth_router)
app.include_router(knowledge_router)