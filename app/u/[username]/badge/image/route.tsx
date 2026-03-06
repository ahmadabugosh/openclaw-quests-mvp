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
              display: "flex",
              flexDirection: "column",
              gap: 8,
              width: 320,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: "#67e8f9", marginBottom: 4 }}>Skills Completed</div>
            {["Terminal & SSH", "VPS Management", "AI Model Config", "Chat Integration", "Agent Memory", "Task Automation", "Web Search", "Social APIs", "Skill Collector", "Security", "Dashboard Ops", "Full Deployment"].map((skill) => (
              <div
                key={skill}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 16,
                  color: "#cbd5e1",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8,
                  padding: "4px 10px",
                }}
              >
                ✦ {skill}
              </div>
            ))}
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
