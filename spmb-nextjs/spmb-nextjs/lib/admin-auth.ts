import "server-only";

import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { cookies } from "next/headers";

const SESSION_COOKIE = "spmb_admin_session";
const PRINCIPAL_SESSION_COOKIE = "spmb_principal_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;
const REMEMBERED_SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30;
const DUMMY_PASSWORD_HASH = `scrypt$${Buffer.from("spmb-login-check-salt").toString("base64url")}$${scryptSync("not-a-real-password", "spmb-login-check-salt", 64).toString("base64url")}`;

type AdminRecord = {
  id: number;
  username: string;
  password_hash: string;
};

type PrincipalRecord = {
  id: number;
  identifier: string;
  password_hash: string;
};

export type AdminUser = {
  id: number;
  username: string;
};

export type PrincipalUser = {
  id: number;
  identifier: string;
};

type SessionRecord = AdminUser & {
  expires_at: number;
};

type PrincipalSessionRecord = PrincipalUser & {
  expires_at: number;
};

const globalForAdmin = globalThis as typeof globalThis & {
  spmbAdminDatabase?: DatabaseSync;
};

function getDatabase() {
  if (globalForAdmin.spmbAdminDatabase) {
    return globalForAdmin.spmbAdminDatabase;
  }

  const databasePath = process.env.SPMB_DB_PATH || join(process.cwd(), "data", "spmb.sqlite");
  mkdirSync(dirname(databasePath), { recursive: true });

  const database = new DatabaseSync(databasePath);
  database.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS administrators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL COLLATE NOCASE UNIQUE,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token_hash TEXT PRIMARY KEY,
      admin_id INTEGER NOT NULL REFERENCES administrators(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS admin_sessions_expiry_idx ON admin_sessions(expires_at);
    CREATE TABLE IF NOT EXISTS admin_login_limits (
      client_hash TEXT PRIMARY KEY,
      failures INTEGER NOT NULL,
      locked_until INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS school_principals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      identifier TEXT NOT NULL COLLATE NOCASE UNIQUE,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS principal_sessions (
      token_hash TEXT PRIMARY KEY,
      principal_id INTEGER NOT NULL REFERENCES school_principals(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS principal_sessions_expiry_idx ON principal_sessions(expires_at);
  `);

  globalForAdmin.spmbAdminDatabase = database;
  return database;
}

export function verifyAdminPassword(password: string, storedHash: string) {
  const [algorithm, saltValue, hashValue] = storedHash.split("$");
  const salt = Buffer.from(saltValue ?? "", "base64url");
  const expected = Buffer.from(hashValue ?? "", "base64url");

  if (algorithm !== "scrypt" || salt.length !== 16 || expected.length !== 64) {
    return false;
  }

  const actual = scryptSync(password, salt, expected.length);
  return timingSafeEqual(actual, expected);
}

export function findAdmin(username: string) {
  return getDatabase()
    .prepare("SELECT id, username, password_hash FROM administrators WHERE username = ?")
    .get(username) as AdminRecord | undefined;
}

export function findPrincipal(identifier: string) {
  return getDatabase()
    .prepare("SELECT id, identifier, password_hash FROM school_principals WHERE identifier = ?")
    .get(identifier) as PrincipalRecord | undefined;
}

export function checkLoginLimit(clientKey: string) {
  const db = getDatabase();
  const keyHash = createHash("sha256").update(clientKey).digest("hex");
  const record = db
    .prepare("SELECT failures, locked_until FROM admin_login_limits WHERE client_hash = ?")
    .get(keyHash) as { failures: number; locked_until: number } | undefined;

  if (!record || record.locked_until <= Date.now()) {
    return { allowed: true, keyHash };
  }

  return { allowed: false, keyHash, retryAfter: Math.ceil((record.locked_until - Date.now()) / 1000) };
}

export function recordFailedLogin(keyHash: string) {
  const db = getDatabase();
  const now = Date.now();
  const previous = db
    .prepare("SELECT failures FROM admin_login_limits WHERE client_hash = ?")
    .get(keyHash) as { failures: number } | undefined;
  const failures = (previous?.failures ?? 0) + 1;
  const lockedUntil = failures >= 5 ? now + 15 * 60 * 1000 : 0;

  db.prepare(`
    INSERT INTO admin_login_limits (client_hash, failures, locked_until)
    VALUES (?, ?, ?)
    ON CONFLICT(client_hash) DO UPDATE SET failures = excluded.failures, locked_until = excluded.locked_until
  `).run(keyHash, failures, lockedUntil);

  db.prepare("DELETE FROM admin_login_limits WHERE locked_until > 0 AND locked_until < ?").run(now);
}

export function clearLoginLimit(keyHash: string) {
  getDatabase().prepare("DELETE FROM admin_login_limits WHERE client_hash = ?").run(keyHash);
}

export function getDummyPasswordHash() {
  return DUMMY_PASSWORD_HASH;
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const originUrl = new URL(origin);
    const host = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() || request.headers.get("host");
    const protocol =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
      new URL(request.url).protocol.slice(0, -1);
    return originUrl.host === host && originUrl.protocol === `${protocol}:`;
  } catch {
    return false;
  }
}

async function createSession(
  table: "admin_sessions" | "principal_sessions",
  foreignKey: "admin_id" | "principal_id",
  cookieName: string,
  userId: number,
  remember = false,
) {
  const db = getDatabase();
  const token = randomBytes(32).toString("base64url");
  const duration = remember ? REMEMBERED_SESSION_DURATION_SECONDS : SESSION_DURATION_SECONDS;
  const expiresAt = Date.now() + duration * 1000;

  db.prepare(`DELETE FROM ${table} WHERE expires_at <= ?`).run(Date.now());
  db.prepare(`INSERT INTO ${table} (token_hash, ${foreignKey}, expires_at) VALUES (?, ?, ?)`)
    .run(createHash("sha256").update(token).digest("hex"), userId, expiresAt);

  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: duration,
  });
}

export async function createAdminSession(adminId: number) {
  await createSession("admin_sessions", "admin_id", SESSION_COOKIE, adminId);
}

export async function createPrincipalSession(principalId: number, remember = false) {
  await createSession("principal_sessions", "principal_id", PRINCIPAL_SESSION_COOKIE, principalId, remember);
}

export async function getAdminSession(): Promise<AdminUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const db = getDatabase();
  const session = db.prepare(`
    SELECT administrators.id, administrators.username, admin_sessions.expires_at
    FROM admin_sessions
    JOIN administrators ON administrators.id = admin_sessions.admin_id
    WHERE admin_sessions.token_hash = ?
  `).get(tokenHash) as SessionRecord | undefined;

  if (!session) return null;
  if (session.expires_at <= Date.now()) {
    db.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(tokenHash);
    return null;
  }

  return { id: session.id, username: session.username };
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    getDatabase()
      .prepare("DELETE FROM admin_sessions WHERE token_hash = ?")
      .run(createHash("sha256").update(token).digest("hex"));
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getPrincipalSession(): Promise<PrincipalUser | null> {
  const token = (await cookies()).get(PRINCIPAL_SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const db = getDatabase();
  const session = db.prepare(`
    SELECT school_principals.id, school_principals.identifier, principal_sessions.expires_at
    FROM principal_sessions
    JOIN school_principals ON school_principals.id = principal_sessions.principal_id
    WHERE principal_sessions.token_hash = ?
  `).get(tokenHash) as PrincipalSessionRecord | undefined;

  if (!session) return null;
  if (session.expires_at <= Date.now()) {
    db.prepare("DELETE FROM principal_sessions WHERE token_hash = ?").run(tokenHash);
    return null;
  }

  return { id: session.id, identifier: session.identifier };
}

export async function destroyPrincipalSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(PRINCIPAL_SESSION_COOKIE)?.value;

  if (token) {
    getDatabase()
      .prepare("DELETE FROM principal_sessions WHERE token_hash = ?")
      .run(createHash("sha256").update(token).digest("hex"));
  }

  cookieStore.delete(PRINCIPAL_SESSION_COOKIE);
}
