# How to get your agent to use Ad Intelligence

**Own GitHub repo (recommended):** `https://github.com/HarrisCrypto/ad-intelligence`  
(Create that empty repo if it does not exist yet — see [`PUBLISH.md`](./PUBLISH.md).)

Until it is published there, the package also lives temporarily under
`HarrisCrypto/Union-Jack-Rebuild-/ad-intelligence/` on branch
`cursor/ad-intelligence-skill-3683` and will be removed from Union Jack once
the standalone repo is live.

## Creative stack (Seedance / Higgsfield / peers)

The skill is a **one-stop ad maker**: it routes Seedance 2.0/2.5, Higgsfield
(Ads Studio, UGC, Marketing Studio, Ad Multiplier, Katana, product photoshoot),
Kling, Runway, CapCut, Meta/TikTok, ElevenLabs, Suno, and more.

- Connected tools → agent should call them  
- Not connected → agent still emits Seedance/Higgsfield-grade prompts & briefs  

Docs: `skills/ad-intelligence/references/creative-stack/` ·  
`skills/ad-intelligence/pipelines/one-stop-ad-maker.md`

## Fastest path (this repo)

The skill is linked at:

```text
.cursor/skills/ad-intelligence  →  ad-intelligence/skills/ad-intelligence
```

**Any Cursor agent working in this repo** can discover it automatically.

### Use it in chat

1. Open Agent chat in this project.
2. Type `/ad-intelligence` **or** just ask:  
   `Using the ad-intelligence skill, create a viral TikTok + premium hero film for …`
3. For a whole session, turn the skill into a **Custom Mode** (Option/Alt+Enter on the skill) so it stays on.

### Force it every time (optional rule)

Add a project rule, e.g. `.cursor/rules/ads.mdc`:

```markdown
---
description: Always use Ad Intelligence for creative work
alwaysApply: false
---
When the user asks for ads, creatives, hooks, scripts, UGC, TikTok/Meta/YouTube
ads, or launch films: read and follow `.cursor/skills/ad-intelligence/SKILL.md`,
run `node scripts/retrieve.mjs` from that skill directory, and pass the
first-time-right checklist before delivering.
```

## Install from GitHub (point any Cursor at it)

Cursor installs **plugins** from GitHub (not bare skill folders). The package
root already has `.cursor-plugin/marketplace.json`.

1. In Cursor: **Customize → From GitHub Repository**
2. Paste: `https://github.com/HarrisCrypto/ad-intelligence`  
   (or the Union Jack path only while waiting for publish)
3. Install the **ad-intelligence** plugin
4. Confirm it appears under **Customize → Skills**

## Use with Cloud Agents

- **Project skill (recommended):** keep `.cursor/skills/ad-intelligence` in the
  repo so every Cloud Agent clone gets it.
- **Personal skill sync:** copy the skill into `~/.cursor/skills/ad-intelligence`
  and enable **Settings → Agents → Sync Skills for Cloud Agents**.

## Use with Hermes / Manus / custom harnesses

Skills are files. Mount or clone the skill directory into the agent’s workspace,
then prepend the system prompt in
[`skills/ad-intelligence/prompts/harness-system-prompt.md`](./skills/ad-intelligence/prompts/harness-system-prompt.md).

Minimal harness loop:

```bash
git clone https://github.com/HarrisCrypto/Union-Jack-Rebuild-.git
cd Union-Jack-Rebuild-/ad-intelligence/skills/ad-intelligence
node scripts/retrieve.mjs --niche <niche> --tag viral --limit 5
# feed JSON + SKILL.md into the model; require output-template.md
```

## Creative stack

This skill routes **Seedance**, **Higgsfield**, Kling, Runway, CapCut, Meta/TikTok, ElevenLabs, Suno, and peers — see `skills/ad-intelligence/references/creative-stack/` and `pipelines/one-stop-ad-maker.md`.

## Verify it’s loaded

```bash
cd ad-intelligence/skills/ad-intelligence
node scripts/retrieve.mjs --list | head
node scripts/retrieve.mjs --niche beauty --tag viral --limit 3
```

In Cursor chat: `/ad-intelligence` should resolve. Ask for an ad and confirm the
reply cites **pattern ids** and a **QA checklist** — if it doesn’t, tell the
agent explicitly: *Follow the ad-intelligence skill and output template.*

## What “point my agent at it” means in practice

| Setup | What you do |
| --- | --- |
| Working in this repo | Nothing extra — skill is already linked |
| Other Cursor projects | Install plugin from this GitHub repo (or a dedicated fork) |
| Cloud Agents | Keep skill in repo **or** sync personal skills |
| Non-Cursor LLM harness | Clone path + paste harness system prompt + run retrieve CLI |

You do **not** need a separate hosted database for the pattern skill to work.
Optional later: private vector DB of live ad breakdowns (see `ingest/README.md`).
