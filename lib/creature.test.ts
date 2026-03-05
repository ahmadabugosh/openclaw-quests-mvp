import { describe, expect, it } from "vitest";
import { generateCreature } from "./creature";

describe("generateCreature", () => {
  it("maps channel, cron type, and soul tone to expected traits", () => {
    const result = generateCreature({
      channelType: "telegram",
      firstCronType: "web-search",
      soulTone: "cheerful helper",
      seed: "abc123",
    });

    expect(result.baseColor).toBe("#2AABEE");
    expect(result.accessory).toBe("magnifying-glass");
    expect(result.expression).toBe("smile");
  });

  it("falls back to defaults for unknown values", () => {
    const result = generateCreature({
      channelType: "matrix",
      firstCronType: "pipeline",
      soulTone: "mysterious",
      seed: "x",
    });

    expect(result.baseColor).toBe("#14B8A6");
    expect(result.accessory).toBe("spark");
    expect(result.expression).toBe("calm");
  });

  it("is deterministic for same seed", () => {
    const first = generateCreature({ seed: "stable-seed" });
    const second = generateCreature({ seed: "stable-seed" });

    expect(first.pattern).toBe(second.pattern);
    expect(first.eyeStyle).toBe(second.eyeStyle);
    expect(first.pattern).toBeGreaterThanOrEqual(0);
    expect(first.pattern).toBeLessThan(8);
    expect(first.eyeStyle).toBeGreaterThanOrEqual(0);
    expect(first.eyeStyle).toBeLessThan(5);
  });
});
