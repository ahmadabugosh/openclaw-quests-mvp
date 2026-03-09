import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/otp";
import { getUserByEmail, createSession } from "@/lib/auth-pg";
import { pool } from "@/lib/postgres-db";
import { createHash, randomBytes } from "node:crypto";
import { pushUserLogin, pushUserSignup } from "@/lib/loops";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code required" }, { status: 400 });
    }

    const valid = verifyOTP(email, code);
    if (!valid) {
      return NextResponse.json({ error: "Invalid or expired code. Please try again." }, { status: 400 });
    }

    const emailLower = email.toLowerCase();

    // Find or create user
    let user = await getUserByEmail(emailLower);
    const isNewUser = !user;

    if (!user) {
      // Create user with a generated username
      const username = emailLower.split("@")[0] + "-" + randomBytes(3).toString("hex");
      const instanceId = randomBytes(12).toString("hex");
      const instanceSecretHash = createHash("sha256").update(randomBytes(24)).digest("hex");

      const result = await pool.query(
        `INSERT INTO users (email, username, instance_id, instance_secret_hash)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [emailLower, username, instanceId, instanceSecretHash]
      );

      user = await getUserByEmail(emailLower);
    }

    // Push to Loops.so
    if (isNewUser) {
      pushUserSignup(emailLower, emailLower.split("@")[0], "otp").catch(() => {});
    } else {
      pushUserLogin(emailLower, "otp").catch(() => {});
    }

    // Create session
    const session = await createSession(user!.id);

    const response = NextResponse.json({ success: true });

    // Set proper session cookie
    response.cookies.set("ocq_session", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 14, // 14 days
      path: "/",
    });

    // Also keep quest_email for backward compatibility
    response.cookies.set("quest_email", emailLower, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("OTP verify error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
