from fastapi import APIRouter, HTTPException

from app.ollama_client import process
from app.schemas import ProcessResponse

router = APIRouter()


@router.post("/process", response_model=ProcessResponse)
def process_message(request: dict):
    message = request.get("message", "")
    history = request.get("history", [])
    known_medications = request.get("known_medications") or []
    category_hint = request.get("category_hint") or ""
    if not message:
        raise HTTPException(status_code=400, detail="message required")
    try:
        return process(message, history, known_medications, category_hint)
    except Exception as e:
        err = str(e).lower()
        if "not found" in err or "404" in err:
            raise HTTPException(
                status_code=503,
                detail="Ollama model not found. Pull it first: docker compose exec ollama ollama pull llama3.2",
            ) from e
        raise HTTPException(status_code=502, detail=str(e)) from e
