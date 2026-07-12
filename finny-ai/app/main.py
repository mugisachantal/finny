from __future__ import annotations

import copy
import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field

from app.auth import JwtVerificationError, verify_jwt
from app.config import Config
from app.groq_client import call_chat_model
from app.module_connectors import (
    PLACEHOLDER_LENDER_FIXTURES,
    get_lender_info,
    get_loan_recommendations_preview,
    get_user_applications,
)
from app.recommendation import score_lenders
from app.system_prompt import build_system_prompt

load_dotenv()

app = FastAPI(title="Finny Intelligence API")

_allowed_origin = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[_allowed_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store until a conversations table is added to the intelligence schema.
_conversations: Dict[str, Dict[str, Any]] = {}

_bearer = HTTPBearer(auto_error=False)


def _require_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
) -> str:
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing authentication token.")
    try:
        claims = verify_jwt(credentials.credentials)
        return str(claims["sub"])
    except JwtVerificationError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc


def _scoped_context(
    user_profile: Dict[str, Any],
    current_application: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    user_profile = user_profile if isinstance(user_profile, dict) else {}
    current_application = current_application if isinstance(current_application, dict) else {}
    scoped: Dict[str, Any] = {}
    for key in ["income_band", "education_level", "region"]:
        if user_profile.get(key) is not None:
            scoped[key] = user_profile[key]
    for key in ["requested_amount", "requested_tenure_days", "purpose"]:
        if current_application.get(key) is not None:
            scoped[key] = current_application[key]
    return scoped


class ChatRequest(BaseModel):
    message: str
    conversationHistory: List[Dict[str, Any]] = Field(default_factory=list)
    userProfile: Dict[str, Any] = Field(default_factory=dict)
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


@app.get("/api/v1/chat/conversations")
def list_conversations(user_id: str = Depends(_require_user)) -> Dict[str, Any]:
    convs = sorted(
        [
            {
                "id": conv_id,
                "title": data["title"],
                "lastMessage": data["last_message"],
                "createdAt": data["created_at"],
                "messageCount": data["message_count"],
            }
            for conv_id, data in _conversations.items()
        ],
        key=lambda x: x["createdAt"],
        reverse=True,
    )
    return {"message": "Conversations loaded.", "data": convs}


@app.get("/api/v1/chat/conversations/{conversation_id}")
def get_conversation(
    conversation_id: str, user_id: str = Depends(_require_user)
) -> Dict[str, Any]:
    conv = _conversations.get(conversation_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    return {
        "message": "Conversation loaded.",
        "data": {
            "id": conversation_id,
            "title": conv["title"],
            "history": conv["history"],
            "createdAt": conv["created_at"],
        },
    }


@app.get("/api/v1/recommendations")
def recommendations_get(
    requestedAmount: float = 0,
    requestedTenure: int = 30,
    urgency: str = "medium",
    user_id: str = Depends(_require_user),
) -> Dict[str, Any]:
    ranked = score_lenders(
        requested_amount=requestedAmount,
        requested_tenure=requestedTenure,
        urgency=urgency,
        borrower_profile={},
        lender_list=PLACEHOLDER_LENDER_FIXTURES,
    )
    return {
        "message": "Recommendations generated.",
        "data": {
            "request": {
                "requestedAmount": requestedAmount,
                "requestedTenure": requestedTenure,
                "urgency": urgency,
            },
            "recommendations": ranked,
        },
    }


@app.post("/api/v1/recommendations")
def recommendations_post(
    payload: RecommendRequest, user_id: str = Depends(_require_user)
) -> Dict[str, Any]:
    lenders = payload.lenderList or PLACEHOLDER_LENDER_FIXTURES
    ranked = score_lenders(
        requested_amount=payload.requestedAmount,
        requested_tenure=payload.requestedTenure,
        urgency=payload.urgency,
        borrower_profile=payload.borrowerProfile,
        lender_list=lenders,
    )
    return {
        "message": "Recommendations generated.",
        "data": {
            "request": {
                "requestedAmount": payload.requestedAmount,
                "requestedTenure": payload.requestedTenure,
                "urgency": payload.urgency,
            },
            "recommendations": ranked,
        },
    }


@app.post("/api/v1/chat/message")
def chat(payload: ChatRequest, user_id: str = Depends(_require_user)) -> Dict[str, Any]:
    conv_id = payload.conversationId
    if conv_id and conv_id in _conversations:
        history = copy.deepcopy(_conversations[conv_id]["history"])
    else:
        conv_id = str(uuid4())
        history = payload.conversationHistory
        _conversations[conv_id] = {
            "title": payload.message[:60],
            "history": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_message": payload.message[:100],
            "message_count": 0,
        }

    trimmed_history = history[-Config.MAX_HISTORY_TURNS:]
    messages = [*trimmed_history, {"role": "user", "content": payload.message}]
    system_prompt = build_system_prompt(payload.userProfile)
    result = call_chat_model(system_prompt, messages, context={"userId": user_id})

    reply_text = result.get("reply", "")
    new_history = [
        *history,
        {"role": "user", "content": payload.message},
        {"role": "assistant", "content": reply_text},
    ]
    _conversations[conv_id]["history"] = new_history
    _conversations[conv_id]["last_message"] = reply_text[:100]
    _conversations[conv_id]["message_count"] = len(new_history) // 2

    return {
        "message": "Response generated.",
        "data": {
            **result,
            "conversationId": conv_id,
            "scopedContext": _scoped_context(payload.userProfile),
        },
    }
