import { describe, expect, it } from "vitest";
import { getQuestById, QUESTS } from "./quests";

describe("QUESTS", () => {
  it("contains all 12 incubation tasks", () => {
    expect(QUESTS).toHaveLength(12);
    expect(QUESTS.map((q) => q.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("has tutorial content and help links for each task", () => {
    for (const quest of QUESTS) {
      expect(quest.videoUrl).toContain("https://");
      expect(quest.blogUrl).toContain("https://");
      expect(quest.steps.length).toBeGreaterThanOrEqual(3);
      expect(quest.helpLinks.length).toBeGreaterThanOrEqual(1);

      for (const link of quest.helpLinks) {
        expect(link.label.length).toBeGreaterThan(0);
        expect(link.url).toContain("https://");
      }
    }
  });

  it("returns a quest by id", () => {
    expect(getQuestById(3)?.title).toBe("Choose a Brain");
    expect(getQuestById(99)).toBeUndefined();
  });
});
