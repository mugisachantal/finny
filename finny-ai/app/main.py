from __future__ import annotations

import copy
import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import Body, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.module_connectors import get_user_applications, get_lender_info, get_loan_recommendations_preview
from app.recommendation import score_lenders
from app.system_prompt import build_system_prompt
from app.groq_client import call_chat_model


def _scope_context(user_profile: Dict[str, Any], current_application: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    scoped: Dict[str, Any] = {}
    if not isinstance(user_profile, dict):
        user_profile = {}
    if not isinstance(current_application, dict):
        current_application = {}

    for key in ["income_band", "education_level", "region"]:
        if user_profile.get(key) is not None:
            scoped[key] = user_profile[key]

    for key in ["requested_amount", "requested_tenure_days", "purpose"]:
        if current_application.get(key) is not None:
            scoped[key] = current_application[key]

    return scoped


load_dotenv()

app = FastAPI(title="Finny Intelligence Layer")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory conversation store: conv_id -> {title, history, created_at, last_message, message_count}
_conversations: Dict[str, Dict[str, Any]] = {}


class ChatRequest(BaseModel):
    message: str
    conversationHistory: List[Dict[str, Any]] = Field(default_factory=list)
    userProfile: Dict[str, Any] = Field(default_factory=dict)
    userId: Optional[str] = None
    conversationId: Optional[str] = None


class RecommendRequest(BaseModel):
    requestedAmount: float
    requestedTenure: int = 30
    urgency: str = "medium"
    borrowerProfile: Dict[str, Any] = Field(default_factory=dict)
    lenderList: List[Dict[str, Any]] = Field(default_factory=list)


@app.get("/health")
def health() -> Dict[str, Any]:
    return {"status": "ok"}


@app.get("/conversations")
def list_conversations() -> List[Dict[str, Any]]:
    convs = [
        {
            "id": conv_id,
            "title": data["title"],
            "lastMessage": data["last_message"],
            "createdAt": data["created_at"],
            "messageCount": data["message_count"],
        }
        for conv_id, data in _conversations.items()
    ]
    return sorted(convs, key=lambda x: x["createdAt"], reverse=True)


@app.get("/conversations/{conversation_id}")
def get_conversation(conversation_id: str) -> Dict[str, Any]:
    conv = _conversations.get(conversation_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {
        "id": conversation_id,
        "title": conv["title"],
        "history": conv["history"],
        "createdAt": conv["created_at"],
    }


@app.post("/recommend")
def recommend(payload: RecommendRequest) -> Dict[str, Any]:
    lenders = payload.lenderList or [
        {
            "id": "lender-1",
            "name": "Apex Finance",
            "minAmount": 100000,
            "maxAmount": 1000000,
            "minTenureDays": 7,
            "maxTenureDays": 90,
            "totalRepayment": 250000,
            "upheldComplaints": 0,
            "licensedByUMRA": True,
            "status": "active",
        },
        {
            "id": "lender-2",
            "name": "Bridge Credit",
            "minAmount": 100000,
            "maxAmount": 800000,
            "minTenureDays": 14,
            "maxTenureDays": 60,
            "totalRepayment": 300000,
            "upheldComplaints": 1,
            "licensedByUMRA": True,
            "status": "active",
        },
    ]
    ranked = score_lenders(
        requested_amount=payload.requestedAmount,
        requested_tenure=payload.requestedTenure,
        urgency=payload.urgency,
        borrower_profile=payload.borrowerProfile,
        lender_list=lenders,
    )
    return {
        "request": {
            "requestedAmount": payload.requestedAmount,
            "requestedTenure": payload.requestedTenure,
            "urgency": payload.urgency,
        },
        "recommendations": ranked,
    }


@app.post("/chat")
def chat(payload: ChatRequest, request: Request) -> Dict[str, Any]:
    # Resolve user_id: body userProfile.userId first, then Authorization header
    user_id: Optional[str] = None
    if payload.userProfile.get("userId"):
        user_id = str(payload.userProfile["userId"])
    else:
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.lower().startswith("bearer "):
            user_id = auth_header.split(" ", 1)[1]

    # Resolve conversation
    conv_id = payload.conversationId
    if conv_id and conv_id in _conversations:
        history = copy.deepcopy(_conversations[conv_id]["history"])
    else:
        conv_id = str(uuid4())
        history = payload.conversationHistory  # backwards-compat for clients without conversationId
        _conversations[conv_id] = {
            "title": payload.message[:60],
            "history": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_message": payload.message[:100],
            "message_count": 0,
        }

    max_turns = int(os.getenv("MAX_HISTORY_TURNS", "6"))
    trimmed_history = history[-max_turns:]
    messages = [*trimmed_history, {"role": "user", "content": payload.message}]
    system_prompt = build_system_prompt(payload.userProfile)
    result = call_chat_model(system_prompt, messages, context={"userId": user_id})

    # Persist updated history
    reply_text = result.get("reply", "")
    new_history = [
        *history,
        {"role": "user", "content": payload.message},
        {"role": "assistant", "content": reply_text},
    ]
    _conversations[conv_id]["history"] = new_history
    _conversations[conv_id]["last_message"] = reply_text[:100]
    _conversations[conv_id]["message_count"] = len(new_history) // 2

    scoped_context = _scope_context(payload.userProfile, None)
    return {
        **result,
        "conversationId": conv_id,
        "fallback": result.get("reply") == "I can help explain loan costs, complaints, and fraud warnings in plain language. Ask about affordability, rights, or safety.",
        "scopedContext": scoped_context,
    }


@app.post("/ussd/webhook")
def ussd_webhook(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    phone_number = payload.get("phoneNumber") or payload.get("phone_number") or ""
    text = payload.get("text") or ""
    lenders = [
        {
            "id": "lender-1",
            "name": "Apex Finance",
            "minAmount": 100000,
            "maxAmount": 1000000,
            "minTenureDays": 7,
            "maxTenureDays": 90,
            "totalRepayment": 250000,
            "upheldComplaints": 0,
            "licensedByUMRA": True,
            "status": "active",
        },
        {
            "id": "lender-2",
            "name": "Bridge Credit",
            "minAmount": 100000,
            "maxAmount": 800000,
            "minTenureDays": 14,
            "maxTenureDays": 60,
            "totalRepayment": 300000,
            "upheldComplaints": 1,
            "licensedByUMRA": True,
            "status": "active",
        },
    ]
    ranked = score_lenders(requested_amount=200000, requested_tenure=30, urgency="medium", borrower_profile={}, lender_list=lenders)
    return {
        "phoneNumber": phone_number,
        "message": f"Top option: {ranked[0]['name']} ({ranked[0]['finalScore']} pts)",
        "input": text,
    }
