export type HealthPayload = {
  status: "ok";
  service: "openclaw-quests-mvp";
  timestamp: string;
};

export function getHealthPayload(now: Date = new Date()): HealthPayload {
  return {
    status: "ok",
    service: "openclaw-quests-mvp",
    timestamp: now.toISOString(),
  };
}
