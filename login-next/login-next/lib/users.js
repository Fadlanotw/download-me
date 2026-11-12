import db from "./db";

export function createUser({ name, email, passwordHash }) {
  const stmt = db.prepare(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)"
  );
  const info = stmt.run(name, email.toLowerCase().trim(), passwordHash);
  return info.lastInsertRowid;
}

export function getUserByEmail(email) {
  return db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(String(email).toLowerCase().trim());
}

export function getUserById(id) {
  return db
    .prepare(
      "SELECT id, name, email, created_at, last_login_at FROM users WHERE id = ?"
    )
    .get(id);
}

export function touchLastLogin(id) {
  db.prepare(
    "UPDATE users SET last_login_at = datetime('now') WHERE id = ?"
  ).run(id);
}

export function countUsers() {
  return db.prepare("SELECT COUNT(*) AS n FROM users").get().n;
}
