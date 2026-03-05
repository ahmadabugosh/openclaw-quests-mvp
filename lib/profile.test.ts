import { describe, expect, it } from "vitest";
import { getBadgeImagePath, getBadgePagePath } from "./profile";

describe("profile paths", () => {
  it("returns badge page path", () => {
    expect(getBadgePagePath("rose")).toBe("/u/rose/badge");
  });

  it("returns badge image path", () => {
    expect(getBadgeImagePath("rose")).toBe("/u/rose/badge/image");
  });
});
