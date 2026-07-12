from app.module_connectors import (
    get_lender_info,
    get_loan_recommendations_preview,
    get_user_applications,
)

# Each tool's "description" controls WHEN the model calls it — keep these specific.
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_lender_info",
            "description": (
                "Look up curated, vetted information about a specific named "
                "loan app/lender — licensing status, approval time, and any "
                "known red flags. Use this whenever the user asks about a "
                "specific lender by name, instead of guessing or giving a "
                "generic answer."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "lenderName": {
                        "type": "string",
                        "description": "Name of the loan app/lender, e.g. 'Fido'",
                    }
                },
                "required": ["lenderName"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_user_applications",
            "description": (
                "Get this specific user's own loan application history and "
                "current statuses. Use this when the user asks about an "
                "application they've already submitted (e.g. 'what's "
                "happening with my loan', 'has it been approved yet')."
            ),
            "parameters": {
                "type": "object",
                "properties": {},
                "required": [],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_loan_recommendations_preview",
            "description": (
                "Get a ranked, transparent preview of 1-3 lenders that could "
                "fit a stated loan need (amount required, optionally "
                "purpose/tenure). Each match includes an estimated total "
                "repayment cost, a 0-100 suitability/trust score, and a "
                "'whyRanked' list of plain-language reasons — use those "
                "reasons to explain to the user WHY the top pick is "
                "ranked where it is (e.g. licensing, interest model, total "
                "cost), not just to state a name. The response also "
                "includes a 'comparisonSummary' you can lean on directly. "
                "If tenureDays wasn't given, a 30-day assumption is used "
                "for the estimate — say so plainly rather than presenting "
                "it as exact. Use this to give a helpful, EXPLAINED "
                "conversational preview — but still set action.type to "
                "'show_recommendations' in your final reply so the user "
                "can see the full ranked comparison screen, since that "
                "screen has more thorough scoring than this preview."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "amount": {
                        "type": "number",
                        "description": "Requested loan amount in UGX",
                    },
                    "purpose": {
                        "type": "string",
                        "description": "What the loan is for, if known",
                    },
                    "tenureDays": {
                        "type": "number",
                        "description": "Desired repayment period in days, if known. If not known, ask the user or proceed with a 30-day assumption and say so.",
                    },
                },
                "required": ["amount"],
            },
        },
    },
]


def execute_tool(name: str, args: dict, context: dict | None = None) -> dict | list:
    context = context or {}

    if name == "get_lender_info":
        result = get_lender_info(args.get("lenderName"))
        return result or {
            "found": False,
            "note": "No curated data on this lender yet in our database.",
        }

    if name == "get_user_applications":
        return get_user_applications(context.get("userId"))

    if name == "get_loan_recommendations_preview":
        return get_loan_recommendations_preview(
            amount=args.get("amount"),
            purpose=args.get("purpose"),
            tenureDays=args.get("tenureDays"),
        )

    return {"error": f"Unknown tool: {name}"}
