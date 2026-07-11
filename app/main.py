from __future__ import annotations

import os
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
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


class ChatRequest(BaseModel):
    message: str
    conversationHistory: List[Dict[str, Any]] = Field(default_factory=list)
    userProfile: Dict[str, Any] = Field(default_factory=dict)
    userId: Optional[str] = None


class RecommendRequest(BaseModel):
    requestedAmount: float
    requestedTenure: int = 30
    urgency: str = "medium"
    borrowerProfile: Dict[str, Any] = Field(default_factory=dict)
    lenderList: List[Dict[str, Any]] = Field(default_factory=list)


@app.get("/health")
def health() -> Dict[str, Any]:
    return {"status": "ok"}


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
    user_id = None
    auth_header = request.headers.get("authorization")
    if auth_header and auth_header.lower().startswith("bearer "):
        user_id = auth_header.split(" ", 1)[1]

    trimmed_history = payload.conversationHistory[-int(os.getenv("MAX_HISTORY_TURNS", "6")) :]
    messages = [*trimmed_history, {"role": "user", "content": payload.message}]
    system_prompt = build_system_prompt(payload.userProfile)
    result = call_chat_model(system_prompt, messages, context={"userId": user_id})

    scoped_context = _scope_context(payload.userProfile, None)
    return {
        **result,
        "fallback": result.get("reply") == "I can help explain loan costs, complaints, and fraud warnings in plain language. Ask about affordability, rights, or safety.",
        "scopedContext": scoped_context,
    }


@app.post("/ussd/webhook")
def ussd_webhook(payload: Dict[str, Any]) -> Dict[str, Any]:
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
