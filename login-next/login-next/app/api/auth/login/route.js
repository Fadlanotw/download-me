import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail, touchLastLogin } from "@/lib/users";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const email = (body.email || "").trim();
  const password = body.password || "";

  const user = getUserByEmail(email);
  const valid = user ? await bcrypt.compare(password, user.password_hash) : false;

  if (!user || !valid) {
    return NextResponse.json(
      { error: "Email atau kata sandi salah." },
      { status: 401 }
    );
  }

  touchLastLogin(user.id);

  const token = await createSessionToken({
    sub: user.id,
    name: user.name,
    email: user.email,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return res;
}
