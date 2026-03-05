"use client";

interface Props {
  questId: number;
  isCompleted: boolean;
  onComplete: (questId: number) => void;
}

export function QuestVerify({ questId, isCompleted, onComplete }: Props) {
  if (isCompleted) {
    return (
      <div className="mt-6 rounded-lg border border-green-800 bg-green-950/30 p-4 text-center">
        <p className="text-lg font-semibold text-green-300">✅ Quest Complete!</p>
        <p className="mt-1 text-sm text-green-400/70">Nice work — on to the next one.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg border border-slate-700 p-4">
      <p className="mb-3 text-sm text-slate-300">
        Finished all the steps above?
      </p>
      <button
        onClick={() => onComplete(questId)}
        className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-900 transition-colors hover:bg-cyan-400 active:bg-cyan-600"
      >
        ✓ Mark Quest {questId} as Complete
      </button>
      <p className="mt-2 text-center text-xs text-slate-500">
        Be honest with yourself — the only person you&apos;re cheating is you! 😄
      </p>
    </div>
  );
}
