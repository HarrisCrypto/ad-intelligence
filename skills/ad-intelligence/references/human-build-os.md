# Human Build OS — how a practitioner actually makes the ad

**Mission:** Studies teach *what* to emulate. This file teaches *how* a human builds it with real tools — so any LM finishes a cut instead of stopping at a concept slide.

Pair with: `studies/corpus.json` (`human_build` **playbook** steps) · **`human-build-log.template.md` (the auditable artifact)** · `prompts/finish-the-cut.md` · `references/generated-ui-authenticity.md` · retrieve `payload.studies` (always copy `provenance`).

`human_build` in a study is a checklist. The **log** is the filled artifact (decisions, job ids, retries, cost, lint). Seed: `examples/human-build-logs/voice-agent-assembler-seed.md`.

## Rule

Steal **structure** (timing, shot job, text density, cut rhythm). Never copy competitor lines, logos, reviews, or claimed CTR/ROAS.

```text
study.when_to_emulate → pick study
→ rewrite every word for THIS brand
→ run human_build steps with the tools you actually have
→ finish-the-cut across the full timed duration
→ lint until ok:true
```

## Tool ladders (pick what your harness probe found)

| Job | Connected | Assembler | Package-only |
| --- | --- | --- | --- |
| Talking-head / confession | Seedance / Kling i2v | Kling / Hailuo / Wan + CapCut | Still + timed script + prompts |
| UI / SaaS aha | Screen record → edit | Generate 3 flat UI states → CapCut | Exact UI prompts + states |
| Macro beauty / food | Product plate → i2v | Flux/Nano stills → short i2v | Macro still prompts + loop notes |
| Hero / brand film | Seedance cinema ladder | Wan/LTX/Kling keyframes → grade | Dual-track prompts + endcard spec |
| Captions / CTA / logo | CapCut / AE in post | CapCut / CapCut web | Post owns type — never hope the model burns it |
| Voice | Studio / Eleven / TTS | TTS in CapCut | VO script quoted in beats |

Probe first (`probe-harness.mjs`). Do not invent MCP job ids. Missing UI captures → generate authentic flat UI; do not stall asking for screenshots.

## Class playbooks

### `viral_native` (confession, skit, food loop, listicle)

1. Hook from **customer language** (reviews/support), not brand vibes.  
2. Imperfect light / native texture on face or food — brand late.  
3. Product/UI insert as **proof**, not a floating logo.  
4. Jump cuts on breath; captions ≤8 words on the open.  
5. One CTA endcard; export 9:16 (+1:1 if paid Meta).

### `performance_dr` (PAS, local geo, voice agent, text-first)

1. One JTBD + one pain **object** (bill, missed call, inbox, city).  
2. Solution after ~8–12s via demo (real or generated UI).  
3. Objection crush only with ledger-safe lines.  
4. Single CTA path (Start free / Book / Call).  
5. Finish every second of the timed sheet — hook-only is incomplete; lay audio (VO/SFX/bed) in post — silent exports are incomplete.

### `award_brand_film` (hero spectacle)

1. Lock product sheet (colorway/pack) before any gen.  
2. Spectacle must still be the product’s physics — no logo 0–3s.  
3. Keyframe stills → i2v; hold product ≥1.2s; grade once.  
4. Signature endcard in post.  
5. Always cut a UGC/DR twin for spend (dual-track).

## Per-unit habit (every class)

For each unit prompt name: **CAMERA / LIGHT / MOTION / GRADE / NEGATIVES**.  
Craft block: ≥2 `#HEX`, real fonts, motion, E1, formats.  
Claims: user proof or `[PLACEHOLDER…]` — never invented %.

## Research ritual (10 minutes, optional but sharp)

1. Open libraries from retrieve `attention_models.research` / `studies[].research_where`.  
2. Note: hook type, seconds-to-product, caption density, CTA count, audio type.  
3. Emulate those jobs for **this** brand (`prompts/emulate-attention-model.md`).  
4. Private named-competitor breakdowns → `studies/private/` (gitignored).

## Done

- Study id + attention model id named in the package  
- Timed script ≥6 rows with exact quoted VO  
- `human_build` steps executed or explicitly mapped to your rung  
- Full duration covered (`finish-the-cut`)  
- Lint `"ok": true` with real JSON  
