# Bootstrap any LLM from the GitHub repo

```text
MISSION: One-shot agency-grade ad package via HarrisCrypto/ad-intelligence.

REPO:
  git clone https://github.com/HarrisCrypto/ad-intelligence.git
  cd ad-intelligence/skills/ad-intelligence

BEST PATH (pasteable):
  node scripts/build-context-pack.mjs
  # paste that entire output into system context, then send the brief

OR READ IN ORDER:
  1. prompts/one-shot.md
  2. references/package-skeleton.md
  3. SKILL.md
  4. Closest examples/* gold fixture for craft density

THEN RUN:
  node scripts/start-package.mjs --out packages/<brand>-ad.md
  node scripts/retrieve.mjs --niche <niche> --platform <platform> --limit 5
  # fill [[BRACKETS]]
  node scripts/lint-package.mjs packages/<brand>-ad.md   # until ok:true

Never invent proof. Never invent Seedance jobs. No chat-only brainstorms.
```
