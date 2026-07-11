from __future__ import annotations

from typing import Any, Dict, List


def score_lenders(
    requested_amount: float,
    requested_tenure: int,
    urgency: str,
    borrower_profile: Dict[str, Any],
    lender_list: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    qualifying: List[Dict[str, Any]] = []
    for lender in lender_list:
        if lender.get("status") == "deactivated":
            continue
        min_amount = float(lender.get("minAmount", lender.get("min_amount", 0)) or 0)
        max_amount = float(lender.get("maxAmount", lender.get("max_amount", 0)) or 0)
        min_tenure = int(lender.get("minTenureDays", lender.get("min_tenure_days", 0)) or 0)
        max_tenure = int(lender.get("maxTenureDays", lender.get("max_tenure_days", 0)) or 0)
        if not (min_amount <= requested_amount <= max_amount):
            continue
        if not (min_tenure <= requested_tenure <= max_tenure):
            continue
        qualifying.append(lender)

    ranked: List[Dict[str, Any]] = []
    for lender in qualifying:
        total_repayment = float(lender.get("totalRepayment", lender.get("total_repayment", requested_amount)) or requested_amount)
        if total_repayment <= 0:
            total_repayment = requested_amount
        cost_score = 100 - min(100, ((total_repayment / requested_amount - 1) * 100)) if requested_amount else 100
        upheld_complaints = int(lender.get("upheldComplaints", lender.get("upheld_complaints", 0)) or 0)
        licensed = bool(lender.get("licensedByUMRA", lender.get("licensed_by_umra", True)))
        trust_score = 100 - (upheld_complaints * 25) - (0 if licensed else 30)
        trust_score = max(0, trust_score)
        fit_score = 100
        fit_score = max(0, fit_score)
        final_score = cost_score * 0.40 + trust_score * 0.35 + fit_score * 0.25

        reason = "competitive total repayment"
        if trust_score < 70:
            reason = "complaint history reduces confidence"
        elif fit_score < 80:
            reason = "fit to your request is weaker"

        ranked.append(
            {
                "id": lender.get("id"),
                "name": lender.get("name"),
                "totalRepayment": round(total_repayment, 2),
                "finalScore": round(final_score, 2),
                "reason": reason,
                "trustScore": trust_score,
                "costScore": cost_score,
                "fitScore": fit_score,
            }
        )

    ranked.sort(key=lambda item: item["finalScore"], reverse=True)
    return ranked[:3]
