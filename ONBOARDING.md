Here is the finalized `ONBOARDING.md` document, updated to explicitly highlight the extensibility of the API endpoints while maintaining strict adherence to your design philosophy and architectural invariants.

---

# ONBOARDING.md — Finny Platform Architecture & AI Agent Directives

**Attention AI Coding Agents (Claude Code, Cursor, GitHub Copilot, etc.):**
This is the authoritative architectural overview, engineering philosophy, and strict rulebook for the Finny project. Read this completely before generating, modifying, or deleting any code. If a user request conflicts with these invariants, flag it immediately. Do not silently override these principles.

## 1. Platform Vision & Scope

Finny is a user-centered, three-sided platform connecting borrowers to digital lenders. Borrowers are our "unicorn users," and all flows must prioritize their experience, data privacy, and financial literacy. Finny acts as an aggregator, recommendation engine, and educational interface; it does not disburse or hold funds itself.

---

## 2. Engineering Philosophy & Design Principles

To keep the codebase sustainable as the project scales, agents must adhere to the following core principles in every file they touch:

* **Minimalism (No Over-Engineering):** Write exactly what is needed to solve the problem at hand. Avoid speculative abstractions, deeply nested logic, or premature optimizations.
* **Security by Default:** Treat user data as toxic. Assume the system is under attack. PII must be redacted in logs. Passwords must be hashed. 3rd-party lender credentials must be strictly ephemeral.


* **Production Readiness:** Never write "demo-only" code unless explicitly instructed. Implement robust error handling, graceful degradation for API timeouts (especially Groq rate limits), and comprehensive input validation on every endpoint.
* **Separation of Concerns:** Keep boundaries clear. The frontend is strictly for presentation and user state. The Core API (Laravel) handles truth, transactions, and state. The Intelligence API (FastAPI) handles compute, AI, and asynchronous analysis.


* **Self-Documenting Code (Zero-Clutter Readability):** The code must be easy to read, navigate, and maintain. Use expressive, highly descriptive names for variables, classes, and functions. **Do not over-comment.** Comments should be reserved strictly for explaining *why* a complex architectural decision was made or *why* a specific workaround exists, never *what* the code is doing.

---

## 3. Global Architecture & Stack Invariants

* **Frontend:** React + TypeScript + Tailwind (Vite). Communicates directly with both backends.


* **Core API (Laravel / PHP 8.2+):** Owns transactional data, core business logic, user accounts, and standard CRUD operations.


* **Intelligence API (FastAPI / Python 3.11+):** Owns the Groq-powered AI chatbot, recommendation scoring, and scheduled background insight generation.


* **Database:** A single shared PostgreSQL instance with isolated schemas for Core and Intelligence. **Cross-schema reads and writes are explicitly allowed** to simplify MVP development, but queries must be highly optimized.


* **Infrastructure:** Fully Dockerized. Agents are expected to generate and maintain standard `Dockerfile` and `docker-compose.yml` configurations.


* **Authentication:** **Email** is the strict primary identifier for all users (easily verifiable without third-party costs). State is managed via JWTs, verified locally by each service using a shared secret.



---

## 4. Core Implementation Deep-Dives

### 4.1. Dynamic Lender Integration & Schema Mapping

Lenders are not accessed via external redirects. Agents must build a dynamic schema translation engine.

* **Registration & Mapping:** Lenders onboard and define their API endpoint URLs alongside a JSON schema dictating their required and optional payload fields.
* **Dynamic Form Generation:** When a user applies for a loan, the frontend requests this schema. It automatically fills known parameters using the user's Finny profile and generates manual input fields strictly for the missing parameters.
* **Payload Translation:** The Core API receives the hybrid payload, maps it to the lender's exact defined schema, and dispatches the HTTP request to the lender's webhook.

### 4.2. Automated Authentication (The Decryption Pipeline)

To prevent users from navigating away to create accounts on 3rd-party lender platforms, Finny handles dual-registration invisibly.

* **Auto-Signup:** Finny uses the onboarded lender's API to create an account for the user.
* **Credential Handling:** The platform auto-generates a complex password for the user specifically for that lender. This password is encrypted at rest in the PostgreSQL database.
* **Ephemeral Decryption:** Decryption occurs strictly in-memory at the exact millisecond an API request is dispatched to the lender. The plaintext password is included in the payload and immediately garbage-collected. **Under no circumstances should the AI agent write code that logs or stores decrypted lender passwords.**

