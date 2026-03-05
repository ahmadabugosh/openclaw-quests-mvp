import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { openDatabase } from "./db";

const cleanupPaths: string[] = [];

afterEach(() => {
  while (cleanupPaths.length) {
    const path = cleanupPaths.pop();
    if (path) rmSync(path, { recursive: true, force: true });
  }
});

describe("database schema", () => {
  it("creates users and quest_progress tables", () => {
    const dir = mkdtempSync(join(tmpdir(), "ocq-db-"));
    cleanupPaths.push(dir);

    const db = openDatabase(join(dir, "quests.db"));

    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      .all() as Array<{ name: string }>;

    expect(tables.map((t) => t.name)).toEqual(
      expect.arrayContaining(["analytics_events", "quest_progress", "users"]),
    );
  });
});
