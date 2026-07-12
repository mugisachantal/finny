"""
groq_client.py

Why isolate this in its own file: it's the ONLY place that talks to the
Groq API. That means (a) you can unit-test everything else without a
real API key by swapping this module for a mock, and (b) if you ever
need to change providers/models, this is the one file that changes.

It also owns the "the model must return valid JSON" contract: it tries
to parse the final response, and if the model ever slips and returns
something that isn't clean JSON (rare, but happens), we fail gracefully
instead of crashing the whole request.

TOOL USE LOOP: Groq's API is OpenAI-compatible, which shapes tool use
differently from Anthropic's API:
  - Tools are declared via the `tools` param, same each call.
  - When the model wants to call a tool, `finish_reason` comes back as
    "tool_calls" and `message.tool_calls` holds one or more calls, each
    with an id, a function name, and a JSON string of arguments.
  - You respond by appending the assistant's tool-call message AS-IS,
    then one message per tool call with role="tool", tool_call_id set,
    and the tool's result as the content.
  - Call again; repeat until finish_reason is no longer "tool_calls".
This mirrors the Node/Anthropic version's loop, just shaped for the
OpenAI-style function-calling contract Groq uses.
"""

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
    """
    :param system_prompt: full system prompt from system_prompt.py
    :param messages: list of {"role": "user"|"assistant", "content": str}
    :param context: request-scoped data tools need (e.g. userId)
    :return: {"reply": str, "action": {"type": str|None, "payload": dict}}
    """
    context = context or {}
    client = _get_client()
    if not client:
        return {
            "reply": "I can help explain loan costs, complaints, and fraud warnings in plain language. Ask about affordability, rights, or safety.",
            "action": {"type": None, "payload": {}},
        }

    # Groq/OpenAI-style APIs put the system prompt INSIDE the messages
    # list (unlike Anthropic, which takes it as a separate `system`
    # param) — this is the main structural difference from the Node
    # version's claudeClient.js.
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
            # Record the assistant's tool-call turn exactly as returned,
            # then execute every tool it asked for.
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

            continue  # loop again — model now has the tool results

        # finish_reason is something other than "tool_calls" -> this is
        # the model's final answer. Parse it per our reply/action
        # JSON contract.
        return _parse_model_json(message.content or "")

    # Safety valve: should only trigger if something is genuinely wrong
    # (e.g. a tool description is confusing the model into looping).
    return {
        "reply": "I'm having trouble pulling together an answer right now — could you try rephrasing your question?",
        "action": {"type": None, "payload": {}},
    }


def _parse_model_json(raw_text: str) -> dict:
    # The model is instructed to return ONLY JSON, but models
    # occasionally wrap it in a markdown code fence anyway. Strip that
    # defensively before parsing rather than trusting the instruction
    # blindly.
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
    except json.JSONDecodeError as err:
        # Fallback: if parsing fails, still show the user SOMETHING
        # instead of a hard error. Deliberate "fail soft" choice — a
        # slightly malformed but readable reply beats a broken chat.
        print(f"Failed to parse model JSON, falling back to raw text: {err}")
        return {
            "reply": cleaned,
            "action": {"type": None, "payload": {}},
        }
