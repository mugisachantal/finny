from __future__ import annotations

import os

import jwt


class JwtVerificationError(Exception):
    pass


def verify_jwt(token: str) -> dict:
    secret = os.getenv("JWT_SECRET")
    if not secret:
        raise JwtVerificationError("JWT_SECRET not configured.")
    try:
        return jwt.decode(token, secret, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise JwtVerificationError("Token has expired.")
    except jwt.InvalidTokenError as exc:
        raise JwtVerificationError(f"Invalid token: {exc}") from exc
