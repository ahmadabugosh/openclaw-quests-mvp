import Link from "next/link";
import { AnalyticsTracker } from "@/app/components/analytics-tracker";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <AnalyticsTracker path="/" />
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-20 text-center">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">OpenClaw Quests MVP</p>
          <h1 className="text-4xl font-bold md:text-6xl">Hatch your AI agent 🥚→🦞</h1>
          <p className="mx-auto max-w-2xl text-slate-300">
            Complete your setup checklist, crack your egg, and unlock your shareable Operator Level 1 badge.
          </p>
        </div>

        <div className="egg-glow grid h-56 w-56 place-items-center rounded-full border border-cyan-300/40 bg-slate-900">
          <div className="egg-float text-8xl">🥚</div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-900 transition hover:bg-cyan-300"
          >
            Start Hatching
          </Link>
          <Link
            href="/u/demo"
            className="rounded-full border border-slate-600 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-400"
          >
            View Example Profile
          </Link>
        </div>
      </section>
    </main>
  );
}
