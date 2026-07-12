from __future__ import annotations

import os
from contextlib import contextmanager
from typing import Generator

import psycopg2
import psycopg2.extras

_DSN = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/finny")
_SCHEMA = os.getenv("DB_SCHEMA", "intelligence")


@contextmanager
def get_connection() -> Generator[psycopg2.extensions.connection, None, None]:
    conn = psycopg2.connect(_DSN, options=f"-c search_path={_SCHEMA}")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
