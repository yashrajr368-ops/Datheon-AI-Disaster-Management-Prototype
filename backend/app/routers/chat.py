from fastapi import APIRouter
from app.schemas import ChatRequest, ChatResponse
from app.assistant import assistant

router = APIRouter(prefix="/api/chat", tags=["AI Assistant"])

@router.post("", response_model=ChatResponse)
def chat_with_assistant(req: ChatRequest):
    history_dicts = [{"role": m.role, "content": m.content} for m in (req.history or [])]
    res = assistant.respond(
        query=req.message,
        history=history_dicts,
        location_context=req.location_context
    )
    return res
