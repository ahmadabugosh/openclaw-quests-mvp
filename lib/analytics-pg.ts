import { pool } from "./postgres-db";

export type AnalyticsEventType =
  | "page_view"
  | "signup_started"
  | "signup_completed"
  | "proof_submitted"
  | "quest_completed"
  | "hatch_completed";

export async function recordAnalyticsEvent(
  type: AnalyticsEventType,
  metadata?: { path?: string; questId?: number; userId?: number },
): Promise<void> {
  await pool.query(
    `INSERT INTO analytics_events (event_type, page_path, quest_id, user_id, created_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [type, metadata?.path ?? null, metadata?.questId ?? null, metadata?.userId ?? null, new Date().toISOString()]
  );
}

export async function getPageViewCounts(): Promise<Array<{ path: string; views: number }>> {
  const result = await pool.query(
    `SELECT page_path AS path, COUNT(*) AS views
     FROM analytics_events
     WHERE event_type = 'page_view' AND page_path IS NOT NULL
     GROUP BY page_path
     ORDER BY views DESC, path ASC`
  );
  return result.rows.map((row: any) => ({ path: row.path, views: parseInt(row.views) }));
}

export async function getCompletionFunnel(): Promise<{
  signupStarted: number;
  signupCompleted: number;
  proofSubmitted: number;
  questsCompleted: number;
  hatchesCompleted: number;
}> {
  const count = async (type: AnalyticsEventType) => {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM analytics_events WHERE event_type = $1`,
      [type]
    );
    return parseInt(result.rows[0].count);
  };

  return {
    signupStarted: await count("signup_started"),
    signupCompleted: await count("signup_completed"),
    proofSubmitted: await count("proof_submitted"),
    questsCompleted: await count("quest_completed"),
    hatchesCompleted: await count("hatch_completed"),
  };
}