### 4.3. Asynchronous AI Insights & Cron Architecture

To eliminate high latency and excessive Groq API costs, insights are no longer generated on-the-fly during user requests. Agents must implement a batch-processing architecture.

* **Trigger-Based Generation:** When a new digital lender is approved and onboarded, a background task immediately triggers the Intelligence API to analyze their Terms & Conditions, generating risk scores and limit-growth metrics.
* **Recurring Cron Jobs:** A scheduled worker (e.g., Celery, APScheduler, or Laravel Task Scheduling invoking FastAPI) runs periodically. It analyzes platform-wide data, loan histories, and repayment behaviors to pre-compute insights.
* **Data Storage:** These computed insights, trust badges, and borrower profiles are saved directly to the database.
* **Instant Retrieval:** Frontend requests for user or lender insights hit endpoints that simply return these pre-calculated database records, ensuring zero latency.

### 4.4. AI Chatbot & Recommendation Engine (Groq)

The Intelligence API leverages the Groq API for high-speed inference.

* **Contextual Privacy (RBAC):** The chatbot must only load the actively authenticated user's context. Agents must implement strict sanitization functions to strip all PII (passwords, encrypted strings, NINs) before appending context to the Groq prompt.
* **Structured JSON Outputs:** The recommendation engine feeds available lenders and user profiles into a Groq prompt. Agents must utilize strict system prompts or JSON-mode to guarantee the AI returns a consistently parseable JSON object containing recommended lenders, rationales, and database IDs for frontend rendering.

### 4.5. Manual Disbursement Tracking

For lenders lacking automated APIs:

* **Dashboard Pipeline:** Lenders view assigned applications in a dedicated Finny UI and disburse funds manually via external channels (e.g., mobile money).
* **State Reconciliation:** The system must actively prompt both the user and the lender to log in and confirm state changes (e.g., "Disbursed", "Repaid") to keep Finny's ledger accurate.

---

## 5. API Endpoint Blueprint

Agents must adhere to standard REST conventions, versioning (`/api/v1/`), and consistent JSON response wrappers.

> **Important Extensibility Note:** The platform is **not limited** to the endpoints listed below. As the system scales and new features are required, agents are expected and permitted to add new endpoints. However, any newly created endpoints *must* strictly follow the established conventional structure, routing patterns, and data handling rules outlined in this document.

| Endpoint | Method | Service | Purpose |
| --- | --- | --- | --- |
| `/api/v1/auth/register` | `POST` | Core API | Accepts user data (email primary), hashes password, returns JWT. |
| `/api/v1/auth/login` | `POST` | Core API | Authenticates via email/password, returns JWT. |
| `/api/v1/lenders/onboard` | `POST` | Core API | Accepts lender details, API base URLs, and authentication strategies. |
| `/api/v1/lenders/{id}/schema` | `POST` | Core API | Saves or updates the required/optional payload schema for a specific lender. |
| `/api/v1/lenders/schemas` | `GET` | Core API | Returns mapped schemas for the frontend to dynamically render application forms. |
| `/api/v1/loans/apply` | `POST` | Core API | Accepts dynamic payload, decrypts lender credentials in-memory, maps data, and hits external API. |
| `/api/v1/loans/{id}/status` | `PATCH` | Core API | Manual status override for non-API disbursements (requires RBAC validation). |
| `/api/v1/chat/message` | `POST` | Intelligence | Accepts user prompt, loads sanitized DB context, queries Groq, returns response. |
| `/api/v1/recommendations` | `GET` | Intelligence | Queries DB for active lenders, sends structured prompt to Groq, returns structured JSON list. |
| `/api/v1/insights/users/{id}` | `GET` | Intelligence | Returns pre-computed AI insights, risk assessments, and borrower badges from the DB. |
| `/api/v1/insights/lenders/{id}` | `GET` | Intelligence | Returns pre-computed AI analysis of lender T&Cs, loan friendliness, and limit-growth speed from the DB. |

---

## 6. Agent Execution Standards

* **No Destructive Operations:** Never generate migrations that drop tables or columns without explicit user authorization.
* **Type Safety:** Maintain strict TypeScript interfaces in the frontend that perfectly mirror backend JSON responses. If you update an endpoint, you must update the corresponding frontend type.


* **Environment Variables:** Generate `.env.example` files containing clear placeholder keys. The Groq API key (`GROQ_API_KEY`) must strictly reside in the Intelligence API environment and never touch the frontend.
