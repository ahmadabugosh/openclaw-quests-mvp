import { describe, expect, it } from "vitest";
import {
  PROOF_SCHEME,
  decodeProofCode,
  encodeProofCode,
  signProofPayload,
  verifyProofSignature,
  type ProofChecks,
  type ProofPayload,
} from "./proof";

const secret = "super-secret-instance-key";

const checks: ProofChecks = {
  openclaw_running: true,
  openclaw_version: "0.42.0",
  has_model_configured: true,
  model_provider: "openrouter",
  has_channel: true,
  channel_type: "telegram",
  message_count: 8,
  has_identity: true,
  agent_name: "Rose",
  has_memory_files: true,
  cron_count: 2,
  cron_has_run: true,
  has_web_search_usage: true,
  has_custom_skill: false,
  skill_count: 0,
  has_twitter: false,
};

describe("proof code", () => {
  it("encodes proof data to ocq:// URI", () => {
    const payload: ProofPayload = {
      version: "1.0",
      timestamp: "2026-03-05T12:00:00.000Z",
      instance_id: "abc123",
      checks,
      signature: signProofPayload(
        {
          version: "1.0",
          timestamp: "2026-03-05T12:00:00.000Z",
          instance_id: "abc123",
          checks,
        },
        secret,
      ),
    };

    const code = encodeProofCode(payload);
    expect(code.startsWith(`${PROOF_SCHEME}://`)).toBe(true);
  });

  it("decodes and validates a valid signed proof", () => {
    const unsigned = {
      version: "1.0",
      timestamp: "2026-03-05T12:00:00.000Z",
      instance_id: "abc123",
      checks,
    };

    const payload: ProofPayload = {
      ...unsigned,
      signature: signProofPayload(unsigned, secret),
    };

    const code = encodeProofCode(payload);
    const decoded = decodeProofCode(code);

    expect(decoded.instance_id).toBe("abc123");
    expect(verifyProofSignature(decoded, secret)).toBe(true);
  });

  it("rejects tampered payload", () => {
    const unsigned = {
      version: "1.0",
      timestamp: "2026-03-05T12:00:00.000Z",
      instance_id: "abc123",
      checks,
    };

    const payload: ProofPayload = {
      ...unsigned,
      signature: signProofPayload(unsigned, secret),
    };

    const code = encodeProofCode(payload);
    const decoded = decodeProofCode(code);
    decoded.checks.message_count = 999;

    expect(verifyProofSignature(decoded, secret)).toBe(false);
  });

  it("throws when the scheme is not ocq", () => {
    expect(() => decodeProofCode("http://abc")).toThrow("Invalid proof code scheme");
  });
});
