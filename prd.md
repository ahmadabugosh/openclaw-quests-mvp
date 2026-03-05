# PRD: OpenClaw Quests MVP — Egg to Hatched 🥚→🦞

## Overview

A gamified onboarding experience where new OpenClaw users hatch their AI agent by completing real setup tasks. Users start with an egg, complete a checklist of verified tasks, and "hatch" their claw creature — earning a shareable badge and a fully configured OpenClaw instance.

**Scope:** Just the first evolution stage. One checklist. One reward. Ship it.

## The Experience

### User Flow

1. User signs up → sees their **egg** on a simple dashboard
2. Egg has a progress ring around it showing % complete
3. Dashboard is split-screen: egg + checklist on the LEFT, active quest content on the RIGHT
4. Right side shows: tutorial video + written steps + "Verify" button
5. User completes task on their VPS, runs `openclaw quests check`, pastes proof code
6. As tasks complete, the egg cracks progressively (visual feedback)
7. At 10/12 tasks: **hatching animation** → their unique baby claw appears 🦞
8. They get a shareable badge/card + public profile link

### UI Layout

```
┌─────────────────────────────────────────────────────┐
│  LEFT SIDE (40%)          │  RIGHT SIDE (60%)        │
│                           │                          │
│   🥚 Your Agent           │  Quest 3: Choose a Brain │
│   [egg with cracks]       │                          │
│                           │  📺 [Tutorial video]     │
│   ████████░░ 4/12         │  "How to set up your     │
│                           │   AI model & API keys"   │
│   ✅ Open Terminal        │                          │
│   ✅ Give It a Home       │  📝 Written steps:       │
│   → Choose a Brain        │  1. Go to openrouter.ai  │
│   ○ Teach It to Talk      │  2. Create account...    │
│   ○ First Conversation    │  3. Copy API key...      │
│   ○ ...                   │                          │
│                           │  ┌──────────────────┐    │
│                           │  │ Paste your proof  │    │
│                           │  │ code to verify:   │    │
│                           │  │ [________] [✓]    │    │
│                           │  └──────────────────┘    │
└─────────────────────────────────────────────────────┘
```

**Left side:** Egg/creature + checklist (always visible, shows progress)
**Right side:** Active quest — video tutorial + written guide + verify input
**Mobile:** Stacks vertically — egg on top (smaller), quest content below, checklist as collapsible sidebar

### The Checklist (The "Incubation Tasks")

Each task is a real OpenClaw setup step. Ordered from easiest to hardest:

| # | Task | What They Do | Proof Code Checks |
|---|------|-------------|-------------------|
| 1 | **Open the Terminal** | SSH into their VPS for the first time | OpenClaw process is running |
| 2 | **Give It a Home** | Install OpenClaw on their VPS | OpenClaw version detected |
| 3 | **Choose a Brain** | Pick an AI model + set up API keys (OpenRouter, Anthropic, etc.) | Valid model + provider key configured |
| 4 | **Teach It to Talk** | Connect a messaging channel (Telegram, Discord, etc.) | Channel config exists and is active |
| 5 | **First Conversation** | Send 5 messages to your agent | Session history has 5+ user messages |
| 6 | **Name Your Agent** | Set a name in IDENTITY.md | IDENTITY.md exists with a name |
| 7 | **Memory Lane** | Create a MEMORY.md or USER.md file | File exists with content |
| 8 | **Time Keeper** | Set up your first cron job | 1+ enabled cron job exists |
| 9 | **Web Explorer** | Ask your agent to search the web | Session history contains web_search tool use |
| 10 | **The Automator** | Create a cron job that runs automatically | 1+ cron job with lastStatus = "ok" |
| 11 | **Skill Collector** | Install a skill from ClawHub | Non-default skill in skills directory |
| 12 | **Go Social** | Connect your agent to X/Twitter | Twitter/X credentials configured |

**Minimum to hatch:** 10/12 tasks (allows skipping 2 hard ones)

### Quest Content (Per Task)

Each quest page includes:
1. **Tutorial video (2-3 min)** — Walkthrough of the step (also serves as YouTube content)
2. **Written guide** — Step-by-step text with screenshots
3. **Blog post link** — Deep dive on resources.learnopenclaw.ai (drives SEO)
4. **Verify input** — Paste proof code field + verify button

