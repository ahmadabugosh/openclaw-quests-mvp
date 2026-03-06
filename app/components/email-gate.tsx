"use client";

import { useState } from "react";

interface Props {
  onVerified: (email: string) => void;
}

export function EmailGate({ onVerified }: Props) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendCode() {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send code.");
        return;
      }

      setStep("code");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode() {
    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid code.");
        return;
      }

      localStorage.setItem("openclaw-quests-email", email);
      onVerified(email);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/98 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8">
        <div className="text-center">
          <p className="text-6xl mb-4">🥚</p>
          <h2 className="text-2xl font-bold text-slate-100">Start Your Journey</h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email to begin hatching your AI agent.
          </p>
        </div>

        {step === "email" ? (
          <div className="mt-6">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleSendCode}
              disabled={loading || !email}
              className="mt-3 w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-900 transition-colors hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
            <p className="mt-3 text-center text-xs text-slate-600">
              We&apos;ll send a 6-digit code to verify your email. No spam, ever.
            </p>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-sm text-slate-400 mb-3">
              We sent a code to <span className="text-cyan-300 font-medium">{email}</span>
            </p>
            <label htmlFor="code" className="block text-sm font-medium text-slate-300 mb-1">
              Verification code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
              placeholder="123456"
              className="w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] text-slate-200 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleVerifyCode}
              disabled={loading || code.length !== 6}
              className="mt-3 w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-900 transition-colors hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500"
            >
              {loading ? "Verifying..." : "Verify & Start Quests"}
            </button>
            <button
              onClick={() => { setStep("email"); setCode(""); setError(""); }}
              className="mt-2 w-full text-sm text-slate-500 hover:text-slate-400"
            >
              ← Use a different email
            </button>
          </div>
        )}

        {error && (
          <p className="mt-3 rounded-lg border border-rose-800 bg-rose-950/30 p-2 text-center text-sm text-rose-300">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
