"use client";

import { useState } from "react";
import { QUEST_VERIFICATIONS } from "@/lib/quest-verification";

interface Props {
  questId: number;
  isCompleted: boolean;
  onComplete: (questId: number) => void;
  onUncomplete: (questId: number) => void;
}

export function QuestVerify({ questId, isCompleted, onComplete, onUncomplete }: Props) {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{ valid: boolean; message: string } | null>(null);

  const verification = QUEST_VERIFICATIONS[questId];

  if (isCompleted) {
    return (
      <div className="mt-6 rounded-lg border border-green-800 bg-green-950/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-green-300">✅ Quest Complete!</p>
            <p className="mt-1 text-sm text-green-400/70">Nice work — on to the next one.</p>
          </div>
          <button
            onClick={() => onUncomplete(questId)}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-300"
          >
            ↩ Redo
          </button>
        </div>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="mt-6 rounded-lg border border-slate-700 p-4">
        <button
          onClick={() => onComplete(questId)}
          className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-900 transition-colors hover:bg-cyan-400"
        >
          ✓ Mark as Complete
        </button>
      </div>
    );
  }

  function handleVerify() {
    if (!verification) return;
    const result = verification.validate(input);
    setFeedback(result);
    if (result.valid) {
      setTimeout(() => onComplete(questId), 1200);
    }
  }

  return (
    <div className="mt-6 rounded-lg border border-cyan-800/50 bg-cyan-950/20 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300 mb-1">
        🧪 Verify Your Work
      </h3>
      <p className="text-sm text-slate-300">{verification.challenge}</p>
      <p className="mt-1 text-xs text-slate-500">{verification.instruction}</p>

      {verification.command && (
        <pre className="mt-3 rounded bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-green-400 overflow-x-auto whitespace-pre-wrap break-words">
          <code>{verification.command}</code>
        </pre>
      )}

      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setFeedback(null);
        }}
        placeholder={verification.placeholder}
        rows={3}
        className="mt-3 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
      />

      <button
        onClick={handleVerify}
        disabled={input.trim().length === 0}
        className="mt-3 w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-900 transition-colors hover:bg-cyan-400 active:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
      >
        ✓ Verify
      </button>

      {feedback && (
        <div className={`mt-3 rounded-lg p-3 text-sm ${
          feedback.valid
            ? "border border-green-800 bg-green-950/30 text-green-300"
            : "border border-rose-800 bg-rose-950/30 text-rose-300"
        }`}>
          {feedback.valid ? "✅ " : "❌ "}{feedback.message}
        </div>
      )}
    </div>
  );
}
