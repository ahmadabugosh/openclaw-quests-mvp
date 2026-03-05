"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      username: String(form.get("username") ?? ""),
    };

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Authentication failed");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-6">
      {mode === "register" && (
        <div>
          <label className="mb-1 block text-sm text-slate-300" htmlFor="username">
            Username
          </label>
          <input id="username" name="username" required className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm text-slate-300" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
      </div>

      <div>
        <label className="mb-1 block text-sm text-slate-300" htmlFor="password">
          Password
        </label>
        <input id="password" name="password" type="password" required className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
      </div>

      {error && <p className="text-sm text-rose-300">{error}</p>}

      <button disabled={loading} className="w-full rounded-md bg-cyan-500 px-3 py-2 font-semibold text-slate-950 disabled:opacity-60">
        {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
