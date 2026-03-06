"use client";

import { useState, useEffect } from "react";
import { QuestVerify } from "@/app/components/verify-proof-form";
import { AnalyticsTracker } from "@/app/components/analytics-tracker";
import { CrackingEgg } from "@/app/components/cracking-egg";
import { HatchCelebration } from "@/app/components/hatch-celebration";
import { EmailGate } from "@/app/components/email-gate";
import { QUESTS } from "@/lib/quests";
import { getCrackStage, getProgressPercent } from "@/lib/progress";

const STORAGE_KEY = "openclaw-quests-completed";

export default function DashboardPage() {
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [activeQuestId, setActiveQuestId] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasHatched, setHasHatched] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const ids = JSON.parse(saved) as number[];
        setCompletedIds(new Set(ids));
        const firstUncompleted = QUESTS.find((q) => !ids.includes(q.id));
        if (firstUncompleted) setActiveQuestId(firstUncompleted.id);
      }
      const hatched = localStorage.getItem("openclaw-quests-hatched");
      if (hatched) setHasHatched(true);
      const savedEmail = localStorage.getItem("openclaw-quests-email");
      if (savedEmail) setEmailVerified(true);
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (completedIds.size > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedIds]));
    }
  }, [completedIds]);

  const completedCount = completedIds.size;
  const progress = getProgressPercent(completedCount);
  const crackStage = getCrackStage(completedCount);
  const activeQuest = QUESTS.find((q) => q.id === activeQuestId) ?? QUESTS[0];

  function handleComplete(questId: number) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.add(questId);
      return next;
    });
    // Auto-advance to next quest
    const nextQuest = QUESTS.find((q) => q.id > questId && !completedIds.has(q.id));
    if (nextQuest) {
      setTimeout(() => setActiveQuestId(nextQuest.id), 800);
    }
  }

  function handleUncomplete(questId: number) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.delete(questId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  function handleHatch() {
    setShowCelebration(true);
    setHasHatched(true);
    localStorage.setItem("openclaw-quests-hatched", "true");
  }

  const canHatch = completedCount >= 10 && !hasHatched;

  function getQuestState(questId: number) {
    if (completedIds.has(questId)) return "completed";
    if (questId === activeQuestId) return "active";
    return "todo";
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-8">
      <AnalyticsTracker path="/dashboard" />

      {/* Email gate */}
      {!emailVerified && (
        <EmailGate onVerified={() => setEmailVerified(true)} />
      )}

      {/* Celebration overlay */}
      {showCelebration && (
        <HatchCelebration
          agentName=""
          onViewCertificate={() => {
            window.location.href = "/certificate";
          }}
        />
      )}
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-5">
        {/* LEFT PANEL — Egg + Checklist */}
        <aside className="rounded-2xl border border-slate-700 bg-slate-900 p-6 md:col-span-2">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Your Agent</p>
          <div className="mt-4 grid place-items-center rounded-xl border border-slate-700 bg-slate-950 py-6">
            <CrackingEgg stage={crackStage} />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{completedCount}/12 ({progress}%)</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-cyan-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Hatch button */}
          {canHatch && (
            <button
              onClick={handleHatch}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 px-4 py-4 text-lg font-black text-white shadow-lg shadow-amber-500/20 transition-transform hover:scale-105 active:scale-95 animate-pulse"
            >
              🦞 Hatch Your Lobster! 🦞
            </button>
          )}

          {hasHatched && (
            <a
              href="/certificate"
              className="mt-4 block w-full rounded-xl border-2 border-amber-500/50 px-4 py-3 text-center font-bold text-amber-400 transition-colors hover:bg-amber-500/10"
            >
              🏆 View Certificate
            </a>
          )}

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-slate-300">Checklist</p>
            <ul className="space-y-2">
              {QUESTS.map((quest) => {
                const state = getQuestState(quest.id);
                return (
                  <li key={quest.id}>
                    <button
                      onClick={() => setActiveQuestId(quest.id)}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                        state === "active"
                          ? "border-cyan-500 bg-cyan-950/40 text-cyan-100"
                          : state === "completed"
                            ? "border-green-800 bg-green-950/30 text-green-300"
                            : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                    >
                      {state === "completed" && "✅ "}
                      {state === "active" && "→ "}
                      {state === "todo" && "○ "}
                      <span className="text-slate-500 mr-1">{quest.id}.</span>
                      {quest.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* RIGHT PANEL — Active Quest Content */}
        <section className="min-w-0 rounded-2xl border border-slate-700 bg-slate-900 p-6 md:col-span-3">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
            Quest {activeQuest.id} of 12
          </p>
          <h1 className="mt-2 text-3xl font-bold">{activeQuest.title}</h1>
          <p className="mt-2 text-slate-300">{activeQuest.summary}</p>

          {/* Video placeholder */}
          <div className="mt-6 aspect-video overflow-hidden rounded-lg border border-slate-700 bg-slate-800 grid place-items-center">
            <div className="text-center text-slate-500">
              <p className="text-4xl mb-2">🎬</p>
              <p className="text-sm">Video tutorial coming soon</p>
            </div>
          </div>

          {/* Step-by-step guide */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300 mb-3">
              Step-by-Step Guide
            </h2>
            <div className="space-y-3">
              {activeQuest.guide.map((step, i) => (
                <div key={i} className="rounded-lg border border-slate-700 bg-slate-950 p-4 overflow-hidden">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-900 text-xs font-bold text-cyan-300">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-200">{step.title}</p>
                      <p className="mt-1 text-sm text-slate-400 whitespace-pre-line">{step.description}</p>
                      {step.command && (
                        <pre className="mt-2 rounded bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-green-400 overflow-x-auto whitespace-pre-wrap break-words">
                          <code>{step.command}</code>
                        </pre>
                      )}
                      {step.tip && (
                        <p className="mt-2 text-sm text-amber-400/80">💡 {step.tip}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Help links */}
          <div className="mt-6 rounded-lg border border-slate-700 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Resources
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {activeQuest.helpLinks.map((link) => (
                <li key={link.url}>
                  <a
                    className="text-cyan-200 underline hover:text-cyan-100"
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label} →
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quest completion */}
          <QuestVerify
            questId={activeQuest.id}
            isCompleted={completedIds.has(activeQuest.id)}
            onComplete={handleComplete}
            onUncomplete={handleUncomplete}
          />
        </section>
      </div>
    </main>
  );
}
