import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { encodeProofCode, signProofPayload, type ProofChecks, type ProofPayload, type UnsignedProofPayload } from "./proof";

export function resolveOpenClawHome(customHome?: string): string {
  return customHome ?? process.env.OPENCLAW_HOME ?? path.join(os.homedir(), ".openclaw");
}

export function getOrCreateInstanceSecret(customHome?: string): string {
  const home = resolveOpenClawHome(customHome);
  const secretPath = path.join(home, ".quest-secret");

  ensureDir(home);

  if (fs.existsSync(secretPath)) {
    return fs.readFileSync(secretPath, "utf8").trim();
  }

  const secret = crypto.randomBytes(32).toString("hex");
  fs.writeFileSync(secretPath, secret, { mode: 0o600 });
  return secret;
}

export function getOrCreateInstanceId(customHome?: string): string {
  const home = resolveOpenClawHome(customHome);
  const idPath = path.join(home, ".quest-instance-id");

  ensureDir(home);

  if (fs.existsSync(idPath)) {
    return fs.readFileSync(idPath, "utf8").trim();
  }

  const instanceId = crypto.randomUUID();
  fs.writeFileSync(idPath, instanceId, { mode: 0o600 });
  return instanceId;
}

export function collectProofChecks(customHome?: string): ProofChecks {
  const home = resolveOpenClawHome(customHome);
  const config = readJsonIfExists<Record<string, unknown>>(path.join(home, "config.json")) ?? {};
  const version = readTextIfExists(path.join(home, "VERSION")) ?? "unknown";

  const provider = readModelProvider(config);
  const channels = readEnabledChannels(config);
  const skillCount = countCustomSkills(path.join(home, "skills"));

  const sessionStats = collectSessionStats(path.join(home, "sessions"));
  const cronStats = collectCronStats(path.join(home, "cron-jobs.json"));

  return {
    openclaw_running: fs.existsSync(path.join(home, "gateway.pid")),
    openclaw_version: version,
    has_model_configured: Boolean(provider),
    model_provider: provider,
    has_channel: channels.length > 0,
    channel_type: channels[0] ?? null,
    message_count: sessionStats.userMessageCount,
    has_identity: fs.existsSync(path.join(home, "IDENTITY.md")),
    agent_name: readAgentName(path.join(home, "IDENTITY.md")),
    has_memory_files:
      hasFileWithContent(path.join(home, "MEMORY.md")) ||
      hasFileWithContent(path.join(home, "USER.md")),
    cron_count: cronStats.enabledCronCount,
    cron_has_run: cronStats.hasSuccessfulRun,
    has_web_search_usage: sessionStats.hasWebSearchUsage,
    has_custom_skill: skillCount > 0,
    skill_count: skillCount,
    has_twitter: isTwitterConfigured(config),
  };
}

export function buildProofPayload(customHome?: string): { payload: ProofPayload; code: string } {
  const home = resolveOpenClawHome(customHome);
  const checks = collectProofChecks(home);
  const secret = getOrCreateInstanceSecret(home);

  const unsigned: UnsignedProofPayload = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    instance_id: getOrCreateInstanceId(home),
    checks,
  };

  const payload: ProofPayload = {
    ...unsigned,
    signature: signProofPayload(unsigned, secret),
  };

  return {
    payload,
    code: encodeProofCode(payload),
  };
}

export function formatDryRunPreview(customHome?: string): string {
  const home = resolveOpenClawHome(customHome);
  const checks = collectProofChecks(home);

  return JSON.stringify(
    {
      version: "1.0",
      timestamp: new Date().toISOString(),
      instance_id: getOrCreateInstanceId(home),
      checks,
      note: "dry-run preview only; no signature or proof code generated",
    },
    null,
    2,
  );
}

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readTextIfExists(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8").trim();
}

function hasFileWithContent(filePath: string): boolean {
  const content = readTextIfExists(filePath);
  return Boolean(content && content.length > 0);
}

function readJsonIfExists<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

function readModelProvider(config: Record<string, unknown>): string | null {
  const model = config.model as Record<string, unknown> | undefined;
  const provider = model?.provider;
  return typeof provider === "string" && provider.trim() ? provider.trim() : null;
}

function readEnabledChannels(config: Record<string, unknown>): string[] {
  const channels = config.channels as Record<string, unknown> | undefined;
  if (!channels) return [];

  return Object.entries(channels)
    .filter(([, value]) => {
      if (typeof value === "boolean") return value;
      if (!value || typeof value !== "object") return false;
      const maybeEnabled = (value as Record<string, unknown>).enabled;
      return maybeEnabled === true;
    })
    .map(([key]) => key);
}

function countCustomSkills(skillsDir: string): number {
  if (!fs.existsSync(skillsDir)) return 0;

  const defaultSkillNames = new Set(["mode-switch"]);

  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !defaultSkillNames.has(name)).length;
}

function readAgentName(identityPath: string): string | null {
  const identity = readTextIfExists(identityPath);
  if (!identity) return null;

  const line = identity
    .split(/\r?\n/)
    .find((item) => item.trim().toLowerCase().startsWith("name:"));

  if (!line) return null;

  const value = line.split(":").slice(1).join(":").trim();
  return value || null;
}

function collectCronStats(cronPath: string): { enabledCronCount: number; hasSuccessfulRun: boolean } {
  const jobs = readJsonIfExists<Array<Record<string, unknown>>>(cronPath) ?? [];

  let enabledCronCount = 0;
  let hasSuccessfulRun = false;

  for (const job of jobs) {
    if (job.enabled === true) enabledCronCount += 1;
    if (job.lastStatus === "ok") hasSuccessfulRun = true;
  }

  return { enabledCronCount, hasSuccessfulRun };
}

function collectSessionStats(sessionsDir: string): { userMessageCount: number; hasWebSearchUsage: boolean } {
  if (!fs.existsSync(sessionsDir)) {
    return { userMessageCount: 0, hasWebSearchUsage: false };
  }

  let userMessageCount = 0;
  let hasWebSearchUsage = false;

  for (const entry of fs.readdirSync(sessionsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;

    const payload = readJsonIfExists<Record<string, unknown>>(path.join(sessionsDir, entry.name));
    if (!payload) continue;

    const messages = Array.isArray(payload.messages) ? payload.messages : [];
    for (const message of messages) {
      if (message && typeof message === "object" && (message as Record<string, unknown>).role === "user") {
        userMessageCount += 1;
      }
    }

    const toolUses = Array.isArray(payload.toolUses) ? payload.toolUses : [];
    for (const toolUse of toolUses) {
      if (!toolUse || typeof toolUse !== "object") continue;
      const toolName = (toolUse as Record<string, unknown>).tool;
      if (toolName === "web_search") {
        hasWebSearchUsage = true;
      }
    }
  }

  return { userMessageCount, hasWebSearchUsage };
}

function isTwitterConfigured(config: Record<string, unknown>): boolean {
  const integrations = config.integrations as Record<string, unknown> | undefined;
  const twitter = integrations?.twitter;

  if (!twitter || typeof twitter !== "object") return false;

  const enabled = (twitter as Record<string, unknown>).enabled;
  return enabled === true;
}
