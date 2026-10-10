---
name: ad-intelligence
description: >-
  Writes one shoot-ready ad package in a single pass for any niche (beauty/hair,
  food, SaaS/AI agents, local, ecommerce…): probe harness tools, equalize to a
  pipeline rung, research public ad libraries, pick an attention model, concept,
  muted-first hook, dense beat sheet with exact words, craft (design/layout/cut/
  timing/shots/animation), and generator prompts. Use for ads, TikTok, Reels,
  Shorts, Meta, Instagram, X, YouTube, LinkedIn, UGC, URL briefs, or AI slop.
  Works in Cursor, Claude Code, Codex, Gemini, OpenClaw, Copilot — with or without
  Higgsfield. Probe → equalize → concept → ≥6 beats → lint until ok.
compatibility: Requires Node 18+ for scripts. Optional network for URL brief + libraries. MCP video tools optional (connected rung).
metadata:
  version: "3.12.2"
  open_standard: agentskills
---

# Ad Intelligence — one-shot ad maker

**Do not brainstorm.** Top agents: **probe tools → equalize rung → research attention → skeleton → lint green.**

## When to use

Ads, creatives, hooks, UGC, Meta/TikTok/Instagram/X/YouTube, “ads for my site,” or “make this not look AI.”

## ONE-SHOT (mandatory)

1. `node scripts/probe-harness.mjs` → fill tool card ([`prompts/harness-equalization.md`](prompts/harness-equalization.md))
2. URL/site? → `node scripts/brief-from-url.mjs <url>` ([`prompts/brief-from-url.md`](prompts/brief-from-url.md))
3. Optional brand file? Read `references/brand-context.md` or `.agents/brand-context.md` if present
4. `node scripts/start-package.mjs --out packages/<brand>-ad.md`
5. `node scripts/retrieve.mjs --niche <n> --platform <p> --limit 5 --compact`
6. Open [`examples/visual/attention-lab.html`](examples/visual/attention-lab.html) + research URLs — emulate structure
7. **Creative:** attention model + [angle axes](references/angle-axes.md) → Concept → ≥6 exact-VO rows → Craft → unit prompts
8. Fill `[[BRACKETS]]` → `node scripts/lint-package.mjs …` until `"ok": true`
9. Deliver the file

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
| Tool equalization | `prompts/harness-equalization.md` |
| Attention lab | `examples/visual/attention-lab.html` |
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
