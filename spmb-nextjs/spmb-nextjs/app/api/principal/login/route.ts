import { NextResponse } from "next/server";
import {
  checkLoginLimit,
  clearLoginLimit,
  createPrincipalSession,
  findPrincipal,
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

  if (Number(request.headers.get("content-length") || 0) > 2048) {
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

  const { identifier, password, remember } = body as {
    identifier?: unknown;
    password?: unknown;
    remember?: unknown;
  };
  if (
    typeof identifier !== "string" ||
    typeof password !== "string" ||
    identifier.trim().length < 1 ||
    identifier.length > 128 ||
    password.length < 1 ||
    password.length > 128 ||
    (remember !== undefined && typeof remember !== "boolean")
  ) {
    return NextResponse.json({ error: "NIP/email atau kata sandi salah." }, { status: 400 });
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

  const principal = findPrincipal(identifier.trim());
  const passwordMatches = verifyAdminPassword(password, principal?.password_hash ?? getDummyPasswordHash());

  if (!principal || !passwordMatches) {
    recordFailedLogin(limit.keyHash);
    return NextResponse.json({ error: "NIP/email atau kata sandi salah." }, { status: 401 });
  }

  clearLoginLimit(limit.keyHash);
  await createPrincipalSession(principal.id, remember === true);

  return NextResponse.json({ redirectTo: "/kepala-sekolah" }, { headers: { "Cache-Control": "no-store" } });
}
