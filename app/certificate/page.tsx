"use client";

import { useEffect, useState, useRef } from "react";

const STORAGE_KEY = "openclaw-quests-completed";
const NAME_KEY = "openclaw-quests-name";

export default function CertificatePage() {
  const [completedCount, setCompletedCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const ids = JSON.parse(saved) as number[];
        setCompletedCount(ids.length);
      }
      const name = localStorage.getItem(NAME_KEY);
      if (name) {
        setUserName(name);
      } else {
        setIsEditing(true);
      }
    } catch {
      // ignore
    }
  }, []);

  function saveName() {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      localStorage.setItem(NAME_KEY, nameInput.trim());
      setIsEditing(false);
    }
  }

  const hatchDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isHatched = completedCount >= 10;

  if (!isHatched) {
    return (
      <main className="min-h-screen bg-slate-950 grid place-items-center p-8 text-slate-100">
        <div className="text-center">
          <p className="text-6xl mb-4">🥚</p>
          <h1 className="text-2xl font-bold">Not yet!</h1>
          <p className="mt-2 text-slate-400">Complete at least 10 of 12 quests to earn your certificate.</p>
          <p className="mt-1 text-slate-500">You&apos;ve completed {completedCount}/12 so far.</p>
          <a href="/dashboard" className="mt-4 inline-block text-cyan-400 underline hover:text-cyan-300">
            ← Back to quests
          </a>
        </div>
      </main>
    );
  }

  if (isEditing || !userName) {
    return (
      <main className="min-h-screen bg-slate-950 grid place-items-center p-8 text-slate-100">
        <div className="text-center max-w-md">
          <p className="text-6xl mb-4">🏆</p>
          <h1 className="text-2xl font-bold">Enter Your Name</h1>
          <p className="mt-2 text-slate-400">This will appear on your certificate.</p>
          <div className="mt-6 flex gap-2">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              placeholder="Your full name"
              className="flex-1 rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-center text-lg focus:border-cyan-500 focus:outline-none"
              autoFocus
            />
            <button
              onClick={saveName}
              disabled={!nameInput.trim()}
              className="rounded-lg bg-cyan-500 px-6 py-3 font-bold text-slate-900 disabled:bg-slate-700"
            >
              Continue
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <a href="/dashboard" className="text-sm text-cyan-400 underline hover:text-cyan-300">
            ← Back to quests
          </a>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-400 hover:text-slate-300"
            >
              Edit name
            </button>
            <button
              onClick={() => {
                const text = `🦞 I just earned my OpenClaw Operator certificate!\n\n12 quests. From zero to a fully autonomous AI agent.\n\n@OpenClaw #AIAgents`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
              }}
              className="rounded-lg bg-cyan-500 px-4 py-1.5 text-sm font-semibold text-slate-900"
            >
              Share on 𝕏
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div ref={certRef} className="relative overflow-hidden rounded-2xl border-4 border-amber-500/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12 shadow-2xl">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-amber-500/30 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-amber-500/30 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-amber-500/30 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-amber-500/30 rounded-br-2xl" />

          {/* Inner decorative border */}
          <div className="border-2 border-amber-500/20 rounded-xl p-6 md:p-10">
            <div className="text-center">
              {/* Logo */}
              <div className="flex justify-center mb-2">
                <svg viewBox="0 0 240 180" width="120" height="90">
                  <ellipse cx="120" cy="95" rx="40" ry="45" fill="#ff6b6b" />
                  <ellipse cx="120" cy="105" rx="34" ry="28" fill="#ff4444" />
                  <circle cx="108" cy="82" r="10" fill="white" />
                  <circle cx="132" cy="82" r="10" fill="white" />
                  <circle cx="110" cy="80" r="5" fill="#1a1a2e" />
                  <circle cx="134" cy="80" r="5" fill="#1a1a2e" />
                  <circle cx="111" cy="78" r="2" fill="white" />
                  <circle cx="135" cy="78" r="2" fill="white" />
                  <path d="M 110,100 Q 120,112 130,100" fill="none" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" />
                  <ellipse cx="72" cy="90" rx="14" ry="9" fill="#ff6b6b" transform="rotate(-40,72,90)" />
                  <ellipse cx="168" cy="90" rx="14" ry="9" fill="#ff6b6b" transform="rotate(40,168,90)" />
                  <line x1="105" y1="65" x2="88" y2="45" stroke="#ff6b6b" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="135" y1="65" x2="152" y2="45" stroke="#ff6b6b" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="88" cy="45" r="3.5" fill="#ff4444" />
                  <circle cx="152" cy="45" r="3.5" fill="#ff4444" />
                </svg>
              </div>

              <p className="text-sm uppercase tracking-[0.3em] text-amber-400/70">Certificate of Completion</p>

              <h1 className="mt-4 text-lg uppercase tracking-[0.2em] text-slate-400">
                OpenClaw Quests
              </h1>

              <div className="mt-6 mb-2">
                <p className="text-sm text-slate-500">This certifies that</p>
                <h2 className="mt-2 text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-amber-200 to-cyan-300">
                  {userName}
                </h2>
              </div>

              <p className="mt-4 text-slate-400 max-w-md mx-auto">
                has successfully completed all challenges and hatched their AI agent, demonstrating proficiency in:
              </p>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2 max-w-lg mx-auto text-sm">
                {[
                  "Terminal & SSH",
                  "VPS Management",
                  "AI Model Config",
                  "OpenClaw Setup",
                  "Chat Integration",
                  "Agent Memory",
                  "Task Automation",
                  "Web Search & Skills",
                  "Social Media APIs",
                  "Server Security",
                  "Dashboard Ops",
                  "Full Deployment",
                ].map((skill) => (
                  <div key={skill} className="rounded-lg border border-slate-700 bg-slate-800/50 px-2 py-1.5 text-slate-300">
                    ✦ {skill}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-500">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-600">Date</p>
                  <p className="mt-1 text-slate-400">{hatchDate}</p>
                </div>
                <div className="h-12 w-px bg-slate-700" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-600">Quests Completed</p>
                  <p className="mt-1 text-slate-400">{completedCount} / 12</p>
                </div>
                <div className="h-12 w-px bg-slate-700" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-600">Level</p>
                  <p className="mt-1 text-amber-400 font-semibold">Operator 🦞</p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs text-slate-600 italic">
                  &quot;From egg to operator — one quest at a time.&quot;
                </p>
                <p className="mt-2 text-xs text-slate-700">
                  openclaw.ai • Credential ID: OC-{Date.now().toString(36).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
