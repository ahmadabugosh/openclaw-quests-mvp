import { describe, expect, it } from "vitest";
import { getHealthPayload } from "./health";

describe("getHealthPayload", () => {
  it("returns an ok status payload with current timestamp", () => {
    const payload = getHealthPayload();

    expect(payload.status).toBe("ok");
    expect(payload.service).toBe("openclaw-quests-mvp");
    expect(() => new Date(payload.timestamp)).not.toThrow();
    expect(Number.isNaN(new Date(payload.timestamp).getTime())).toBe(false);
  });
});
