import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "@/lib/users";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ errors: ["Data tidak valid."] }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const password = body.password || "";
  const passwordConfirm = body.passwordConfirm || "";

  const errors = [];
  if (name.length < 2) errors.push("Nama minimal 2 karakter.");
  if (!EMAIL_RE.test(email)) errors.push("Format email tidak valid.");
  if (password.length < 8) errors.push("Kata sandi minimal 8 karakter.");
  if (password !== passwordConfirm) errors.push("Konfirmasi kata sandi tidak cocok.");

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  if (getUserByEmail(email)) {
    return NextResponse.json({ errors: ["Email sudah terdaftar."] }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  createUser({ name, email, passwordHash });

  return NextResponse.json({ ok: true });
}
