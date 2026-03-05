import Link from "next/link";
import { AuthForm } from "@/app/components/auth-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto min-h-screen max-w-xl p-6 text-slate-100">
      <h1 className="mb-2 text-3xl font-bold">Create account</h1>
      <p className="mb-6 text-slate-300">Start hatching your OpenClaw creature.</p>

      <AuthForm mode="register" />

      <a
        href="/api/auth/github/start"
        className="mt-4 block rounded-md border border-slate-600 px-3 py-2 text-center text-slate-100 hover:bg-slate-800"
      >
        Sign up with GitHub
      </a>

      <p className="mt-4 text-sm text-slate-300">
        Already have an account? <Link href="/login" className="text-cyan-300 underline">Sign in</Link>
      </p>
    </main>
  );
}
