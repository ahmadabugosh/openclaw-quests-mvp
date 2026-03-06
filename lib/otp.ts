// In-memory OTP store (Railway restarts clear this, which is fine for OTPs)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(email: string, code: string): void {
  otpStore.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 min expiry
  });
}

export function verifyOTP(email: string, code: string): boolean {
  const entry = otpStore.get(email.toLowerCase());
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return false;
  }
  if (entry.code !== code) return false;
  otpStore.delete(email.toLowerCase());
  return true;
}

export async function sendOTPEmail(email: string, code: string): Promise<boolean> {
  const apiKey = process.env.LOOPS_API_KEY;
  const templateId = process.env.LOOPS_TRANSACTIONAL_ID;

  if (!apiKey || !templateId) {
    console.error("Missing LOOPS_API_KEY or LOOPS_TRANSACTIONAL_ID");
    return false;
  }

  try {
    const res = await fetch("https://app.loops.so/api/v1/transactional", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        transactionalId: templateId,
        addToAudience: true,
        dataVariables: {
          otp_code: code,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Loops API error:", res.status, text);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Loops send error:", err);
    return false;
  }
}
