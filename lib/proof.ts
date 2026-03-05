import crypto from "node:crypto";

export const PROOF_SCHEME = "ocq";

export type ProofChecks = {
  openclaw_running: boolean;
  openclaw_version: string;
  has_model_configured: boolean;
  model_provider: string | null;
  has_channel: boolean;
  channel_type: string | null;
  message_count: number;
  has_identity: boolean;
  agent_name: string | null;
  has_memory_files: boolean;
  cron_count: number;
  cron_has_run: boolean;
  has_web_search_usage: boolean;
  has_custom_skill: boolean;
  skill_count: number;
  has_twitter: boolean;
};

export type UnsignedProofPayload = {
  version: "1.0";
  timestamp: string;
  instance_id: string;
  checks: ProofChecks;
};

export type ProofPayload = UnsignedProofPayload & {
  signature: string;
};

export function signProofPayload(payload: UnsignedProofPayload, secret: string): string {
  const normalized = canonicalJson(payload);

  return crypto.createHmac("sha256", secret).update(normalized).digest("hex");
}

export function verifyProofSignature(payload: ProofPayload, secret: string): boolean {
  const expected = signProofPayload(stripSignature(payload), secret);

  return timingSafeEqualHex(payload.signature, expected);
}

export function encodeProofCode(payload: ProofPayload): string {
  const raw = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${PROOF_SCHEME}://${raw}`;
}

export function decodeProofCode(code: string): ProofPayload {
  const prefix = `${PROOF_SCHEME}://`;

  if (!code.startsWith(prefix)) {
    throw new Error("Invalid proof code scheme");
  }

  const raw = code.slice(prefix.length);
  const json = Buffer.from(raw, "base64url").toString("utf8");

  return JSON.parse(json) as ProofPayload;
}

function stripSignature(payload: ProofPayload): UnsignedProofPayload {
  return {
    version: payload.version,
    timestamp: payload.timestamp,
    instance_id: payload.instance_id,
    checks: payload.checks,
  };
}

function timingSafeEqualHex(left: string, right: string): boolean {
  try {
    const a = Buffer.from(left, "hex");
    const b = Buffer.from(right, "hex");

    if (a.length !== b.length) return false;

    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries
      .map(([key, val]) => `${JSON.stringify(key)}:${canonicalJson(val)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}
