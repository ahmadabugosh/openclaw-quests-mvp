const TOTAL_QUESTS = 12;

export function getProgressPercent(completedCount: number, total: number = TOTAL_QUESTS): number {
  if (total <= 0) return 0;
  const clamped = Math.max(0, Math.min(completedCount, total));
  return Math.round((clamped / total) * 100);
}

/** Returns a crack stage from 0-12 matching each completed quest */
export function getCrackStage(completedCount: number): number {
  return Math.max(0, Math.min(completedCount, TOTAL_QUESTS));
}

export function isHatched(completedCount: number, hatchMinimum: number = 10): boolean {
  return completedCount >= hatchMinimum;
}
