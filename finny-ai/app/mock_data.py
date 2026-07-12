"""
mock_data.py

This is what lets you work in parallel with your team without being
blocked. As long as the shapes here match whatever "shared-types"
object your team agrees on for UserProfile, swapping this out for the
real profile service later is a one-line change in server.py, not a
rewrite of the chatbot.
"""

MOCK_PROFILES = {
    "first_time_low_income": {
        "userId": "mock-1",
        "ageRange": "18-24",
        "employmentStatus": "informal/gig",
        "incomeBand": "under 200k",
        "hasPriorLoans": False,
        "location": "Kampala",
    },
    "experienced_borrower": {
        "userId": "mock-2",
        "ageRange": "25-34",
        "employmentStatus": "formal employment",
        "incomeBand": "500k-1M",
        "hasPriorLoans": True,
        "location": "Mbarara",
    },
    "student": {
        "userId": "mock-3",
        "ageRange": "18-24",
        "employmentStatus": "student",
        "incomeBand": "under 200k",
        "hasPriorLoans": False,
        "location": "Kampala",
    },
}
