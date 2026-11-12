import { NextResponse } from "next/server";
import {
  checkLoginLimit,
  clearLoginLimit,
  createAdminSession,
  findAdmin,
  getDummyPasswordHash,
  isSameOriginRequest,
  recordFailedLogin,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Permintaan login tidak valid." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 2048) {
    return NextResponse.json({ error: "Permintaan terlalu besar." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const { username, password } = body as { username?: unknown; password?: unknown };
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username.trim().length < 1 ||
    username.length > 64 ||
    password.length < 1 ||
    password.length > 128
  ) {
    return NextResponse.json({ error: "Username atau password salah." }, { status: 400 });
  }

  const clientAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const limit = checkLoginLimit(clientAddress);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan login. Coba lagi setelah 15 menit." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const admin = findAdmin(username.trim());
  const passwordMatches = verifyAdminPassword(password, admin?.password_hash ?? getDummyPasswordHash());

  if (!admin || !passwordMatches) {
    recordFailedLogin(limit.keyHash);
    return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
  }

  clearLoginLimit(limit.keyHash);
  await createAdminSession(admin.id);

  return NextResponse.json({ redirectTo: "/admin" }, { headers: { "Cache-Control": "no-store" } });
}
