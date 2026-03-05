import type { ProofChecks } from "./proof";

const HATCH_MINIMUM = 10;

export type QuestEvaluationResult = {
  completedQuestIds: number[];
  completedCount: number;
  hasHatched: boolean;
};

type Rule = {
  id: number;
  passes: (checks: ProofChecks) => boolean;
};

const RULES: Rule[] = [
  { id: 1, passes: (c) => c.openclaw_running },
  { id: 2, passes: (c) => Boolean(c.openclaw_version) },
  { id: 3, passes: (c) => c.has_model_configured && Boolean(c.model_provider) },
  { id: 4, passes: (c) => c.has_channel && Boolean(c.channel_type) },
  { id: 5, passes: (c) => c.message_count >= 5 },
  { id: 6, passes: (c) => c.has_identity && Boolean(c.agent_name) },
  { id: 7, passes: (c) => c.has_memory_files },
  { id: 8, passes: (c) => c.cron_count >= 1 },
  { id: 9, passes: (c) => c.has_web_search_usage },
  { id: 10, passes: (c) => c.cron_count >= 1 && c.cron_has_run },
  { id: 11, passes: (c) => c.has_custom_skill && c.skill_count >= 1 },
  { id: 12, passes: (c) => c.has_twitter },
];

export function evaluateQuestCompletion(checks: ProofChecks): QuestEvaluationResult {
  const completedQuestIds = RULES.filter((rule) => rule.passes(checks)).map((rule) => rule.id);

  return {
    completedQuestIds,
    completedCount: completedQuestIds.length,
    hasHatched: completedQuestIds.length >= HATCH_MINIMUM,
  };
}
