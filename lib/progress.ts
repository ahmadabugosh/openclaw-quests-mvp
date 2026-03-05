const TOTAL_QUESTS = 12;

export type EggStage = 0 | 25 | 50 | 75 | 100;

export function getProgressPercent(completedCount: number, total: number = TOTAL_QUESTS): number {
  if (total <= 0) {
    return 0;
  }

  const clamped = Math.max(0, Math.min(completedCount, total));
  return Math.round((clamped / total) * 100);
}

export function getEggStage(completedCount: number, hatchMinimum: number = 10): EggStage {
  const ratio = completedCount / hatchMinimum;

  if (ratio >= 1) return 100;
  if (ratio >= 0.75) return 75;
  if (ratio >= 0.5) return 50;
  if (ratio >= 0.25) return 25;
  return 0;
}
