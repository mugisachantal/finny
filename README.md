# Finny Intelligence Layer

## Endpoints

- POST /recommend
  - Input: requestedAmount, requestedTenure, urgency, borrowerProfile, lenderList
  - Output: ranked recommendations with total repayment, score, and reason
  - Assumption: the Laravel-owned lender table is expected to expose fields such as min_amount, max_amount, min_tenure_days, max_tenure_days, licensed_by_umra, upheld_complaints, and status; this service normalizes several common spellings for compatibility.

- POST /chat
  - Input: message, sessionId, userProfile, currentApplication
  - Output: plain-language answer plus the scoped context used for the turn
  - Assumption: the Laravel-owned user/application tables expose profile fields and current application fields in the expected shape; the service only sends the scoped subset to the model or fallback.

- POST /ussd/webhook
  - Input: phoneNumber, text, sessionId
  - Output: a USSD-style response that reuses the same /recommend scoring path
  - Note: this endpoint does not duplicate scoring logic; it calls the recommendation handler directly.
