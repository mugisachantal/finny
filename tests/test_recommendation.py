from app.recommendation import score_lenders


def test_recommendation_ranks_by_cost_and_trust_without_commission_input():
    borrower_profile = {"incomeBand": "low", "borrowingExperience": "first_time"}
    lenders = [
        {
            "id": "l1",
            "name": "CheapLender",
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
            "id": "l2",
            "name": "TrustedLender",
            "minAmount": 100000,
            "maxAmount": 1000000,
            "minTenureDays": 7,
            "maxTenureDays": 90,
            "totalRepayment": 300000,
            "upheldComplaints": 1,
            "licensedByUMRA": True,
            "status": "active",
        },
    ]

    result = score_lenders(200000, 30, "medium", borrower_profile, lenders)

    assert result[0]["name"] == "CheapLender"
    assert result[0]["totalRepayment"] == 250000
    assert "commission" not in result[0].get("reason", "").lower()
