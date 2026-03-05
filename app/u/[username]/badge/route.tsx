import { ImageResponse } from "next/og";
import { generateCreature } from "@/lib/creature";
import { buildBadgeSummary, formatHatchDate, getBadgeLevel } from "@/lib/badge";

export const runtime = "edge";

export async function GET(_: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const completedCount = 10;
  const hatchedAtIso = "2026-03-05T12:00:00Z";
  const hatchDate = formatHatchDate(hatchedAtIso);
  const level = getBadgeLevel(completedCount);

  const traits = generateCreature({
    channelType: "telegram",
    firstCronType: "time-based",
    soulTone: "cheerful",
    seed: username,
  });

  const summary = buildBadgeSummary({ username, completedCount, hatchedAtIso });

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          padding: "48px",
          background: "linear-gradient(135deg, #020617 0%, #0f172a 40%, #0ea5e9 100%)",
          color: "#f8fafc",
          fontFamily: "Inter, ui-sans-serif, system-ui",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "2px solid rgba(255,255,255,0.2)",
            borderRadius: 24,
            padding: 36,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(2,6,23,0.45)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 700 }}>
            <div style={{ fontSize: 26, opacity: 0.9 }}>OpenClaw Quests</div>
            <div style={{ fontSize: 54, fontWeight: 800 }}>🥚→🦞 Hatched!</div>
            <div style={{ fontSize: 42, fontWeight: 700 }}>@{username}</div>
            <div style={{ fontSize: 30, color: "#bae6fd" }}>{level}</div>
            <div style={{ fontSize: 26 }}>Hatched on {hatchDate}</div>
            <div style={{ fontSize: 20, opacity: 0.75 }}>{summary}</div>
          </div>

          <div
            style={{
              width: 280,
              height: 280,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "radial-gradient(circle at 40% 20%, #ffffff 0%, #e2e8f0 40%, #0f172a 100%)",
              color: "#020617",
              fontWeight: 700,
              fontSize: 22,
              border: "6px solid rgba(255,255,255,0.7)",
            }}
          >
            {traits.baseColor}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
