import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { openDatabase } from "./db";
import {
  getCompletionFunnel,
  getPageViewCounts,
  recordAnalyticsEvent,
  type AnalyticsEventType,
} from "./analytics";

const cleanupPaths: string[] = [];

afterEach(() => {
  while (cleanupPaths.length) {
    const path = cleanupPaths.pop();
    if (path) rmSync(path, { recursive: true, force: true });
  }
});

function withDb(test: (dbPath: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), "ocq-analytics-"));
  cleanupPaths.push(dir);
  test(join(dir, "quests.db"));
}

describe("analytics", () => {
  it("records and aggregates page views", () => {
    withDb((dbPath) => {
      const db = openDatabase(dbPath);

      recordAnalyticsEvent(db, "page_view", { path: "/" });
      recordAnalyticsEvent(db, "page_view", { path: "/dashboard" });
      recordAnalyticsEvent(db, "page_view", { path: "/dashboard" });

      const counts = getPageViewCounts(db);
      expect(counts).toEqual([
        { path: "/dashboard", views: 2 },
        { path: "/", views: 1 },
      ]);
    });
  });

  it("builds completion funnel counts", () => {
    withDb((dbPath) => {
      const db = openDatabase(dbPath);

      const funnelEvents: Array<{ type: AnalyticsEventType; questId?: number }> = [
        { type: "signup_started" },
        { type: "signup_completed" },
        { type: "proof_submitted" },
        { type: "quest_completed", questId: 1 },
        { type: "quest_completed", questId: 2 },
        { type: "hatch_completed" },
      ];

      for (const event of funnelEvents) {
        recordAnalyticsEvent(db, event.type, {
          questId: event.questId,
        });
      }

      const funnel = getCompletionFunnel(db);
      expect(funnel).toEqual({
        signupStarted: 1,
        signupCompleted: 1,
        proofSubmitted: 1,
        questsCompleted: 2,
        hatchesCompleted: 1,
      });
    });
  });
});
