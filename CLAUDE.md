# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

Three services, one PostgreSQL instance with isolated schemas:

| Service | Directory | Language | Port | DB Schema |
|---|---|---|---|---|
| Core API | `src/finnycore/` | Laravel 13 / PHP 8.3 | 8080 | `core` |
| Intelligence API | `finny-ai/` | FastAPI / Python 3.11 | 8000 | `intelligence` |
| Frontend | `frontend/` | React 19 + TypeScript + Vite | 5173 | — |

Cross-schema reads between `core` and `intelligence` are allowed for MVP. Finny is an aggregator — it never holds or disburses funds itself.

## Dev Commands

**Full stack (Docker):**
```bash
docker compose up
```

**Frontend only:**
```bash
cd frontend
npm install
npm run dev      # Vite dev server at :5173
npm run build    # Type-check + production build
npm run lint
```

**Intelligence API only** (must run from `finny-ai/` — imports use `from app.*`):
```bash
cd finny-ai
pip install -r requirements.txt
python -m uvicorn app.main:app --reload   # :8000
```

**Core API only:**
```bash
cd src/finnycore
composer setup   # first time: install + .env + key:generate + migrate
composer dev     # artisan serve + queue + pail + vite concurrently
composer test    # config:clear then phpunit
php artisan migrate:fresh --seed   # reset DB
```

## Authentication

Single shared JWT (`HS256`) verified by both services using `JWT_SECRET` env var. Email is the strict primary identifier — never use phone or username as a lookup key.

- Laravel middleware: `auth.jwt` alias for `AuthenticateWithJwt` — sets `$request->user()` to the `Borrower` model
- FastAPI: `HTTPBearer` + `verify_jwt()` in `finny-ai/app/auth.py` — returns `claims["sub"]` as user ID
- Frontend: stores `{ token, user }` in `localStorage` under key `finny_auth` via `AuthContext`

**No Sanctum token table.** Do not reintroduce Sanctum-based auth.

## Vite Proxy Routing (Dev)

The frontend proxies all API calls — never hardcode service URLs in frontend code:

| Path prefix | Target |
|---|---|
| `/api/v1/auth`, `/api/v1/lenders`, `/api/v1/loans` | `http://localhost:8080` (Core) |
| `/api/v1/chat`, `/api/v1/recommendations`, `/api/v1/insights` | `http://localhost:8000` (Intelligence) |

## Response Envelope

All endpoints in both services must follow this envelope or the React client breaks:
```json
// success
{ "message": "...", "data": { ... } }
// error
{ "message": "...", "errors": { "field": ["..."] } }
```

## Key Invariants (from ONBOARDING.md)

- **Lender credentials** are encrypted at rest; decrypt strictly in-memory at request dispatch time — never log or persist plaintext passwords.
- **AI insights** are batch-computed and stored; endpoints return pre-computed DB records, not on-the-fly Groq calls.
- **PII** (passwords, encrypted strings, NINs) must be stripped before appending user context to any Groq prompt.
- **No destructive migrations** without explicit user authorization.
- **TypeScript interfaces** must mirror backend JSON responses. Update both when changing an endpoint.

## Known Gaps (intentional, not bugs to fix without discussion)

- Conversations are stored in-memory in `finny-ai/app/main.py` (`_conversations` dict) — not persisted to DB yet.
- `get_user_applications` tool always returns empty (lender data is hardcoded mock in `module_connectors.py`).
- Groq model: `llama-3.3-70b-versatile` via `Config.MODEL` in `finny-ai/app/config.py`.
