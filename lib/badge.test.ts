import { describe, expect, it } from "vitest";
import { getBadgeLevel, formatHatchDate, buildBadgeSummary } from "./badge";

describe("badge helpers", () => {
  it("returns operator level 1 once user hatches", () => {
    expect(getBadgeLevel(10)).toBe("OpenClaw Operator — Level 1");
    expect(getBadgeLevel(12)).toBe("OpenClaw Operator — Level 1");
  });

  it("returns incubating label under hatch threshold", () => {
    expect(getBadgeLevel(0)).toBe("Incubating Agent");
    expect(getBadgeLevel(9)).toBe("Incubating Agent");
  });

  it("formats hatch date in a friendly UTC format", () => {
    expect(formatHatchDate("2026-03-05T12:00:00Z")).toBe("March 5, 2026");
  });

  it("builds a share summary string", () => {
    const summary = buildBadgeSummary({
      username: "rose",
      completedCount: 10,
      hatchedAtIso: "2026-03-05T12:00:00Z",
    });

    expect(summary).toContain("@rose");
    expect(summary).toContain("OpenClaw Operator — Level 1");
    expect(summary).toContain("March 5, 2026");
  });
});
