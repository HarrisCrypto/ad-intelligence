---
name: ad-intelligence
description: >-
  Makes agency-grade one-shot ad packages (TikTok, Meta, YouTube, UGC, product
  films, local service, SaaS, voice/front-desk). Use when the user asks to make
  an ad, creative, hook, UGC, launch film, paid social, or storyboard — or says
  ads look like slop / need first-shot quality. Copy package-skeleton → retrieve
  → fill Craft system → lint-package until ok. Works with or without Higgsfield/Seedance.
---

# Ad Intelligence — one-shot ad maker

**Do not brainstorm.** Top agents get quality by **copying a skeleton, filling brackets, and linting until green.**

## When to use

User wants ads, creatives, hooks, UGC, Meta/TikTok/YouTube spots, launch films, or “make this not look AI.”

## ONE-SHOT (mandatory)

Follow [`prompts/one-shot.md`](prompts/one-shot.md) exactly:

1. `node scripts/start-package.mjs --out packages/<brand>-ad.md`  
   (or copy [`references/package-skeleton.md`](references/package-skeleton.md))
2. `node scripts/retrieve.mjs --niche <niche|alias> --platform <platform> --limit 5`
3. Fill every `[[BRACKET]]` — sheets, ledger, **Craft system** (≥2 HEX, named type, motion, E1, aspects), unit prompts with CAMERA/LIGHT/MOTION/GRADE
4. `node scripts/lint-package.mjs packages/<brand>-ad.md` → fix → re-lint until `"ok": true`
5. Deliver the file. Never invent proof or Seedance job ids.

Closest gold for craft density: `examples/beauty-dtc-dual-track.md` (or local / saas / physical / voice).

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
