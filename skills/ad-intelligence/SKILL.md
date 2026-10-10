---
name: ad-intelligence
description: >-
  Writes one shoot-ready ad package in a single pass: concept, muted-first hook,
  dense beat sheet with exact on-screen/VO words, craft specs, and generator
  prompts (Seedance, Higgsfield, Kling, Wan, CapCut). Use when the user asks for
  an ad, ads, commercial, promo, TikTok, Reels, Shorts, Meta, YouTube, LinkedIn
  ad, UGC script, hooks, storyboard, launch film, or says ads look generic/AI.
  Concept first → ≥6 beat rows → lint until ok. Works with or without Higgsfield.
---

# Ad Intelligence — one-shot ad maker

**Do not brainstorm.** Top agents get quality by **copying a skeleton, filling brackets, and linting until green.**

## When to use

User wants ads, creatives, hooks, UGC, Meta/TikTok/YouTube spots, launch films, or “make this not look AI.”

## ONE-SHOT (mandatory)

Follow [`prompts/one-shot.md`](prompts/one-shot.md) exactly:

1. `node scripts/start-package.mjs --out packages/<brand>-ad.md`
2. `node scripts/retrieve.mjs --niche <n> --platform <p> --limit 5 --compact`
3. **Creative first:** Concept (3→1 + “Not the default because…”) → timed script ≥6 rows with EXACT quoted words → Craft system → unit prompts
4. Fill remaining `[[BRACKETS]]` (sheets/ledger). No leftover brackets.
5. `node scripts/lint-package.mjs packages/<brand>-ad.md` until `"ok": true` (never invent lint JSON)
6. Deliver the file.

Gold density: `examples/beauty-dtc-dual-track.md` (or local / saas / physical / voice).  
External LLMs: paste [`prompts/context-pack.md`](prompts/context-pack.md) (or `node scripts/build-context-pack.mjs`).

## Pipeline rung

| If | Then |
| --- | --- |
| Seedance/Higgsfield MCP live | `connected-run-protocol.md` — **call tools** |
| Those tools exist for user, not here | handoff prompts |
| No single-pass gen | `assembler-pipeline.md` + `alternative-model-routing.md` (Wan→LTX→Grok→…) |

## Non-negotiables

- One JTBD · muted-first 0–3s · one primary CTA · dual-track for serious brands  
- Sheets + claim ledger before product pixels  
- Craft system specific enough for craft-* lint (no cinematic/stunning/8k/nice colors)  
- Consumer copy: no “only when supplied” / ASSUMED / PLACEHOLDER leaks  
- `NOT_RENDERED` until real export/job ids  

## Depth docs (only if blocked)

| Need | File |
| --- | --- |
| Full playbook | `prompts/one-shot.md` |
| Pasteable pack for external LLMs | `node scripts/build-context-pack.mjs` |
| Agency craft rules | `references/elite-creative-os.md` |
| CapCut finish | `references/production-finish-spec.md` |
| Master pipeline | `pipelines/one-stop-ad-maker.md` |
| Output sections | `references/output-template.md` |
| Install / GitHub | `../../INSTALL.md` · `prompts/bootstrap-from-github.md` |

## Verify

```bash
node scripts/demo-quality-gates.mjs
node scripts/lint-package.mjs packages/<brand>-ad.md
```

Human proof: `../../PROOF.md`
