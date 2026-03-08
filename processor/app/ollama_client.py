import json
import os

from ollama import Client

from app.prompts import build_system_prompt
from app.schemas import ProcessResponse


def process(
    message: str,
    history: list[dict],
    known_medications: list[str] | None = None,
    category_hint: str = "",
) -> ProcessResponse:
    client = Client(host=os.getenv("OLLAMA_HOST", "http://localhost:11434"))
    model = os.getenv("OLLAMA_MODEL", "llama3.2")

    system_prompt = build_system_prompt(known_medications, category_hint)
    messages = [{"role": "system", "content": system_prompt}]
    for h in history:
        messages.append({"role": "user", "content": h.get("message", "")})
        if artifacts := h.get("artifacts"):
            messages.append({
                "role": "assistant",
                "content": json.dumps(artifacts) if isinstance(artifacts, dict) else str(artifacts),
            })
    messages.append({"role": "user", "content": message})

    response = client.chat(model=model, messages=messages)

    content = response.message.content
    try:
        data = json.loads(content)
        category = data.get("category", "message_only")
        artifacts = data.get("artifacts", {})

        # User confirmed category (reclassification)
        if category_hint:
            category = category_hint

        # If message contains known medication, force medical (LLM may still miss it)
        elif known_medications and category == "message_only":
            msg_lower = message.lower()
            for med in known_medications:
                if med.lower() in msg_lower:
                    category = "medical"
                    # Try to extract medicine from artifacts or build minimal one
                    if not artifacts.get("medicine"):
                        artifacts = {"medicine": {"name": med, "quantity": 1, "taken_at": "now"}}
                    break

        return ProcessResponse(category=category, artifacts=artifacts)
    except json.JSONDecodeError:
        return ProcessResponse(category="message_only", artifacts={})
