import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildProofPayload,
  collectProofChecks,
  formatDryRunPreview,
  getOrCreateInstanceSecret,
} from "./quests-check";
import { decodeProofCode, verifyProofSignature } from "./proof";

const tempDirs: string[] = [];

function createOpenClawHome(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ocq-test-"));
  tempDirs.push(dir);

  fs.mkdirSync(path.join(dir, "skills", "custom-skill"), { recursive: true });
  fs.mkdirSync(path.join(dir, "memory"), { recursive: true });
  fs.mkdirSync(path.join(dir, "sessions"), { recursive: true });
  fs.writeFileSync(path.join(dir, "MEMORY.md"), "hello memory");
  fs.writeFileSync(path.join(dir, "IDENTITY.md"), "Name: Testy");
  fs.writeFileSync(path.join(dir, "VERSION"), "0.42.0");
  fs.writeFileSync(
    path.join(dir, "config.json"),
    JSON.stringify(
      {
        model: {
          provider: "openrouter",
          name: "openai/gpt-4.1-mini",
        },
        channels: {
          telegram: {
            enabled: true,
          },
        },
        integrations: {
          twitter: {
            enabled: true,
          },
        },
      },
      null,
      2,
    ),
  );
  fs.writeFileSync(path.join(dir, "gateway.pid"), "123");
  fs.writeFileSync(
    path.join(dir, "cron-jobs.json"),
    JSON.stringify([
      { enabled: true, lastStatus: "ok" },
      { enabled: true, lastStatus: "error" },
    ]),
  );
  fs.writeFileSync(
    path.join(dir, "sessions", "s1.json"),
    JSON.stringify({
      messages: [
        { role: "user", content: "hi" },
        { role: "user", content: "search the web" },
        { role: "assistant", content: "ok" },
        { role: "user", content: "one more" },
      ],
      toolUses: [{ tool: "web_search" }],
    }),
  );

  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("openclaw quests check helpers", () => {
  it("collects expected proof checks from local OpenClaw home", () => {
    const home = createOpenClawHome();

    const checks = collectProofChecks(home);

    expect(checks.openclaw_running).toBe(true);
    expect(checks.openclaw_version).toBe("0.42.0");
    expect(checks.has_model_configured).toBe(true);
    expect(checks.model_provider).toBe("openrouter");
    expect(checks.has_channel).toBe(true);
    expect(checks.channel_type).toBe("telegram");
    expect(checks.message_count).toBe(3);
    expect(checks.has_identity).toBe(true);
    expect(checks.agent_name).toBe("Testy");
    expect(checks.has_memory_files).toBe(true);
    expect(checks.cron_count).toBe(2);
    expect(checks.cron_has_run).toBe(true);
    expect(checks.has_web_search_usage).toBe(true);
    expect(checks.has_custom_skill).toBe(true);
    expect(checks.skill_count).toBe(1);
    expect(checks.has_twitter).toBe(true);
  });

  it("creates stable secret and signs generated proof", () => {
    const home = createOpenClawHome();

    const first = getOrCreateInstanceSecret(home);
    const second = getOrCreateInstanceSecret(home);

    expect(first).toBe(second);

    const built = buildProofPayload(home);
    const decoded = decodeProofCode(built.code);

    expect(decoded.instance_id).toBeTruthy();
    expect(verifyProofSignature(decoded, first)).toBe(true);
  });

  it("formats dry-run preview without a proof URI", () => {
    const home = createOpenClawHome();

    const preview = formatDryRunPreview(home);

    expect(preview).toContain('"checks"');
    expect(preview).toContain('"instance_id"');
    expect(preview).not.toContain("ocq://");
  });
});
