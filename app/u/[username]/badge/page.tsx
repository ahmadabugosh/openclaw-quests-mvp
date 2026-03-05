import Image from "next/image";

type BadgePageProps = {
  params: Promise<{ username: string }>;
};

export default async function BadgePage({ params }: BadgePageProps) {
  const { username } = await params;
  const badgeUrl = `/u/${username}/badge`;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 p-6 md:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Shareable Badge</p>
        <h1 className="mt-2 text-3xl font-bold">@{username}&apos;s Hatch Card</h1>
        <p className="mt-2 text-slate-300">Use this image when sharing your OpenClaw hatch milestone.</p>

        <Image
          src={badgeUrl}
          alt={`${username} OpenClaw badge`}
          width={1200}
          height={630}
          className="mt-6 w-full rounded-xl border border-slate-700"
          unoptimized
        />

        <a
          href={badgeUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-md bg-cyan-400 px-4 py-2 font-semibold text-slate-900"
        >
          Open full-size PNG
        </a>
      </div>
    </main>
  );
}
