"""
Modul database untuk aplikasi login "Akar".
Menggunakan SQLite bawaan Python (tidak perlu server database terpisah).
"""
import sqlite3
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "instance", "akar.db")


def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    """Membuat tabel users jika belum ada."""
    conn = get_db()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL,
            last_login_at TEXT
        )
        """
    )
    conn.commit()
    conn.close()


def create_user(name: str, email: str, password_hash: str):
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
            (name, email.lower().strip(), password_hash, datetime.utcnow().isoformat()),
        )
        conn.commit()
        return True, None
    except sqlite3.IntegrityError:
        return False, "Email sudah terdaftar."
    finally:
        conn.close()


def find_user_by_email(email: str):
    conn = get_db()
    row = conn.execute(
        "SELECT * FROM users WHERE email = ?", (email.lower().strip(),)
    ).fetchone()
    conn.close()
    return row


def find_user_by_id(user_id: int):
    conn = get_db()
    row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return row


def touch_last_login(user_id: int):
    conn = get_db()
    conn.execute(
        "UPDATE users SET last_login_at = ? WHERE id = ?",
        (datetime.utcnow().isoformat(), user_id),
    )
    conn.commit()
    conn.close()


def count_users():
    conn = get_db()
    n = conn.execute("SELECT COUNT(*) AS n FROM users").fetchone()["n"]
    conn.close()
    return n
