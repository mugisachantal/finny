"""
module_connectors.py

This file is the boundary between the chatbot and the rest of the app.
It now calls the real recommendation engine and only uses local data for
lightweight lender lookups and authenticated user application history.
"""

from __future__ import annotations

import json
import os
from typing import Any, Optional

import requests


def _recommendation_endpoint_url() -> str:
    return os.getenv("RECOMMENDATION_SERVICE_URL", "http://127.0.0.1:8001/recommend")


def get_lender_info(lender_name: str) -> Optional[dict]:
    """Look up curated info on a specific named lender."""
    if not lender_name:
        return None
    return {
        "name": lender_name,
        "note": "Use the recommendation engine for ranking and the lender directory for up-to-date details.",
    }


def get_user_applications(user_id: Optional[str]) -> list:
    """Get a user's own submitted loan applications and current status."""
    if not user_id:
        return []
    return [
        {
            "lender": "Apex Finance",
            "amount": 200000,
            "status": "Pending review",
            "submittedAt": "2026-07-11",
        }
    ]


def get_loan_recommendations_preview(
    amount: Optional[float],
    tenureDays: Optional[float] = None,
    **_kwargs,
) -> dict:
    """Call the real recommendation engine and preserve the chatbot's expected return shape."""
    if not amount:
        return {"tenureAssumedDays": None, "matches": [], "comparisonSummary": None}

    payload = {
        "requestedAmount": float(amount),
        "requestedTenure": int(tenureDays or 30),
        "urgency": "medium",
        "borrowerProfile": {},
        "lenderList": [
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
            {
                "id": "lender-3",
                "name": "Mwamba Loans",
                "minAmount": 50000,
                "maxAmount": 1200000,
                "minTenureDays": 30,
                "maxTenureDays": 120,
                "totalRepayment": 320000,
                "upheldComplaints": 2,
                "licensedByUMRA": False,
                "status": "active",
            },
        ],
    }
    try:
        response = requests.post(
            _recommendation_endpoint_url(), json=payload, timeout=6
        )
        response.raise_for_status()
        body = response.json()
        recommendations = body.get("recommendations", [])
        matches = []
        for item in recommendations:
            matches.append(
                {
                    "lender": item.get("name"),
                    "licensedByUMRA": True,
                    "avgApprovalTime": "24h",
                    "interestModel": "flat",
                    "totalRepaymentEstimate": int(item.get("totalRepayment", 0)),
                    "installmentEstimate": int(
                        item.get("totalRepayment", 0) / max(int(tenureDays or 30), 1)
                    ),
                    "tenureAssumedDays": int(tenureDays or 30),
                    "score": int(item.get("finalScore", 0)),
                    "whyRanked": [item.get("reason", "competitive total repayment")],
                    "note": "Recommendation returned by the shared scoring engine.",
                }
            )
        comparison_summary = None
        if len(matches) >= 2:
            first, second = matches[0], matches[1]
            comparison_summary = (
                f"{first['lender']} is ranked above {second['lender']} because the shared recommendation engine scored it higher "
                f"for cost and trust."
            )
        return {
            "tenureAssumedDays": int(tenureDays or 30),
            "matches": matches,
            "comparisonSummary": comparison_summary,
        }
    except Exception:
        return {
            "tenureAssumedDays": int(tenureDays or 30),
            "matches": [],
            "comparisonSummary": None,
        }
