import { NextResponse } from "next/server";
import { cookieOptions } from "@/lib/auth";
import { authenticateEmailUser, createSession } from "@/lib/auth-db";
import { serverDb } from "@/lib/server-db";
import { pushUserLogin } from "@/lib/loops";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!body.email || !body.password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }

  const user = authenticateEmailUser(serverDb, body.email, body.password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const session = createSession(serverDb, user.id);
  if (user.email) pushUserLogin(user.email, "email").catch(() => {});
  const response = NextResponse.json({ ok: true });
  response.headers.append("Set-Cookie", `ocq_session=${session.token}; ${cookieOptions(session.expiresAt)}`);
  return response;
}
