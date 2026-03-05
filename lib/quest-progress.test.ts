import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { openDatabase } from "./db";
import { encodeProofCode, signProofPayload, type ProofChecks } from "./proof";
import { applyProofToUser, getQuestProgressForUser } from "./quest-progress";

const secret = "instance-secret";
const cleanupPaths: string[] = [];

afterEach(() => {
  while (cleanupPaths.length) {
    const path = cleanupPaths.pop();
    if (path) rmSync(path, { recursive: true, force: true });
  }
});

function makeChecks(overrides: Partial<ProofChecks> = {}): ProofChecks {
  return {
    openclaw_running: true,
    openclaw_version: "0.42.0",
    has_model_configured: true,
    model_provider: "openrouter",
    has_channel: true,
    channel_type: "telegram",
    message_count: 7,
    has_identity: true,
    agent_name: "Rose",
    has_memory_files: true,
    cron_count: 2,
    cron_has_run: true,
    has_web_search_usage: true,
    has_custom_skill: true,
    skill_count: 2,
    has_twitter: false,
    ...overrides,
  };
}

describe("applyProofToUser", () => {
  it("persists quest_progress rows from signed proof", () => {
    const dir = mkdtempSync(join(tmpdir(), "ocq-progress-"));
    cleanupPaths.push(dir);

    const db = openDatabase(join(dir, "quests.db"));

    const result = db
      .prepare(
        "INSERT INTO users (email, username, instance_id, instance_secret_hash) VALUES (?, ?, ?, ?) RETURNING id",
      )
      .get("user@example.com", "user1", "abc123", "unused") as { id: number };

    const unsigned = {
      version: "1.0" as const,
      timestamp: "2026-03-05T12:00:00.000Z",
      instance_id: "abc123",
      checks: makeChecks(),
    };

    const proofCode = encodeProofCode({
      ...unsigned,
      signature: signProofPayload(unsigned, secret),
    });

    const evaluation = applyProofToUser(db, result.id, proofCode, secret);
    const progress = getQuestProgressForUser(db, result.id);

    expect(evaluation.completedCount).toBe(11);
    expect(progress).toHaveLength(12);
    expect(progress.filter((q) => q.status === "completed")).toHaveLength(11);
    expect(progress.find((q) => q.quest_id === 12)?.status).toBe("available");
  });

  it("rejects invalid signatures", () => {
    const dir = mkdtempSync(join(tmpdir(), "ocq-progress-"));
    cleanupPaths.push(dir);

    const db = openDatabase(join(dir, "quests.db"));

    const result = db
      .prepare(
        "INSERT INTO users (email, username, instance_id, instance_secret_hash) VALUES (?, ?, ?, ?) RETURNING id",
      )
      .get("user@example.com", "user1", "abc123", "unused") as { id: number };

    const unsigned = {
      version: "1.0" as const,
      timestamp: "2026-03-05T12:00:00.000Z",
      instance_id: "abc123",
      checks: makeChecks(),
    };

    const proofCode = encodeProofCode({
      ...unsigned,
      signature: signProofPayload(unsigned, "wrong-secret"),
    });

    expect(() => applyProofToUser(db, result.id, proofCode, secret)).toThrow(
      "Invalid proof signature",
    );
  });
});
