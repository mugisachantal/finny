from __future__ import annotations

from typing import Any, Optional

from app.recommendation import score_lenders

# Placeholder fixtures used until the lenders table is populated from the DB.
PLACEHOLDER_LENDER_FIXTURES = [
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
]


def get_lender_info(lender_name: str) -> Optional[dict]:
    if not lender_name:
        return None
    return {
        "name": lender_name,
        "note": "Use the recommendation engine for ranking and the lender directory for up-to-date details.",
    }


def get_user_applications(user_id: Optional[str]) -> list:
    if not user_id:
        return []
    # TODO: query loan_applications table once it exists
    return []


def get_loan_recommendations_preview(
    amount: Optional[float],
    tenureDays: Optional[float] = None,
    **_kwargs: Any,
) -> dict:
    if not amount:
        return {"tenureAssumedDays": None, "matches": [], "comparisonSummary": None}

    tenure = int(tenureDays or 30)
    ranked = score_lenders(
        requested_amount=float(amount),
        requested_tenure=tenure,
        urgency="medium",
        borrower_profile={},
        lender_list=PLACEHOLDER_LENDER_FIXTURES,
    )

    matches = [
        {
            "lender": item.get("name"),
            "licensedByUMRA": True,
            "avgApprovalTime": "24h",
            "interestModel": "flat",
            "totalRepaymentEstimate": int(item.get("totalRepayment", 0)),
            "installmentEstimate": int(item.get("totalRepayment", 0) / max(tenure, 1)),
            "tenureAssumedDays": tenure,
            "score": int(item.get("finalScore", 0)),
            "whyRanked": [item.get("reason", "competitive total repayment")],
            "note": "Recommendation returned by the shared scoring engine.",
        }
        for item in ranked
    ]

    comparison_summary = None
    if len(matches) >= 2:
        comparison_summary = (
            f"{matches[0]['lender']} is ranked above {matches[1]['lender']} "
            f"because the shared recommendation engine scored it higher for cost and trust."
        )

    return {
        "tenureAssumedDays": tenure,
        "matches": matches,
        "comparisonSummary": comparison_summary,
    }
