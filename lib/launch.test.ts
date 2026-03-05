import { describe, expect, it } from "vitest";
import { buildLaunchChecklist, type LaunchChecklistInput } from "./launch";

describe("buildLaunchChecklist", () => {
  const base: LaunchChecklistInput = {
    domain: "quests.openclaw.ai",
    sslEnabled: true,
    seedDataReady: true,
    smokeTestPassed: true,
  };

  it("marks all checklist items complete when launch gates are ready", () => {
    const result = buildLaunchChecklist(base);

    expect(result.readyToLaunch).toBe(true);
    expect(result.items.every((item) => item.done)).toBe(true);
  });

  it("reports incomplete launch gates with actionable labels", () => {
    const result = buildLaunchChecklist({
      ...base,
      domain: "",
      sslEnabled: false,
      smokeTestPassed: false,
    });

    expect(result.readyToLaunch).toBe(false);
    expect(result.items.find((item) => item.id === "domain")?.done).toBe(false);
    expect(result.items.find((item) => item.id === "ssl")?.done).toBe(false);
    expect(result.items.find((item) => item.id === "smoke")?.done).toBe(false);
    expect(result.summary).toContain("1/4");
  });
});
