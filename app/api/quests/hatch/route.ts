import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/auth-db";
import { serverDb } from "@/lib/server-db";

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("ocq_session")?.value;
  if (!cookie) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const user = getUserFromSession(serverDb, cookie);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // Check all 12 quests completed
  const completedCount = serverDb
    .prepare("SELECT COUNT(*) as cnt FROM quest_progress WHERE user_id = ? AND status = 'completed'")
    .get(user.id) as { cnt: number };

  if (completedCount.cnt < 12) {
    return NextResponse.json({ error: "Complete all 12 quests to hatch" }, { status: 400 });
  }

  const now = new Date().toISOString();
  serverDb.prepare("UPDATE users SET hatch_date = ? WHERE id = ? AND hatch_date IS NULL").run(now, user.id);

  return NextResponse.json({ ok: true, hatchDate: now });
}
