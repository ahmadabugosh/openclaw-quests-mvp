import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "GitHub OAuth not configured. Set GITHUB_CLIENT_ID and GITHUB_REDIRECT_URI." },
      { status: 501 },
    );
  }

  const state = randomBytes(12).toString("hex");
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "read:user user:email");
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url);
  response.headers.append("Set-Cookie", `ocq_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax`);
  return response;
}
