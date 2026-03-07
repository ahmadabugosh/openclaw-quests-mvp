import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(_: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const skills = [
    "Terminal & SSH", "VPS Management", "AI Model Config",
    "Chat Integration", "Agent Memory", "Task Automation",
    "Web Search", "Social APIs", "Skill Collector",
    "Security", "Dashboard Ops", "Full Deployment",
  ];

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
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 650 }}>
            <div style={{ fontSize: 24, opacity: 0.7, display: "flex" }}>Learn OpenClaw</div>
            <div style={{ fontSize: 52, fontWeight: 800, display: "flex" }}>Hatched!</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: "#fbbf24", display: "flex" }}>@{username}</div>
            <div style={{ fontSize: 28, color: "#67e8f9", display: "flex" }}>OpenClaw Operator</div>
            <div style={{ fontSize: 20, opacity: 0.6, display: "flex" }}>12 / 12 quests completed</div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              width: 320,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: "#67e8f9", marginBottom: 4, display: "flex" }}>Skills Earned</div>
            {skills.map((skill) => (
              <div
                key={skill}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 15,
                  color: "#cbd5e1",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 6,
                  padding: "3px 10px",
                }}
              >
                - {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
