import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/auth-pg";
import { pool } from "@/lib/postgres-db";
import { pushEggHatched } from "@/lib/loops";

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("ocq_session")?.value;
  if (!cookie) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const user = await getUserFromSession(cookie);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // Check all 12 quests completed
  const completedResult = await pool.query(
    "SELECT COUNT(*) as cnt FROM quest_progress WHERE user_id = $1 AND status = 'completed'",
    [user.id]
  );

  if (parseInt(completedResult.rows[0].cnt) < 12) {
    return NextResponse.json({ error: "Complete all 12 quests to hatch" }, { status: 400 });
  }

  const now = new Date().toISOString();
  await pool.query(
    "UPDATE users SET hatch_date = $1 WHERE id = $2 AND hatch_date IS NULL",
    [now, user.id]
  );

  // Push to Loops.so (fire and forget)
  if (user.email) {
    pushEggHatched(user.email).catch(() => {});
  }

  return NextResponse.json({ ok: true, hatchDate: now });
}