### Visual Progression

```
0%   — Perfect egg, no cracks
25%  — Tiny crack appears, egg wobbles occasionally  
50%  — Multiple cracks, glowing from inside
75%  — Large cracks, claw peeking through
100% — HATCH! Animated reveal of baby claw creature
```

### The Hatch Reward

When hatched, the user gets:

1. **Unique Baby Claw** — Generated based on their choices:
   - Color based on first channel connected (Telegram = blue, Discord = purple, etc.)
   - Accessory based on first cron job type (clock for time-based, magnifying glass for search, etc.)
   - Expression based on SOUL.md tone (cheerful, serious, playful, etc.)

2. **Shareable Badge Card** — A beautiful card image showing:
   - Their claw creature
   - Agent name
   - "Hatched on [date]"
   - "OpenClaw Operator — Level 1"
   - QR code linking to their public profile

3. **Public Profile Page** — `quests.openclaw.ai/u/[username]`
   - Shows their claw creature
   - Tasks completed
   - "Hatch your own → openclaw.ai" CTA
   - (Future: evolution stages will show here)

## Technical Architecture

### Stack
- **Frontend:** Next.js with Tailwind CSS
- **Backend:** Node.js/Express API
- **Database:** SQLite (same pattern as LMS MVP)
- **Auth:** GitHub OAuth (developers already have accounts) + email/password fallback
- **Hosting:** Railway

### Core Models

```
users
  - id, email, username, github_id
  - agent_name, hatch_date, creature_data (JSON)
  - created_at

quest_progress  
  - id, user_id, quest_id
  - status (locked/available/completed)
  - completed_at, verification_data (JSON)
```

### Verification System — Signed Proof Code

**No open ports. No public endpoints. No firewall headaches.**

The user's OpenClaw instance never needs to be publicly accessible. Instead:

#### How It Works

**Step 1:** User runs a local command on their VPS:
```bash
openclaw quests check
```

**Step 2:** The command scans the local OpenClaw installation and generates a **signed proof string**:
```
ocq://eyJjcm9uX2NvdW50IjozLCJoYXNfY2hhbm5lbCI6dHJ1ZSwi...base64...
```

The proof contains:
```json
{
  "version": "1.0",
  "timestamp": "2026-03-05T12:00:00Z",
  "instance_id": "abc123",  // unique per install, no private data
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
  "signature": "hmac_sha256_of_above"
}
```

**Step 3:** User pastes the proof code into the quest platform.

**Step 4:** Platform decodes, verifies signature, checks which quests are now complete, updates progress.

#### Signature Verification

- On first `openclaw quests check`, a random **instance secret** is generated and stored locally at `~/.openclaw/.quest-secret`
- The secret is also registered with the platform during initial signup/connection (one-time)
- All subsequent proof codes are HMAC-signed with this secret
- Platform verifies signature to prevent fabricated proof codes

#### Privacy

- **No file contents** are ever included — only boolean checks and counts
- **No message contents** — only message count
- **No API keys** — only "has_model_configured: true/false"
- **Agent name** included (needed for creature generation) — user can see exactly what's shared
- Running `openclaw quests check --dry-run` shows what would be shared before generating the code

#### Why This Approach

- ✅ Works behind NAT, firewalls, no port forwarding needed
- ✅ No persistent connection between platform and user's VPS
- ✅ User has full control — they choose when to generate and share proof
- ✅ Tamper-resistant via HMAC signature
- ✅ Beginner-friendly — just one command + paste
- ❌ Not real-time (user must manually run + paste) — acceptable for MVP
- 🔮 V2 can add optional auto-sync endpoint for power users

### Creature Generation

Simple rule-based system (no AI needed for MVP):

```javascript
function generateCreature(completionData) {
  return {
    baseColor: channelToColor(completionData.channelType), // telegram→blue, discord→purple
    accessory: cronToAccessory(completionData.firstCronType), // search→magnifying glass
    expression: soulToExpression(completionData.soulTone), // cheerful→smile
    pattern: Math.floor(Math.random() * 8), // 8 shell patterns
    eyeStyle: Math.floor(Math.random() * 5), // 5 eye variants
  }
}
```

Renders as SVG for crisp scaling + easy badge generation.

## Pages

