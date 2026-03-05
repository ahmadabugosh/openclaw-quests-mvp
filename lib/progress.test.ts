import { describe, expect, it } from "vitest";
import { getEggStage, getProgressPercent } from "./progress";

describe("progress", () => {
  it("calculates progress percentage", () => {
    expect(getProgressPercent(0)).toBe(0);
    expect(getProgressPercent(6)).toBe(50);
    expect(getProgressPercent(12)).toBe(100);
  });

  it("clamps out-of-range values", () => {
    expect(getProgressPercent(-2)).toBe(0);
    expect(getProgressPercent(200)).toBe(100);
  });

  it("maps completed tasks to egg stages based on 10/12 hatch minimum", () => {
    expect(getEggStage(0)).toBe(0);
    expect(getEggStage(3)).toBe(25);
    expect(getEggStage(5)).toBe(50);
    expect(getEggStage(8)).toBe(75);
    expect(getEggStage(10)).toBe(100);
    expect(getEggStage(12)).toBe(100);
  });
});
