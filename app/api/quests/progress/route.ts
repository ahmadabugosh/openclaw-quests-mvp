import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/auth-pg";
import { pool } from "@/lib/postgres-db";

async function getUserFromRequest(req: NextRequest) {
  const cookie = req.cookies.get("ocq_session")?.value;
  if (!cookie) return null;
  return await getUserFromSession(cookie);
}

// GET: load user's quest progress
export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const progressResult = await pool.query(
    "SELECT quest_id, status, completed_at FROM quest_progress WHERE user_id = $1",
    [user.id]
  );

  const completedIds = progressResult.rows
    .filter((r: any) => r.status === "completed")
    .map((r: any) => r.quest_id);

  const hatchResult = await pool.query(
    "SELECT hatch_date FROM users WHERE id = $1",
    [user.id]
  );

  const paidResult = await pool.query(
    "SELECT 1 FROM payments WHERE user_id = $1 AND status = 'paid' LIMIT 1",
    [user.id]
  );

  const attestResult = await pool.query(
    "SELECT uid, url FROM attestations WHERE user_id = $1 LIMIT 1",
    [user.id]
  );

  return NextResponse.json({
    completedIds,
    hasHatched: !!hatchResult.rows[0]?.hatch_date,
    isPaid: paidResult.rows.length > 0,
    attestation: attestResult.rows[0] || null,
    email: user.email,
    username: user.username,
  });
}

// POST: save quest completion
export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { questId, action } = await req.json();

  if (typeof questId !== "number" || questId < 1 || questId > 12) {
    return NextResponse.json({ error: "Invalid quest ID" }, { status: 400 });
  }

  const now = new Date().toISOString();

  if (action === "uncomplete") {
    await pool.query(
      `INSERT INTO quest_progress (user_id, quest_id, status, completed_at, updated_at)
       VALUES ($1, $2, 'available', NULL, $3)
       ON CONFLICT (user_id, quest_id) DO UPDATE SET
         status = 'available', completed_at = NULL, updated_at = $3`,
      [user.id, questId, now]
    );
  } else {
    await pool.query(
      `INSERT INTO quest_progress (user_id, quest_id, status, completed_at, updated_at)
       VALUES ($1, $2, 'completed', $3, $3)
       ON CONFLICT (user_id, quest_id) DO UPDATE SET
         status = 'completed',
         completed_at = COALESCE(quest_progress.completed_at, $3),
         updated_at = $3`,
      [user.id, questId, now]
    );
  }

  return NextResponse.json({ ok: true });
}
