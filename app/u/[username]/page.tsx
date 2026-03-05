import type { Metadata } from "next";
import { ClawCreature } from "@/app/components/claw-creature";
import { generateCreature } from "@/lib/creature";
import { QUESTS } from "@/lib/quests";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profileUrl = `https://quests.openclaw.ai/u/${username}`;
  const imageUrl = "https://quests.openclaw.ai/file.svg";

  return {
    title: `@${username} — OpenClaw Operator Level 1`,
    description: `See @${username}'s hatched OpenClaw creature and completed onboarding quests.`,
    openGraph: {
      title: `@${username} — OpenClaw Operator Level 1`,
      description: `I hatched my OpenClaw agent. Start your own quest!`,
      url: profileUrl,
      type: "profile",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${username} OpenClaw badge` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `@${username} — OpenClaw Operator Level 1`,
      description: `I hatched my OpenClaw agent. Start your own quest!`,
      images: [imageUrl],
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const completedQuestIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const creature = generateCreature({
    channelType: "telegram",
    firstCronType: "time-based",
    soulTone: "cheerful",
    seed: username,
  });

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto grid max-w-5xl gap-8 rounded-2xl border border-slate-700 bg-slate-900 p-6 md:grid-cols-5 md:p-10">
        <section className="md:col-span-2">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">OpenClaw Quests</p>
          <h1 className="mt-2 text-3xl font-bold">@{username}</h1>
          <p className="mt-2 text-slate-300">OpenClaw Operator — Level 1</p>
          <p className="mt-1 text-sm text-slate-400">Hatched on March 5, 2026</p>

          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4">
            <ClawCreature traits={creature} className="mx-auto w-full max-w-[280px]" />
          </div>
        </section>

        <section className="md:col-span-3">
          <h2 className="text-xl font-semibold">Completed Quests</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {QUESTS.map((quest) => {
              const done = completedQuestIds.includes(quest.id);
              return (
                <li key={quest.id} className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm">
                  <span>{done ? "✅" : "○"}</span> <span className={done ? "text-slate-100" : "text-slate-400"}>{quest.title}</span>
                </li>
              );
            })}
          </ul>

          <a href="https://openclaw.ai" className="mt-6 inline-block rounded-md bg-cyan-400 px-4 py-2 font-semibold text-slate-900">
            Hatch your own → openclaw.ai
          </a>
        </section>
      </div>
    </main>
  );
}
