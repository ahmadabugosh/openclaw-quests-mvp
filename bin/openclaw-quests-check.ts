#!/usr/bin/env node

import { buildProofPayload, formatDryRunPreview, resolveOpenClawHome } from "../lib/quests-check";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

try {
  const home = resolveOpenClawHome();

  if (dryRun) {
    console.log(`# OpenClaw quests proof dry-run (${home})`);
    console.log(formatDryRunPreview(home));
    process.exit(0);
  }

  const { code } = buildProofPayload(home);

  console.log(code);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Failed to generate quest proof: ${message}`);
  process.exit(1);
}
