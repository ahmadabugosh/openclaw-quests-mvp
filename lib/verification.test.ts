import { describe, expect, it } from "vitest";
import { evaluateQuestCompletion } from "./verification";
import type { ProofChecks } from "./proof";

const baseChecks: ProofChecks = {
  openclaw_running: true,
  openclaw_version: "0.42.0",
  has_model_configured: true,
  model_provider: "openrouter",
  has_channel: true,
  channel_type: "telegram",
  message_count: 6,
  has_identity: true,
  agent_name: "Rose",
  has_memory_files: true,
  cron_count: 2,
  cron_has_run: true,
  has_web_search_usage: true,
  has_custom_skill: true,
  skill_count: 1,
  has_twitter: false,
};

describe("evaluateQuestCompletion", () => {
  it("returns completed quest ids from checks", () => {
    const result = evaluateQuestCompletion(baseChecks);

    expect(result.completedQuestIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(result.completedCount).toBe(11);
    expect(result.hasHatched).toBe(true);
  });

  it("does not complete quest when requirement fails", () => {
    const result = evaluateQuestCompletion({
      ...baseChecks,
      message_count: 4,
      has_model_configured: false,
      has_twitter: false,
    });

    expect(result.completedQuestIds.includes(3)).toBe(false);
    expect(result.completedQuestIds.includes(5)).toBe(false);
    expect(result.completedQuestIds.includes(12)).toBe(false);
    expect(result.hasHatched).toBe(false);
  });
});
