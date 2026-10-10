# Bootstrap any LLM from the GitHub repo

```text
MISSION: One-shot agency-grade ad package via HarrisCrypto/ad-intelligence.

REPO:
  git clone https://github.com/HarrisCrypto/ad-intelligence.git
  cd ad-intelligence

READY:
  node skills/ad-intelligence/scripts/agent-ready.mjs

BEST PATH (pasteable, any LLM):
  node skills/ad-intelligence/scripts/build-context-pack.mjs
  # paste output into system context, then send the brief

OR skill loaders:
  Cursor → .cursor/skills/ad-intelligence
  Claude Code → .claude/skills/ad-intelligence
  Copilot → .github/skills/ad-intelligence
  Others → .agents/skills/ad-intelligence or AGENTS.md

THEN:
  node skills/ad-intelligence/scripts/probe-harness.mjs
  # fill tool card → choose rung
  # URL? node skills/ad-intelligence/scripts/brief-from-url.mjs <url>
  cd skills/ad-intelligence
  node scripts/start-package.mjs --out packages/<brand>-ad.md
  node scripts/retrieve.mjs --niche <niche> --platform <platform> --limit 5 --compact
  # Attention Lab + emulate model timing
  # fill [[BRACKETS]]
  node scripts/lint-package.mjs packages/<brand>-ad.md   # until ok:true

Never invent proof. Never invent Seedance jobs. No chat-only brainstorms.
```
