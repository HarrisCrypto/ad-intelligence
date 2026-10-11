---
name: ad-intelligence
description: >-
  Writes one shoot-ready ad package in a single pass for any niche (beauty/hair,
  food, SaaS/AI agents, local, ecommerce…): probe harness tools, equalize to a
  pipeline rung, retrieve viral/pro/award studies, research public ad libraries,
  emulate structure (never copy), build like a human with real tools, concept,
  muted-first hook, dense beat sheet with exact words, craft (design/layout/cut/
  timing/shots/animation), and generator prompts. Use for ads, TikTok, Reels,
  Shorts, Meta, Instagram, X, YouTube, LinkedIn, UGC, URL briefs, or AI slop.
  Works in Cursor, Claude Code, Codex, Gemini, OpenClaw, Copilot — with or without
  Higgsfield. Probe → study → emulate → human_build → ≥6 beats → finish-the-cut → lint.
compatibility: Requires Node 18+ for scripts. Optional network for URL brief + libraries. MCP video tools optional (connected rung).
metadata:
  version: "3.20.0"
  open_standard: agentskills
---

# Ad Intelligence — one-shot ad maker

**Do not brainstorm.** Top agents: **probe tools → degradation rung → style selection → study → emulate → human_build → skeleton → finish-the-cut (full duration + audio) → lint green.**

## When to use

Ads, creatives, hooks, UGC, Meta/TikTok/Instagram/X/YouTube, “ads for my site,” or “make this not look AI.”

## ONE-SHOT (mandatory)

1. `node scripts/probe-harness.mjs` → tool card + **hardware/ceiling** ([`harness-equalization.md`](prompts/harness-equalization.md)) → pick rung via [`degradation-ladder.md`](references/creative-stack/degradation-ladder.md) (**never default to stills if any video tool is available**)
2. URL/site? → `brief-from-url.mjs` then **`brand-harvest.mjs <url>`** (Gate 2.5 — lock palette/mascot/CTA from the site; never invent)
3. **Style selection** — [`style-selection-engine.md`](references/creative-stack/style-selection-engine.md): clarifying questions (tone / proof / platform / funnel / tier) → niche → pattern → visual system → prompt contract **before** retrieve
4. **Materials** — [`library/footage/RULE.md`](../../library/footage/RULE.md): `assert-assets.mjs --niche …` (bucket-eligible **video** only). Gaps → `acquire-footage.mjs` / `fill-niche-gaps.mjs` (Coverr/Mixkit + motion/subject gates). Stills never fill footage slots. Then gen/i2v via [`alternative-model-routing.md`](references/creative-stack/alternative-model-routing.md) · [`external-resources.md`](references/external-resources.md). Disclose ceiling before designing cards on a void.
5. Provision fonts from [`library/typography/`](../../library/typography/); beds/SFX from [`library/sound/`](../../library/sound/) + [`license-ledger.json`](../../library/assets/license-ledger.json)
6. `start-package.mjs` → `retrieve.mjs --compact` — open **`gold_fixtures`** + study-card **shot recipes / `footage_bucket` / asset_ids** (retrieval always follows style selection)
7. **Assemble like a human** — [`human-assembly-playbook.md`](references/human-assembly-playbook.md): `assemble-plan.mjs --card …` → place bucket clips + UI + audio on the timeline **before** optional gen ([`human-build-os.md`](references/human-build-os.md))
8. Emulate study structure → Concept → ≥6 exact-VO rows → Craft with **photographed/ledgered setups** (hard cuts between setups)
9. Lint until `"ok": true` → **finish-the-cut** (full duration + licensed audio) → `pipeline/qa/run-qa.mjs` on the export
10. Deliver package + human-build log + real job ids + QA JSON + attributions (not hook-only, not silent)

Ready check: `node scripts/agent-ready.mjs`  
No shell: paste [`prompts/context-pack-lite.md`](prompts/context-pack-lite.md) · offline [`retrieve-offline-compact.json`](references/retrieve-offline-compact.json) · [`no-shell-lint-checklist.md`](prompts/no-shell-lint-checklist.md).

## Pipeline rung (after probe) — degradation ladder

| If | Then |
| --- | --- |
| Seedance/Higgsfield MCP live | **Rung 1** connected — **call tools**; name tool in render plan |
| Image-to-video available (Kling, Wan, Grok, LTX, Veo, Runway, …) | **Rung 2** keyframes → short i2v → post — prefer Wan 2.2 / LTX-2.5 / Grok when no Seedance |
| Those tools exist for user, not here | handoff prompts (same density) |
| No video model at all | **Rung 3** motion storyboard (director’s pre-viz — **not** a slideshow) |
| Text-only | package-only — still gold density, `NOT_RENDERED` |

Full ladder: [`degradation-ladder.md`](references/creative-stack/degradation-ladder.md) · model notes: [`external-resources.md`](references/external-resources.md).

## Progressive disclosure (read only if needed)

| Need | File |
| --- | --- |
| Full playbook | `prompts/one-shot.md` |
| Degradation ladder | `references/creative-stack/degradation-ladder.md` |
| Style → pattern → prompt | `references/creative-stack/style-selection-engine.md` |
| External models / libraries | `references/external-resources.md` |
| Studies (viral / pro / award) | `studies/corpus.json` · `studies/README.md` |
| How a human builds | `references/human-build-os.md` · **assembly:** `references/human-assembly-playbook.md` · **log:** `human-build-log.template.md` |
| Shot→footage plan | `../../library/scripts/assemble-plan.mjs` |
| Ingest private studies | `scripts/ingest-blueprint.mjs` |
| Prove fresh clone | `scripts/fresh-clone-prove.mjs` |
| Tool equalization | `prompts/harness-equalization.md` |
| Attention lab | `examples/visual/attention-lab.html` |
| Finish full cut (no stall) | `prompts/finish-the-cut.md` |
| Generated UI (no screenshots) | `references/generated-ui-authenticity.md` |
| Public libraries + access ladder | `references/ad-libraries.md` · `scripts/library-access.mjs` |
| Multi-lens OS | `references/multi-lens-os.md` |
| Style catalog | `references/style-catalog.md` |
| Elite craft | `references/elite-creative-os.md` |
| Install / harness matrix | `../../INSTALL.md` · `../../AGENTS.md` |

## Non-negotiables

- One JTBD · muted-first · one CTA · dual-track when serious  
- Design + cut + timing + shots + animation — not collage + slogan  
- Sheets · claim ledger · lint · never invent proof or job ids · never invent lint JSON  
- Never invent rendered · never default to stills when video tools exist  

## Verify

```bash
node scripts/agent-ready.mjs
node scripts/demo-quality-gates.mjs
```
