import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { getUserById } from "@/lib/users";

export async function GET() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = getUserById(session.sub);
  return NextResponse.json({ user: user || null });
}
