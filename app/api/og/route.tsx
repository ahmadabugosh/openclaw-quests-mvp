import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "OpenClaw Operator";
  const date = searchParams.get("date") || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          border: "8px solid #d97706",
          fontFamily: "system-ui",
        }}
      >
        {/* Inner border */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(217, 119, 6, 0.3)",
            borderRadius: "16px",
            padding: "40px 60px",
            width: "1100px",
            height: "530px",
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "8px" }}>🦞</div>
          <div style={{ fontSize: "14px", color: "#d97706", letterSpacing: "6px", textTransform: "uppercase" as const }}>
            Certificate of Completion
          </div>
          <div style={{ fontSize: "18px", color: "#94a3b8", letterSpacing: "4px", marginTop: "8px", textTransform: "uppercase" as const }}>
            OpenClaw Quests
          </div>
          <div style={{ fontSize: "14px", color: "#64748b", marginTop: "24px" }}>This certifies that</div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 900,
              marginTop: "8px",
              background: "linear-gradient(90deg, #67e8f9, #fde68a, #67e8f9)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: "16px", color: "#94a3b8", marginTop: "16px", textAlign: "center" as const, maxWidth: "600px" }}>
            has successfully hatched their AI agent and earned the title of OpenClaw Operator
          </div>
          <div style={{ display: "flex", gap: "40px", marginTop: "32px", fontSize: "14px", color: "#64748b" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase" as const }}>Date</div>
              <div style={{ color: "#94a3b8", marginTop: "4px" }}>{date}</div>
            </div>
            <div style={{ width: "1px", height: "40px", background: "#334155" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase" as const }}>Level</div>
              <div style={{ color: "#fbbf24", marginTop: "4px", fontWeight: 700 }}>Operator 🦞</div>
            </div>
            <div style={{ width: "1px", height: "40px", background: "#334155" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase" as const }}>Verified</div>
              <div style={{ color: "#4ade80", marginTop: "4px" }}>On-Chain (Base)</div>
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#475569", marginTop: "24px" }}>openclaw.ai</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
