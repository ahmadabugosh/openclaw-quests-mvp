import { NextResponse } from "next/server";
import { cookieOptions } from "@/lib/auth";
import { createSession, findOrCreateGithubUser } from "@/lib/auth-db";
import { serverDb } from "@/lib/server-db";
import { pushUserLogin } from "@/lib/loops";

type GithubTokenResponse = { access_token?: string };
type GithubUser = { id: number; login: string; email: string | null };

function readCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  for (const chunk of cookieHeader.split(";")) {
    const [key, ...value] = chunk.trim().split("=");
    if (key === name) return value.join("=");
  }
  return null;
}

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = process.env.GITHUB_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: "GitHub OAuth not configured" }, { status: 501 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stateCookie = readCookie(request.headers.get("cookie"), "ocq_oauth_state");

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return NextResponse.json({ error: "Invalid OAuth state" }, { status: 400 });
  }

  const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: redirectUri }),
  });

  const tokenData = (await tokenResp.json()) as GithubTokenResponse;
  if (!tokenData.access_token) {
    return NextResponse.json({ error: "Failed to obtain GitHub access token" }, { status: 401 });
  }

  const userResp = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "openclaw-quests-mvp",
    },
  });

  const ghUser = (await userResp.json()) as GithubUser;
  if (!ghUser?.id || !ghUser.login) {
    return NextResponse.json({ error: "Failed to fetch GitHub user" }, { status: 401 });
  }

  const email = ghUser.email ?? `${ghUser.login}@users.noreply.github.com`;
  const user = findOrCreateGithubUser(serverDb, String(ghUser.id), email, ghUser.login);
  const session = createSession(serverDb, user.id);
  pushUserLogin(email, "github").catch(() => {});

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.headers.append("Set-Cookie", `ocq_session=${session.token}; ${cookieOptions(session.expiresAt)}`);
  response.headers.append(
    "Set-Cookie",
    "ocq_oauth_state=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  );
  return response;
}
