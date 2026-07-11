from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_recommend_endpoint_returns_ranked_results():
    response = client.post(
        "/recommend",
        json={
            "requestedAmount": 200000,
            "requestedTenure": 30,
            "urgency": "medium",
            "borrowerProfile": {"incomeBand": "low", "borrowingExperience": "first_time"},
            "lenderList": [
                {
                    "id": "l1",
                    "name": "Cheap Lender",
                    "minAmount": 100000,
                    "maxAmount": 1000000,
                    "minTenureDays": 7,
                    "maxTenureDays": 90,
                    "totalRepayment": 250000,
                    "upheldComplaints": 0,
                    "licensedByUMRA": True,
                    "status": "active",
                }
            ],
        },
    )
    assert response.status_code == 200
    assert response.json()["recommendations"][0]["name"] == "Cheap Lender"


def test_chat_endpoint_scopes_context_and_falls_back():
    response = client.post(
        "/chat",
        json={
            "message": "Is this loan safe?",
            "userProfile": {"income_band": "low", "education_level": "secondary", "region": "kampala", "full_name": "secret"},
            "currentApplication": {"requested_amount": 200000, "requested_tenure_days": 30, "purpose": "school fees", "borrower_phone": "secret"},
        },
    )
    assert response.status_code == 200
    assert response.json()["fallback"] is True
    assert response.json()["scopedContext"]["region"] == "kampala"
    assert "full_name" not in response.json()["scopedContext"]
    assert "borrower_phone" not in response.json()["scopedContext"]


def test_ussd_uses_same_scoring_path():
    response = client.post("/ussd/webhook", json={"phoneNumber": "+256700000000", "text": "1"})
    assert response.status_code == 200
    assert "Top option" in response.json()["message"]
