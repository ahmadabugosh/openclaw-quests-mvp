# OpenClaw Quests MVP

## Quest Proof CLI (MVP prototype)

Generate a signed proof code:

```bash
npm run quests:check
```

Preview shared data without generating a signed code:

```bash
npm run quests:check:dry-run
```

Optional env var:

- `OPENCLAW_HOME` — path to OpenClaw home directory (defaults to `~/.openclaw`)

## Launch checklist helper

Run a quick deployment readiness check (domain, SSL, seed data, smoke test):

```bash
QUESTS_DOMAIN=quests.openclaw.ai \
QUESTS_SSL_ENABLED=true \
QUESTS_SEED_DATA_READY=true \
QUESTS_SMOKE_URL=https://quests.openclaw.ai/login \
npm run launch:checklist
```

See `docs/launch-checklist.md` for details.

## Railway deployment

This project is configured for Railway via `railway.toml`.

- Start command: `npm run start`
- Health check path: `/api/health`

Deploy with the provided automation script:

```bash
/root/.openclaw/workspace/scripts/railway-deploy-and-fix.sh .
```
