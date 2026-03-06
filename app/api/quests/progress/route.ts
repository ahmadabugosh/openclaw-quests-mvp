import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/auth-db";
import { serverDb } from "@/lib/server-db";

function getUserFromRequest(req: NextRequest) {
  const cookie = req.cookies.get("ocq_session")?.value;
  if (!cookie) return null;
  return getUserFromSession(serverDb, cookie);
}

// GET: load user's quest progress
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const rows = serverDb
    .prepare("SELECT quest_id, status, completed_at FROM quest_progress WHERE user_id = ?")
    .all(user.id) as { quest_id: number; status: string; completed_at: string | null }[];

  const completedIds = rows.filter((r) => r.status === "completed").map((r) => r.quest_id);

  const hatched = serverDb
    .prepare("SELECT hatch_date FROM users WHERE id = ?")
    .get(user.id) as { hatch_date: string | null } | undefined;

  const paid = serverDb
    .prepare("SELECT 1 FROM payments WHERE user_id = ? AND status = 'paid' LIMIT 1")
    .get(user.id);

  const attestRow = serverDb
    .prepare("SELECT uid, url FROM attestations WHERE user_id = ? LIMIT 1")
    .get(user.id) as { uid: string; url: string } | undefined;

  return NextResponse.json({
    completedIds,
    hasHatched: !!hatched?.hatch_date,
    isPaid: !!paid,
    attestation: attestRow || null,
    email: user.email,
    username: user.username,
  });
}

// POST: save quest completion
export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { questId, action } = await req.json();

  if (typeof questId !== "number" || questId < 1 || questId > 12) {
    return NextResponse.json({ error: "Invalid quest ID" }, { status: 400 });
  }

  const now = new Date().toISOString();

  if (action === "uncomplete") {
    serverDb
      .prepare(
        `INSERT INTO quest_progress (user_id, quest_id, status, completed_at, updated_at)
         VALUES (?, ?, 'available', NULL, ?)
         ON CONFLICT(user_id, quest_id) DO UPDATE SET
           status = 'available', completed_at = NULL, updated_at = ?`
      )
      .run(user.id, questId, now, now);
  } else {
    serverDb
      .prepare(
        `INSERT INTO quest_progress (user_id, quest_id, status, completed_at, updated_at)
         VALUES (?, ?, 'completed', ?, ?)
         ON CONFLICT(user_id, quest_id) DO UPDATE SET
           status = 'completed',
           completed_at = COALESCE(quest_progress.completed_at, ?),
           updated_at = ?`
      )
      .run(user.id, questId, now, now, now, now);
  }

  return NextResponse.json({ ok: true });
}
