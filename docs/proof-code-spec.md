# Signed Proof Code Spec (MVP)

This document defines the MVP proof format used by Quests verification.

## Scheme

- Prefix: `ocq://`
- Body: Base64URL-encoded JSON payload

Example:

```text
ocq://eyJ2ZXJzaW9uIjoiMS4wIiwidGltZXN0YW1wIjoi..."
```

## Payload Shape

```json
{
  "version": "1.0",
  "timestamp": "2026-03-05T12:00:00.000Z",
  "instance_id": "abc123",
  "checks": {
    "openclaw_running": true,
    "openclaw_version": "0.42.0",
    "has_model_configured": true,
    "model_provider": "openrouter",
    "has_channel": true,
    "channel_type": "telegram",
    "message_count": 47,
    "has_identity": true,
    "agent_name": "Rose",
    "has_memory_files": true,
    "cron_count": 3,
    "cron_has_run": true,
    "has_web_search_usage": true,
    "has_custom_skill": true,
    "skill_count": 2,
    "has_twitter": false
  },
  "signature": "hmac_sha256_hex"
}
```

## Signature

- Algorithm: `HMAC-SHA256`
- Output encoding: lowercase hex
- Signed content: canonical JSON of payload **without** `signature`
- Canonicalization: recursively sorted object keys

## Verification Rules

1. Proof string must start with `ocq://`
2. Payload must decode as valid JSON
3. `signature` must match computed HMAC using the registered per-instance secret
4. If signature verifies, checks are evaluated into completed quest IDs

## Privacy

- No raw files, no API keys, no message bodies
- Only booleans, counts, provider/channel labels, and agent name
