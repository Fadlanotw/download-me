"""
Akar — aplikasi contoh dengan halaman login & register.
Jalankan dengan: python3 app.py
Lalu buka: http://localhost:5000
"""
import re
import os
from functools import wraps

from flask import (
    Flask, render_template, request, redirect,
    url_for, session, flash, jsonify
)
from werkzeug.security import generate_password_hash, check_password_hash

import database as db

app = Flask(__name__)
app.secret_key = os.environ.get("AKAR_SECRET_KEY", "ganti-dengan-secret-key-acak-di-produksi")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not session.get("user_id"):
            flash("Silakan masuk terlebih dahulu.", "error")
            return redirect(url_for("login"))
        return view(*args, **kwargs)
    return wrapped


@app.route("/")
def index():
    if session.get("user_id"):
        return redirect(url_for("dashboard"))
    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if session.get("user_id"):
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")

        user = db.find_user_by_email(email)
        if user and check_password_hash(user["password_hash"], password):
            session["user_id"] = user["id"]
            session["user_name"] = user["name"]
            db.touch_last_login(user["id"])
            return redirect(url_for("dashboard"))

        flash("Email atau kata sandi salah.", "error")
        return redirect(url_for("login"))

    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if session.get("user_id"):
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        password_confirm = request.form.get("password_confirm", "")

        errors = []
        if len(name) < 2:
            errors.append("Nama minimal 2 karakter.")
        if not EMAIL_RE.match(email):
            errors.append("Format email tidak valid.")
        if len(password) < 8:
            errors.append("Kata sandi minimal 8 karakter.")
        if password != password_confirm:
            errors.append("Konfirmasi kata sandi tidak cocok.")

        if errors:
            for e in errors:
                flash(e, "error")
            return redirect(url_for("register"))

        password_hash = generate_password_hash(password)
        ok, err = db.create_user(name, email, password_hash)
        if not ok:
            flash(err, "error")
            return redirect(url_for("register"))

        flash("Akun berhasil dibuat. Silakan masuk.", "success")
        return redirect(url_for("login"))

    return render_template("register.html")


@app.route("/dashboard")
@login_required
def dashboard():
    user = db.find_user_by_id(session["user_id"])
    return render_template("dashboard.html", user=user, total_users=db.count_users())


@app.route("/logout")
def logout():
    session.clear()
    flash("Kamu telah keluar.", "success")
    return redirect(url_for("login"))


if __name__ == "__main__":
    db.init_db()
    app.run(debug=True, host="0.0.0.0", port=5000)
