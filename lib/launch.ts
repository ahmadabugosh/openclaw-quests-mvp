export type LaunchChecklistInput = {
  domain: string;
  sslEnabled: boolean;
  seedDataReady: boolean;
  smokeTestPassed: boolean;
};

export type LaunchChecklistItem = {
  id: "domain" | "ssl" | "seed" | "smoke";
  label: string;
  done: boolean;
};

export type LaunchChecklistResult = {
  items: LaunchChecklistItem[];
  completed: number;
  total: number;
  readyToLaunch: boolean;
  summary: string;
};

export function buildLaunchChecklist(input: LaunchChecklistInput): LaunchChecklistResult {
  const items: LaunchChecklistItem[] = [
    {
      id: "domain",
      label: input.domain ? `Domain configured (${input.domain})` : "Domain configured",
      done: Boolean(input.domain),
    },
    {
      id: "ssl",
      label: "SSL certificate active",
      done: input.sslEnabled,
    },
    {
      id: "seed",
      label: "Seed data loaded",
      done: input.seedDataReady,
    },
    {
      id: "smoke",
      label: "Smoke test passed",
      done: input.smokeTestPassed,
    },
  ];

  const completed = items.filter((item) => item.done).length;
  const total = items.length;

  return {
    items,
    completed,
    total,
    readyToLaunch: completed === total,
    summary: `Launch checklist: ${completed}/${total} complete`,
  };
}