1. **Landing** (`/`) — Hero with egg animation, "Start Hatching" CTA, example hatched creatures
2. **Dashboard** (`/dashboard`) — Split-screen: egg + checklist (left) + active quest (right)
3. **Quest Detail** (`/quest/:id`) — Loaded in the right panel: video + steps + verify input
4. **Hatch!** (`/hatch`) — The hatching animation + reward reveal
5. **Profile** (`/u/:username`) — Public shareable profile
6. **Badge** (`/u/:username/badge`) — OG image for social sharing
7. **Auth** (`/login`, `/register`) — GitHub OAuth + email/password

## MVP Scope — What's IN vs OUT

### ✅ IN (V1)
- Egg → Hatched (single evolution stage)
- 12 quest checklist with tutorial content per quest
- Signed proof code verification (no open ports needed)
- Split-screen dashboard (egg left, quest content right)
- Video + written guide per quest
- Simple creature generation (SVG, rule-based)
- Shareable badge card (image)
- Public profile page
- GitHub OAuth + email auth
- Mobile-responsive (stacked layout)

### ❌ OUT (Future)
- Auto-verify via live endpoint (V2)
- Further evolution stages (Scout, Operator, Commander, Autonomous)
- NFT minting
- LinkedIn badge integration
- Leaderboards / streaks
- Clans / social features
- Boss battles
- World map UI
- Skill tree branching
- Community quests

## Task Breakdown

### Phase 1: Foundation (8 tasks)
- [x] Initialize Next.js project with Tailwind
- [x] Set up SQLite database + models (users, quest_progress)
- [ ] Implement GitHub OAuth + email/password auth
- [x] Create landing page with egg hero animation
- [x] Build split-screen dashboard layout (egg + checklist left, quest panel right)
- [x] Build quest detail panel with video embed + written steps + verify input
- [x] Create quest content (video placeholder + written guide) for all 12 quests
- [ ] Set up Railway deployment

### Phase 2: Verification Engine (7 tasks)
- [x] Design proof code format + HMAC signing spec
- [ ] Build `openclaw quests check` CLI command (scans local instance, generates signed proof)
- [ ] Build `openclaw quests check --dry-run` to preview shared data
- [x] Build proof code decoder + signature verification on platform backend
- [x] Implement quest completion logic (proof data → which quests pass)
- [x] Add quest progress state management + persistence
- [x] Progress calculation + egg crack stage logic (0/25/50/75/100%)

### Phase 3: Creature & Rewards (6 tasks)
- [x] Design SVG claw creature with swappable traits (color, accessory, expression, pattern, eyes)
- [x] Build creature generation function (completion data → traits)
- [x] Create hatching animation (CSS/JS)
- [x] Generate shareable badge card (SVG → PNG via API)
- [x] Build public profile page (`/u/:username`)
- [x] Add OG meta tags for social sharing previews

### Phase 4: Polish & Launch (5 tasks)
- [x] Quest instructions + help links for each task
- [x] Error states, empty states, loading states
- [x] Mobile responsive pass (stacked layout)
- [x] Analytics (page views + completion funnel)
- [ ] Launch checklist: domain, SSL, seed data, smoke test

**Total: 26 tasks**
**Estimated effort: RALPH can handle this in one loop**

## Success Metrics

- **Hatch rate:** % of signups that complete hatching (target: 30%+)
- **Time to hatch:** Average days from signup to hatch (target: <7 days)
- **Share rate:** % of hatched users who share badge (target: 15%+)
- **Referral rate:** New signups from shared profile pages

## Open Questions

1. **Domain:** `quests.openclaw.ai`? `hatch.openclaw.ai`?
2. **Creature art style:** Pixel art? Cute vector? Realistic? (Recommend cute vector SVG)
3. **Video content:** Record fresh tutorials or embed existing YouTube content?
4. **`openclaw quests check` command:** Needs to be contributed to OpenClaw core — who builds this?
5. **Minimum OpenClaw version:** What version do we target?

## Future Vision (Post-MVP)

Once Egg → Hatched is working and people are sharing badges:

- **V2:** Auto-verify via optional live endpoint + 2-3 more evolution stages
- **V3:** NFT minting at each evolution + LinkedIn badge API
- **V4:** Leaderboards, streaks, clans
- **V5:** World map UI, boss battles, community quests

Each version builds on proven engagement from the previous one. Ship, measure, iterate.
