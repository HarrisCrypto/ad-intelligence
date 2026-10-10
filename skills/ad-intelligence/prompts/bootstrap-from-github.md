# Bootstrap any LLM from the GitHub repo

Use this when the model does **not** already have `skills/ad-intelligence/` in context. Paste as the first user or system turn.

```text
MISSION: Ship agency-grade ad packages using HarrisCrypto/ad-intelligence.

REPO (required):
  git clone https://github.com/HarrisCrypto/ad-intelligence.git
  cd ad-intelligence/skills/ad-intelligence

LOAD (read in order — do not skip):
  1. SKILL.md
  2. prompts/harness-system-prompt.md
  3. references/elite-creative-os.md          ← craft bar (type/grade/motion/endcard)
  4. references/production-finish-spec.md    ← CapCut custom-template finish
  5. pipelines/one-stop-ad-maker.md
  6. references/output-template.md
  7. One gold fixture closest to the niche in examples/
  8. If no Seedance/Higgsfield: creative-stack/assembler-pipeline.md
     + creative-stack/alternative-model-routing.md

CALL TOOLS (from this directory):
  node scripts/retrieve.mjs --niche <niche|alias> --platform <platform> --limit 5
  # after drafting the package file:
  node scripts/lint-package.mjs path/to/package.md
  # optional health check:
  node scripts/demo-quality-gates.mjs

DELIVER:
  Full output-template.md including **Craft system** (palette, type, motion, sound, endcard).
  Package must feel like a custom motion template from a top creative shop — not vibes.
  Never invent proof. Never invent Seedance job ids. One CTA. Muted-first.
  Dual-track default for serious brands.

If clone is impossible in this environment: ask the user to open/clone the repo
or paste SKILL.md + elite-creative-os.md + output-template.md into context,
then continue. Do not freestyle a weaker parallel system.
```

## Cursor / plugin

Prefer installing the plugin from `https://github.com/HarrisCrypto/ad-intelligence` so `/ad-intelligence` loads `SKILL.md` automatically — still run `retrieve.mjs` and `lint-package.mjs` from the skill root.
