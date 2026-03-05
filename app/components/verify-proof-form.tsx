"use client";

import { useState } from "react";

type VerifyResult = {
  progress?: {
    completedQuestIds: number[];
    completedCount: number;
    hatchReady: boolean;
  };
  error?: string;
};

export function VerifyProofForm() {
  const [proofCode, setProofCode] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  async function onVerify() {
    setIsVerifying(true);
    setResult(null);

    try {
      const response = await fetch("/api/verify-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proofCode }),
      });

      const data = (await response.json()) as VerifyResult;

      if (!response.ok) {
        setResult({ error: data.error ?? "Verification failed. Please try again." });
        return;
      }

      setResult(data);
    } catch {
      setResult({ error: "Network error while verifying. Check your connection and retry." });
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className="mt-6 rounded-lg border border-slate-700 p-4">
      <label className="mb-2 block text-sm text-slate-300" htmlFor="proof-code">
        Paste your proof code to verify:
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="proof-code"
          placeholder="ocq://..."
          value={proofCode}
          onChange={(event) => setProofCode(event.target.value)}
          className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2"
        />
        <button
          disabled={isVerifying || proofCode.trim().length === 0}
          onClick={onVerify}
          className="rounded-md bg-cyan-400 px-4 py-2 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-600"
        >
          {isVerifying ? "Verifying..." : "✓ Verify"}
        </button>
      </div>

      {result?.error && <p className="mt-3 text-sm text-rose-300">{result.error}</p>}

      {result?.progress && (
        <p className="mt-3 text-sm text-emerald-300">
          Verified! {result.progress.completedCount}/12 tasks complete
          {result.progress.hatchReady ? " — your egg is ready to hatch!" : "."}
        </p>
      )}
    </div>
  );
}
