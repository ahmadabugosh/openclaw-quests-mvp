import { describe, expect, it } from "vitest";
import { cookieOptions, hashPassword, hashSessionToken, newSessionToken, verifyPassword } from "./auth";

describe("auth helpers", () => {
  it("hashes and verifies passwords", () => {
    const password = "super-secret";
    const hash = hashPassword(password);

    expect(hash).toContain(":");
    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword("wrong", hash)).toBe(false);
  });

  it("creates deterministic token hash", () => {
    const token = newSessionToken();
    expect(hashSessionToken(token)).toBe(hashSessionToken(token));
  });

  it("builds secure cookie options", () => {
    const opts = cookieOptions(new Date("2026-03-10T00:00:00.000Z"));
    expect(opts).toContain("HttpOnly");
    expect(opts).toContain("SameSite=Lax");
    expect(opts).toContain("Expires=");
  });
});
