"""
server.py

This is the ONLY file that needs to make sense to your teammates.
Everything else is internal detail. The contract is simple:

  POST /chat
  body: { message: str, conversationHistory: list, userProfile?: dict }
  response: { reply: str, action: { type: str|None, payload: dict } }

Run standalone with: pip install -r requirements.txt && python -m app.server
Test with: curl (see README) or open http://localhost:3001 in a browser.
"""

import os

from dotenv import load_dotenv

load_dotenv()

from app.config import Config
from app.groq_client import call_chat_model
from app.mock_data import MOCK_PROFILES
from app.system_prompt import build_system_prompt
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder="../static", static_url_path="")
CORS(app)


@app.route("/")
def index():
    # Serves the standalone test UI at http://localhost:3001
    return send_from_directory(app.static_folder, "index.html")


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "model": Config.MODEL})


@app.route("/api/mock-profiles")
def mock_profiles():
    # Convenience endpoint for the standalone test UI — lets you switch
    # between mock user profiles from the browser without a real auth
    # system.
    return jsonify(MOCK_PROFILES)


@app.route("/chat", methods=["POST"])
def chat():
    body = request.get_json(silent=True) or {}
    message = body.get("message")
    conversation_history = body.get("conversationHistory", [])
    user_profile = body.get("userProfile", {}) or {}

    if not message or not isinstance(message, str):
        return jsonify({"error": "message (string) is required"}), 400

    try:
        # Only send the last N turns to control token cost/latency as a
        # conversation grows — see Config.MAX_HISTORY_TURNS.
        trimmed_history = conversation_history[-Config.MAX_HISTORY_TURNS :]
        messages = [*trimmed_history, {"role": "user", "content": message}]

        system_prompt = build_system_prompt(user_profile)

        # context is separate from the message history — it carries
        # request-scoped info (like userId) that TOOLS need in order to
        # look up this specific user's applications, without the model
        # itself having to know or supply the id.
        result = call_chat_model(
            system_prompt, messages, context={"userId": user_profile.get("userId")}
        )

        return jsonify(result)
    except Exception as err:  # noqa: BLE001 - deliberate broad catch at the API boundary
        print(f"Chat endpoint error: {err}")
        return jsonify(
            {
                "reply": "Sorry, something went wrong on our side. Please try again in a moment.",
                "action": {"type": None, "payload": {}},
                "error": True,
            }
        ), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3001))
    print(f"Chatbot server running standalone on http://localhost:{port}")
    print("Open the browser to test, or hit /api/chat directly with curl.")
    app.run(host="0.0.0.0", port=port, debug=True)
