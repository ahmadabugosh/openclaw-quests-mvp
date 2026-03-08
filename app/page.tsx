import Link from "next/link";
import { AnalyticsTracker } from "@/app/components/analytics-tracker";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <AnalyticsTracker path="/" />
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-20 text-center">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Free OpenClaw Course for Beginners</p>
          <h1 className="text-4xl font-bold md:text-6xl flex items-center justify-center gap-3">
            Hatch Your OpenClaw AI agent{" "}
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-14 md:h-14 inline-block">
                <defs>
                  <linearGradient id="eggGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: "#fef3c7", stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: "#fbbf24", stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <ellipse cx="50" cy="55" rx="28" ry="35" fill="url(#eggGradient)" stroke="#f59e0b" strokeWidth="2" />
                <ellipse cx="40" cy="45" rx="8" ry="12" fill="rgba(255,255,255,0.4)" />
              </svg>
              <span className="text-2xl md:text-3xl">→</span>
              <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-14 md:h-14 inline-block">
                <ellipse cx="50" cy="55" rx="22" ry="25" fill="#ff6b6b" />
                <ellipse cx="50" cy="60" rx="18" ry="15" fill="#ff4444" />
                <circle cx="43" cy="45" r="6" fill="white" />
                <circle cx="57" cy="45" r="6" fill="white" />
                <circle cx="44" cy="44" r="3" fill="#1a1a2e" />
                <circle cx="58" cy="44" r="3" fill="#1a1a2e" />
                <circle cx="44.5" cy="43" r="1.5" fill="white" />
                <circle cx="58.5" cy="43" r="1.5" fill="white" />
                <path d="M 45,54 Q 50,58 55,54" fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
                <ellipse cx="30" cy="58" rx="7" ry="5" fill="#ff6b6b" transform="rotate(-30,30,58)" />
                <ellipse cx="70" cy="58" rx="7" ry="5" fill="#ff6b6b" transform="rotate(30,70,58)" />
                <line x1="43" y1="36" x2="35" y2="25" stroke="#ff6b6b" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="57" y1="36" x2="65" y2="25" stroke="#ff6b6b" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="35" cy="25" r="2" fill="#ff4444" />
                <circle cx="65" cy="25" r="2" fill="#ff4444" />
              </svg>
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-slate-300">
            Complete your setup checklist, crack your egg, and unlock your shareable Operator Level 1 badge.
          </p>
        </div>

        <div className="egg-glow grid h-56 w-56 place-items-center rounded-full border border-cyan-300/40 bg-slate-900">
          <div className="egg-float text-8xl">🥚</div>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <Link
            href="/dashboard"
            className="group relative rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 px-10 py-4 text-xl font-bold text-slate-900 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] active:scale-95 shadow-lg shadow-cyan-500/50 animate-pulse hover:animate-none"
          >
            <span className="relative z-10">Start Hatching</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
          </Link>
          <Link
            href="/u/demo"
            className="rounded-full border border-slate-600 px-6 py-2 text-sm font-semibold text-slate-400 transition hover:border-slate-400 hover:text-slate-200"
          >
            View Example Profile
          </Link>
        </div>
      </section>
    </main>
  );
}
