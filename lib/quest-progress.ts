import { QUESTS } from "./quests";
import { decodeProofCode, verifyProofSignature } from "./proof";
import { evaluateQuestCompletion, type QuestEvaluationResult } from "./verification";
import type { QuestsDatabase } from "./db";

export type QuestProgressRow = {
  id: number;
  user_id: number;
  quest_id: number;
  status: "locked" | "available" | "completed";
  completed_at: string | null;
  verification_data: string | null;
  updated_at: string;
};

export function applyProofToUser(
  db: QuestsDatabase,
  userId: number,
  proofCode: string,
  instanceSecret: string,
): QuestEvaluationResult {
  const payload = decodeProofCode(proofCode);

  if (!verifyProofSignature(payload, instanceSecret)) {
    throw new Error("Invalid proof signature");
  }

  const evaluation = evaluateQuestCompletion(payload.checks);
  const now = new Date().toISOString();
  const completedIds = new Set(evaluation.completedQuestIds);

  const upsert = db.prepare(`
    INSERT INTO quest_progress (user_id, quest_id, status, completed_at, verification_data, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, quest_id) DO UPDATE SET
      status = excluded.status,
      completed_at = CASE
        WHEN quest_progress.completed_at IS NOT NULL THEN quest_progress.completed_at
        WHEN excluded.status = 'completed' THEN excluded.completed_at
        ELSE NULL
      END,
      verification_data = excluded.verification_data,
      updated_at = excluded.updated_at
  `);

  db.exec("BEGIN");
  try {
    for (const quest of QUESTS) {
      const completed = completedIds.has(quest.id);
      upsert.run(
        userId,
        quest.id,
        completed ? "completed" : "available",
        completed ? now : null,
        JSON.stringify(payload.checks),
        now,
      );
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return evaluation;
}

export function getQuestProgressForUser(db: QuestsDatabase, userId: number): QuestProgressRow[] {
  return db
    .prepare("SELECT * FROM quest_progress WHERE user_id = ? ORDER BY quest_id")
    .all(userId) as QuestProgressRow[];
}
