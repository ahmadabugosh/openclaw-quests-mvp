import Link from "next/link";
import { AuthForm } from "@/app/components/auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto min-h-screen max-w-xl p-6 text-slate-100">
      <h1 className="mb-2 text-3xl font-bold">Sign in</h1>
      <p className="mb-6 text-slate-300">Continue your hatch progress.</p>

      <AuthForm mode="login" />

      <a
        href="/api/auth/github/start"
        className="mt-4 block rounded-md border border-slate-600 px-3 py-2 text-center text-slate-100 hover:bg-slate-800"
      >
        Continue with GitHub
      </a>

      <p className="mt-4 text-sm text-slate-300">
        New here? <Link href="/register" className="text-cyan-300 underline">Create an account</Link>
      </p>
    </main>
  );
}
