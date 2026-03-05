import { VerifyProofForm } from "@/app/components/verify-proof-form";
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

          <details className="mt-6 md:pointer-events-none" open>
            <summary className="cursor-pointer rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium md:cursor-default md:border-0 md:px-0 md:py-0">
              Checklist ({completedCount}/12)
            </summary>
            <ul className="mt-3 space-y-2 md:mt-6">
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
          </details>
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
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Help links</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {activeQuest.helpLinks.map((link) => (
                <li key={link.url}>
                  <a className="text-cyan-200 underline hover:text-cyan-100" href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <VerifyProofForm />
        </section>
      </div>
    </main>
  );
}
