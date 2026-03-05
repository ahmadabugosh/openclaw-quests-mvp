import { describe, expect, it } from "vitest";
import { getHatchAnimationPhase } from "./hatching";

describe("hatching animation phases", () => {
  it("returns pre-hatch before minimum completion", () => {
    expect(getHatchAnimationPhase(0)).toBe("pre-hatch");
    expect(getHatchAnimationPhase(9)).toBe("pre-hatch");
  });

  it("returns hatching once minimum is met", () => {
    expect(getHatchAnimationPhase(10)).toBe("hatching");
  });

  it("returns hatched when all quests are completed", () => {
    expect(getHatchAnimationPhase(12)).toBe("hatched");
    expect(getHatchAnimationPhase(20)).toBe("hatched");
  });
});
