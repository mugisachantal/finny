import json
import os

from groq import Groq

from app.config import Config
from app.tools import TOOLS, execute_tool

_client = None


def _get_client():
    global _client
    if _client is None:
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            return None
        _client = Groq(api_key=api_key)
    return _client


def call_chat_model(
    system_prompt: str, messages: list[dict], context: dict | None = None
) -> dict:
    context = context or {}
    client = _get_client()
    if not client:
        return {
            "reply": "I can help explain loan costs, complaints, and fraud warnings in plain language. Ask about affordability, rights, or safety.",
            "action": {"type": None, "payload": {}},
        }

    # Groq uses OpenAI-style function calling: system prompt goes inside the messages
    # list as role="system", unlike Anthropic which takes it as a separate param.
    working_messages = [{"role": "system", "content": system_prompt}, *messages]

    for _ in range(Config.MAX_TOOL_ITERATIONS):
        response = client.chat.completions.create(
            model=Config.MODEL,
            max_tokens=Config.MAX_TOKENS,
            messages=working_messages,
            tools=TOOLS,
            tool_choice="auto",
        )

        choice = response.choices[0]
        message = choice.message

        if choice.finish_reason == "tool_calls" and message.tool_calls:
            working_messages.append(message.model_dump())

            for tool_call in message.tool_calls:
                try:
                    args = json.loads(tool_call.function.arguments or "{}")
                except json.JSONDecodeError:
                    args = {}

                result = execute_tool(tool_call.function.name, args, context)

                working_messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "name": tool_call.function.name,
                        "content": json.dumps(result),
                    }
                )
            continue

        return _parse_model_json(message.content or "")

    return {
        "reply": "I'm having trouble pulling together an answer right now — could you try rephrasing your question?",
        "action": {"type": None, "payload": {}},
    }


def _parse_model_json(raw_text: str) -> dict:
    # Strip markdown code fences the model occasionally wraps around JSON despite instructions.
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]
        cleaned = cleaned.strip()

    try:
        parsed = json.loads(cleaned)
        return {
            "reply": parsed.get("reply", cleaned),
            "action": parsed.get("action", {"type": None, "payload": {}}),
        }
    except json.JSONDecodeError:
        return {
            "reply": cleaned,
            "action": {"type": None, "payload": {}},
        }
