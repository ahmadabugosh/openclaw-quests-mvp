#!/usr/bin/env tsx
import { buildLaunchChecklist } from "../lib/launch";

async function run() {
  const domain = process.env.QUESTS_DOMAIN ?? "";
  const sslEnabled = process.env.QUESTS_SSL_ENABLED === "true";
  const seedDataReady = process.env.QUESTS_SEED_DATA_READY === "true";
  const smokeUrl = process.env.QUESTS_SMOKE_URL;

  let smokeTestPassed = false;

  if (smokeUrl) {
    try {
      const response = await fetch(smokeUrl);
      smokeTestPassed = response.ok;
    } catch {
      smokeTestPassed = false;
    }
  }

  const result = buildLaunchChecklist({
    domain,
    sslEnabled,
    seedDataReady,
    smokeTestPassed,
  });

  console.log(result.summary);
  for (const item of result.items) {
    console.log(`${item.done ? "✅" : "⬜"} ${item.label}`);
  }

  if (!result.readyToLaunch) {
    process.exitCode = 1;
  }
}

void run();
