import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import router

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")


@asynccontextmanager
async def lifespan(app: FastAPI):
    os.environ["OLLAMA_HOST"] = OLLAMA_HOST
    yield


app = FastAPI(title="Mosaic Processor", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router, prefix="", tags=["processor"])
