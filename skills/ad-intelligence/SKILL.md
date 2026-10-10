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
  version: "3.16.0"
  open_standard: agentskills
---

# Ad Intelligence — one-shot ad maker

**Do not brainstorm.** Top agents: **probe tools → equalize rung → study → emulate → human_build → skeleton → finish-the-cut → lint green.**

## When to use

Ads, creatives, hooks, UGC, Meta/TikTok/Instagram/X/YouTube, “ads for my site,” or “make this not look AI.”

## ONE-SHOT (mandatory)

1. `node scripts/probe-harness.mjs` → fill tool card ([`prompts/harness-equalization.md`](prompts/harness-equalization.md))
2. URL/site? → `node scripts/brief-from-url.mjs <url>` ([`prompts/brief-from-url.md`](prompts/brief-from-url.md))
3. Optional brand file? Read `references/brand-context.md` or `.agents/brand-context.md` if present
4. `node scripts/start-package.mjs --out packages/<brand>-ad.md`
5. `node scripts/retrieve.mjs --niche <n> --platform <p> --limit 5 --compact` — paste **studies** + attention models + pattern picks
6. Open [`examples/visual/attention-lab.html`](examples/visual/attention-lab.html) + research URLs — emulate structure ([`studies/README.md`](studies/README.md))
7. **Creative:** study + attention model + [angle axes](references/angle-axes.md) → Concept → ≥6 exact-VO rows → Craft → unit prompts via [`human-build-os.md`](references/human-build-os.md)
8. Fill `[[BRACKETS]]` → `node scripts/lint-package.mjs …` until `"ok": true`
9. **Finish the cut** ([`prompts/finish-the-cut.md`](prompts/finish-the-cut.md)) — full duration; generate UI if needed ([`generated-ui-authenticity.md`](references/generated-ui-authenticity.md)); no “send screenshots” stall
10. Deliver the file + real job ids

Ready check: `node scripts/agent-ready.mjs`  
No shell: paste [`prompts/context-pack-lite.md`](prompts/context-pack-lite.md) · offline [`retrieve-offline-compact.json`](references/retrieve-offline-compact.json) · [`no-shell-lint-checklist.md`](prompts/no-shell-lint-checklist.md).

## Pipeline rung (after probe)

| If | Then |
| --- | --- |
| Seedance/Higgsfield MCP live | connected — **call tools** |
| Those tools exist for user, not here | handoff prompts |
| Image/short video + editor | assembler + `alternative-model-routing.md` |
| Text-only | package-only — still gold density, `NOT_RENDERED` |

## Progressive disclosure (read only if needed)

| Need | File |
| --- | --- |
| Full playbook | `prompts/one-shot.md` |
| Studies (viral / pro / award) | `studies/corpus.json` · `studies/README.md` |
| How a human builds | `references/human-build-os.md` · **log:** `human-build-log.template.md` |
| Ingest private studies | `scripts/ingest-blueprint.mjs` |
| Prove fresh clone | `scripts/fresh-clone-prove.mjs` |
| Tool equalization | `prompts/harness-equalization.md` |
| Attention lab | `examples/visual/attention-lab.html` |
| Finish full cut (no stall) | `prompts/finish-the-cut.md` |
| Generated UI (no screenshots) | `references/generated-ui-authenticity.md` |
| Public libraries | `references/ad-libraries.md` |
| Multi-lens OS | `references/multi-lens-os.md` |
| Style catalog | `references/style-catalog.md` |
| Elite craft | `references/elite-creative-os.md` |
| Install / harness matrix | `../../INSTALL.md` · `../../AGENTS.md` |

## Non-negotiables

- One JTBD · muted-first · one CTA · dual-track when serious  
- Design + cut + timing + shots + animation — not collage + slogan  
- Never invent proof or job ids · never invent lint JSON  

## Verify

```bash
node scripts/agent-ready.mjs
node scripts/demo-quality-gates.mjs
```
