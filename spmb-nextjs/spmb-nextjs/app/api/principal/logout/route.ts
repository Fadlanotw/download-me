import { NextResponse } from "next/server";
import { destroyPrincipalSession, isSameOriginRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Permintaan logout tidak valid." }, { status: 403 });
  }

  await destroyPrincipalSession();
  return NextResponse.json({ redirectTo: "/kepala-sekolah/login" }, { headers: { "Cache-Control": "no-store" } });
}
