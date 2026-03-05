# Launch Checklist (MVP)

Use this before announcing the app publicly.

## 1) Domain
- Configure custom domain (recommended: `quests.openclaw.ai`)
- Point DNS to Railway target

## 2) SSL
- Ensure Railway issued TLS certificate
- Verify `https://` endpoint loads without warnings

## 3) Seed Data
- Ensure quest content is seeded and visible for a fresh account
- Mark readiness with `QUESTS_SEED_DATA_READY=true`

## 4) Smoke Test
- Validate deployed app returns 200 from the dedicated health URL (`/api/health`)
- Run checklist command with `QUESTS_SMOKE_URL`

## Automation Helper

```bash
QUESTS_DOMAIN=quests.openclaw.ai \
QUESTS_SSL_ENABLED=true \
QUESTS_SEED_DATA_READY=true \
QUESTS_SMOKE_URL=https://quests.openclaw.ai/login \
npm run launch:checklist
```

The command exits non-zero if any launch gate is incomplete.
