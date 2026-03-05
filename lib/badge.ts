export const HATCH_THRESHOLD = 10;

export function getBadgeLevel(completedCount: number): string {
  return completedCount >= HATCH_THRESHOLD ? "OpenClaw Operator — Level 1" : "Incubating Agent";
}

export function formatHatchDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

type BuildBadgeSummaryInput = {
  username: string;
  completedCount: number;
  hatchedAtIso: string;
};

export function buildBadgeSummary(input: BuildBadgeSummaryInput): string {
  const level = getBadgeLevel(input.completedCount);
  const hatchDate = formatHatchDate(input.hatchedAtIso);
  return `@${input.username} • ${level} • Hatched on ${hatchDate}`;
}
