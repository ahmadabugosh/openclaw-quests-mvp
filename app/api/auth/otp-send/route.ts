import { NextRequest, NextResponse } from "next/server";
import { generateOTP, storeOTP, sendOTPEmail } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const code = generateOTP();
    storeOTP(email, code);

    const sent = await sendOTPEmail(email, code);
    if (!sent) {
      return NextResponse.json({ error: "Failed to send verification email. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Code sent to your email" });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
