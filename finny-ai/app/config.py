"""
config.py

Why this file exists on its own: during a hackathon you WILL want to
tweak the model, token limits, or history length multiple times while
testing. Keeping every tunable knob in one small file means you never
have to hunt through server.py to change a number.
"""

import os


class Config:
    # Model choice matters for both speed and quality. Groq's whole pitch
    # is inference speed, so even a 70B model responds fast here.
    #   - llama-3.3-70b-versatile: strong general quality, solid tool-use
    #     support. Good default for this app.
    #   - llama-3.1-8b-instant: much faster/cheaper, fine for simpler
    #     literacy Q&A if you want to cut latency further.
    # Can be overridden via the GROQ_MODEL env var without touching code.
    MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")

    # Hard cap on how long a single reply can be. Keeps cost/latency
    # predictable and stops the model rambling in a chat UI.
    MAX_TOKENS = 1024

    # We do NOT send the entire conversation history on every request —
    # only the last N turns, to control token cost and latency as a
    # conversation grows. The system prompt (rights/fraud knowledge) is
    # always re-sent in full since that's small and constant.
    MAX_HISTORY_TURNS = 6

    # Hard cap on tool-call round-trips per single user message, so a
    # confused model can never loop forever.
    MAX_TOOL_ITERATIONS = 5
