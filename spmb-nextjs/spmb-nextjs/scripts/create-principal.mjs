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
    throw new Error("Jalankan perintah ini langsung di terminal interaktif agar kata sandi tidak terlihat.");
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

const identifier = (await ask("NIP atau email sekolah kepala sekolah: ")).trim();
if (!identifier || identifier.length > 128) {
  throw new Error("NIP/email wajib diisi dan maksimal 128 karakter.");
}

const password = await askHidden("Kata sandi (minimal 12 karakter): ");
if (process.exitCode === 130) process.exit(130);
if (password.length < 12 || password.length > 128) {
  throw new Error("Kata sandi harus memiliki 12 hingga 128 karakter.");
}

const confirmation = await askHidden("Ulangi kata sandi: ");
if (process.exitCode === 130) process.exit(130);
if (password !== confirmation) {
  throw new Error("Kata sandi tidak sama.");
}

const databasePath = resolve(process.env.SPMB_DB_PATH || "data/spmb.sqlite");
mkdirSync(dirname(databasePath), { recursive: true });
const database = new DatabaseSync(databasePath);

try {
  database.exec(`
    CREATE TABLE IF NOT EXISTS school_principals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      identifier TEXT NOT NULL COLLATE NOCASE UNIQUE,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);

  const salt = randomBytes(16);
  const passwordHash = `scrypt$${salt.toString("base64url")}$${scryptSync(password, salt, 64).toString("base64url")}`;
  database.prepare("INSERT INTO school_principals (identifier, password_hash, created_at) VALUES (?, ?, ?)")
    .run(identifier, passwordHash, Date.now());
  console.log(`Akun kepala sekolah "${identifier}" berhasil dibuat di ${databasePath}.`);
} finally {
  database.close();
}
