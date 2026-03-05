import type { QuestsDatabase } from "./db";

export type AnalyticsEventType =
  | "page_view"
  | "signup_started"
  | "signup_completed"
  | "proof_submitted"
  | "quest_completed"
  | "hatch_completed";

export function recordAnalyticsEvent(
  db: QuestsDatabase,
  type: AnalyticsEventType,
  metadata?: { path?: string; questId?: number; userId?: number },
): void {
  db.prepare(
    `INSERT INTO analytics_events (event_type, page_path, quest_id, user_id, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(type, metadata?.path ?? null, metadata?.questId ?? null, metadata?.userId ?? null, new Date().toISOString());
}

export function getPageViewCounts(db: QuestsDatabase): Array<{ path: string; views: number }> {
  return db
    .prepare(
      `SELECT page_path AS path, COUNT(*) AS views
       FROM analytics_events
       WHERE event_type = 'page_view' AND page_path IS NOT NULL
       GROUP BY page_path
       ORDER BY views DESC, path ASC`
    )
    .all() as Array<{ path: string; views: number }>;
}

export function getCompletionFunnel(db: QuestsDatabase): {
  signupStarted: number;
  signupCompleted: number;
  proofSubmitted: number;
  questsCompleted: number;
  hatchesCompleted: number;
} {
  const count = (type: AnalyticsEventType) =>
    Number(
      (db
        .prepare(`SELECT COUNT(*) as count FROM analytics_events WHERE event_type = ?`)
        .get(type) as { count: number }).count,
    );

  return {
    signupStarted: count("signup_started"),
    signupCompleted: count("signup_completed"),
    proofSubmitted: count("proof_submitted"),
    questsCompleted: count("quest_completed"),
    hatchesCompleted: count("hatch_completed"),
  };
}
