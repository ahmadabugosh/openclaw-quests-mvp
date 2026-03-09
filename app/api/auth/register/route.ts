import { NextResponse } from "next/server";
import { cookieOptions } from "@/lib/auth";
import { createEmailUser, createSession } from "@/lib/auth-db";
import { serverDb } from "@/lib/server-db";
import { pushUserSignup } from "@/lib/loops";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    username?: string;
    password?: string;
  };

  if (!body.email || !body.username || !body.password) {
    return NextResponse.json({ error: "email, username and password are required" }, { status: 400 });
  }

  try {
    const userId = createEmailUser(serverDb, body.email, body.username, body.password);
    const session = createSession(serverDb, userId);
    pushUserSignup(body.email, body.username, "email").catch(() => {});

    const response = NextResponse.json({ ok: true });
    response.headers.append("Set-Cookie", `ocq_session=${session.token}; ${cookieOptions(session.expiresAt)}`);
    return response;
  } catch {
    return NextResponse.json({ error: "Could not register user" }, { status: 400 });
  }
}
