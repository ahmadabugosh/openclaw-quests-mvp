import Link from "next/link";
import { AnalyticsTracker } from "@/app/components/analytics-tracker";
import { ClawCreature } from "@/app/components/claw-creature";
import { generateCreature } from "@/lib/creature";
import { getHatchAnimationPhase } from "@/lib/hatching";

export default function HatchPage() {
  const completedCount = 10;
  const phase = getHatchAnimationPhase(completedCount);
  const creature = generateCreature({
    channelType: "telegram",
    firstCronType: "time",
    soulTone: "cheerful",
    seed: "demo-user",
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <AnalyticsTracker eventType="hatch_completed" path="/hatch" />
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Quest Milestone Unlocked</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">🥚 HATCHED! 🦞</h1>
        <p className="mt-3 text-slate-300">
          You crossed the 10/12 minimum. Your egg is cracking open and your OpenClaw creature is now alive.
        </p>

        <div className="relative mx-auto mt-10 grid h-80 w-80 place-items-center">
          <div className={`hatch-egg absolute text-8xl ${phase !== "pre-hatch" ? "hatch-egg--burst" : ""}`}>🥚</div>
          <div className={`hatch-creature absolute ${phase === "hatched" ? "hatch-creature--visible" : ""}`}>
            <ClawCreature traits={creature} className="h-72 w-72" />
          </div>
          <div className="hatch-glow" aria-hidden />
        </div>

        <div className="mt-10 rounded-xl border border-cyan-500/40 bg-slate-900/70 p-5 text-left">
          <h2 className="text-lg font-semibold">What you unlocked</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-300">
            <li>Operator Level 1 status</li>
            <li>Unique baby claw traits generated from your setup</li>
            <li>Public profile and shareable badge next</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/u/demo" className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-900 hover:bg-cyan-300">
            View Public Profile
          </Link>
          <Link href="/dashboard" className="rounded-full border border-slate-600 px-6 py-3 font-semibold text-slate-200 hover:border-slate-400">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
