import { QUESTS } from "@/lib/quests";
import { getEggStage, getProgressPercent } from "@/lib/progress";

export default function DashboardPage() {
  const completedCount = 4;
  const progress = getProgressPercent(completedCount);
  const eggStage = getEggStage(completedCount);
  const activeQuest = QUESTS[2];

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-5">
        <aside className="rounded-2xl border border-slate-700 bg-slate-900 p-6 md:col-span-2">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Your Agent</p>
          <div className="mt-4 grid place-items-center rounded-xl border border-slate-700 bg-slate-950 py-8">
            <div className="text-7xl">🥚</div>
            <p className="mt-2 text-sm text-slate-300">Crack stage: {eggStage}%</p>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>
                {completedCount}/12 ({progress}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full bg-cyan-400" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <ul className="mt-6 space-y-2">
            {QUESTS.map((quest) => {
              const state =
                quest.id <= completedCount
                  ? "completed"
                  : quest.id === activeQuest.id
                    ? "active"
                    : "todo";

              return (
                <li key={quest.id} className="rounded-lg border border-slate-700 px-3 py-2 text-sm">
                  {state === "completed" && "✅ "}
                  {state === "active" && "→ "}
                  {state === "todo" && "○ "}
                  {quest.title}
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6 md:col-span-3">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Quest {activeQuest.id}</p>
          <h1 className="mt-2 text-3xl font-bold">{activeQuest.title}</h1>
          <p className="mt-2 text-slate-300">{activeQuest.summary}</p>

          <div className="mt-6 aspect-video overflow-hidden rounded-lg border border-slate-700 bg-black">
            <iframe
              title={`${activeQuest.title} tutorial`}
              src={activeQuest.videoUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <ol className="mt-6 list-decimal space-y-2 pl-5 text-slate-200">
            {activeQuest.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <a href={activeQuest.blogUrl} className="mt-6 inline-block text-cyan-300 underline">
            Read deep dive guide
          </a>

          <div className="mt-6 rounded-lg border border-slate-700 p-4">
            <label className="mb-2 block text-sm text-slate-300" htmlFor="proof-code">
              Paste your proof code to verify:
            </label>
            <div className="flex gap-2">
              <input
                id="proof-code"
                placeholder="ocq://..."
                className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2"
              />
              <button className="rounded-md bg-cyan-400 px-4 py-2 font-semibold text-slate-900">✓</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
