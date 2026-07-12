import os


class Config:
    MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
    MAX_TOKENS = 1024
    MAX_HISTORY_TURNS = int(os.environ.get("MAX_HISTORY_TURNS", "6"))
    MAX_TOOL_ITERATIONS = 5
