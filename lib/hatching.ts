export type HatchAnimationPhase = "pre-hatch" | "hatching" | "hatched";

export function getHatchAnimationPhase(completedCount: number, hatchMinimum: number = 10, totalQuests: number = 12): HatchAnimationPhase {
  if (completedCount >= totalQuests) {
    return "hatched";
  }

  if (completedCount >= hatchMinimum) {
    return "hatching";
  }

  return "pre-hatch";
}
