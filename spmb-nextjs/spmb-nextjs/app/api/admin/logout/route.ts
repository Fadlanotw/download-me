import { NextResponse } from "next/server";
import { destroyAdminSession, isSameOriginRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Permintaan logout tidak valid." }, { status: 403 });
  }

  await destroyAdminSession();
  return NextResponse.json({ redirectTo: "/admin/login" }, { headers: { "Cache-Control": "no-store" } });
}
