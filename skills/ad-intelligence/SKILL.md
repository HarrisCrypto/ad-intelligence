---
name: ad-intelligence
description: >-
  Writes one shoot-ready ad package in a single pass for any niche (beauty/hair,
  food, SaaS/AI agents, local, ecommerce…): research public ad libraries, pick an
  attention model, concept, muted-first hook, dense beat sheet with exact words,
  craft (design/layout/cut/timing/shots/animation), and generator prompts. Use for
  ads, TikTok, Reels, Shorts, Meta, Instagram, X, YouTube, LinkedIn, UGC, or when
  ads look like AI slop. URL briefs OK. Concept + model → ≥6 beats → lint until ok.
---

# Ad Intelligence — one-shot ad maker

**Do not brainstorm.** Top agents: **research live attention → copy skeleton → emulate model timing → lint until green.**

## When to use

User wants ads, creatives, hooks, UGC, Meta/TikTok/Instagram/X/YouTube spots, launch films, “ads for my site,” or “make this not look AI.”

## ONE-SHOT (mandatory)

Follow [`prompts/one-shot.md`](prompts/one-shot.md) exactly:

1. URL/site brief? → [`prompts/brief-from-url.md`](prompts/brief-from-url.md)
2. `node scripts/start-package.mjs --out packages/<brand>-ad.md`
3. `node scripts/retrieve.mjs --niche <n> --platform <p> --limit 5 --compact`  
   → patterns **and** `attention_models` + public library URLs
4. Open [`examples/visual/attention-lab.html`](examples/visual/attention-lab.html) (and/or library URLs) — steal structure
5. **Creative first:** attention model → Concept (3→1 + “Not the default because…”) → timed script ≥6 rows with EXACT quoted words → Craft system (HEX/fonts/motion/E1) → unit prompts
6. Fill remaining `[[BRACKETS]]`. No leftovers.
7. `node scripts/lint-package.mjs packages/<brand>-ad.md` until `"ok": true`
8. Deliver the file.

Gold density: beauty · local · saas · physical · voice.  
Emulate: [`prompts/emulate-attention-model.md`](prompts/emulate-attention-model.md).  
Libraries: [`references/ad-libraries.md`](references/ad-libraries.md).  
External LLMs: [`prompts/context-pack.md`](prompts/context-pack.md).

## Pipeline rung

| If | Then |
| --- | --- |
| Seedance/Higgsfield MCP live | `connected-run-protocol.md` — **call tools** |
| Those tools exist for user, not here | handoff prompts |
| No single-pass gen | `assembler-pipeline.md` + `alternative-model-routing.md` (Wan→LTX→Grok→…) |

## Non-negotiables

- One JTBD · muted-first 0–3s · one primary CTA · dual-track for serious brands  
- Design + cut + timing + shots + animation specified — not image collage + slogan  
- Sheets + claim ledger; never invent proof  
- Craft passes craft-* lint  
- `NOT_RENDERED` until real export/job ids  

## Depth docs (only if blocked)

| Need | File |
| --- | --- |
| Full playbook | `prompts/one-shot.md` |
| Attention lab (view models) | `examples/visual/attention-lab.html` |
| Public ad libraries | `references/ad-libraries.md` |
| Style catalog (47 patterns) | `references/style-catalog.md` |
| Pasteable pack | `node scripts/build-context-pack.mjs` |
| Agency craft rules | `references/elite-creative-os.md` |

## Verify

```bash
node scripts/demo-quality-gates.mjs
node scripts/lint-package.mjs packages/<brand>-ad.md
```

Human proof: `../../PROOF.md`
