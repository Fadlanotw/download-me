import { randomBytes, scryptSync } from "node:crypto";
import { mkdirSync } from "node:fs";
import { createInterface, emitKeypressEvents } from "node:readline";
import { DatabaseSync } from "node:sqlite";
import { dirname, resolve } from "node:path";

function ask(question) {
  const readline = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolveAnswer) => {
    readline.question(question, (answer) => {
      readline.close();
      resolveAnswer(answer);
    });
  });
}

function askHidden(question) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    throw new Error("Jalankan perintah ini langsung di terminal interaktif agar password tidak terlihat.");
  }

  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdout.write(question);

  return new Promise((resolveAnswer) => {
    let answer = "";

    function finish() {
      process.stdin.off("keypress", onKeyPress);
      process.stdin.setRawMode(false);
      process.stdout.write("\n");
      resolveAnswer(answer);
    }

    function onKeyPress(character, key) {
      if (key?.ctrl && key.name === "c") {
        process.stdin.off("keypress", onKeyPress);
        process.stdin.setRawMode(false);
        process.stdout.write("\n");
        process.exitCode = 130;
        resolveAnswer("");
        return;
      }
      if (key?.name === "return" || key?.name === "enter") {
        finish();
        return;
      }
      if (key?.name === "backspace") {
        answer = answer.slice(0, -1);
        return;
      }
      if (character && !key?.ctrl && !key?.meta && character >= " ") {
        answer += character;
      }
    }

    process.stdin.on("keypress", onKeyPress);
    process.stdin.resume();
  });
}

const username = (await ask("Username admin: ")).trim();
if (!username || username.length > 64) {
  throw new Error("Username wajib diisi dan maksimal 64 karakter.");
}

const password = await askHidden("Password admin (minimal 12 karakter): ");
if (process.exitCode === 130) process.exit(130);
if (password.length < 12 || password.length > 128) {
  throw new Error("Password harus memiliki 12 hingga 128 karakter.");
}

const confirmation = await askHidden("Ulangi password: ");
if (process.exitCode === 130) process.exit(130);
if (password !== confirmation) {
  throw new Error("Password tidak sama.");
}

const databasePath = resolve(process.env.SPMB_DB_PATH || "data/spmb.sqlite");
mkdirSync(dirname(databasePath), { recursive: true });
const database = new DatabaseSync(databasePath);

try {
  database.exec(`
    CREATE TABLE IF NOT EXISTS administrators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL COLLATE NOCASE UNIQUE,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);

  const salt = randomBytes(16);
  const passwordHash = `scrypt$${salt.toString("base64url")}$${scryptSync(password, salt, 64).toString("base64url")}`;
  database.prepare("INSERT INTO administrators (username, password_hash, created_at) VALUES (?, ?, ?)")
    .run(username, passwordHash, Date.now());
  console.log(`Akun admin "${username}" berhasil dibuat di ${databasePath}.`);
} finally {
  database.close();
}
