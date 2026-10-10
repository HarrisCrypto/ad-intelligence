# ONE-SHOT playbook — do this, nothing else first

Agents fail when they brainstorm. **Copy → fill → lint → fix.** No parallel system.

## Hard sequence (one user brief → one package)

```text
1. WRITE FILE from references/package-skeleton.md
   → save as packages/<brand-slug>-ad.md (create packages/ if needed)

2. RUN retrieve (from skills/ad-intelligence/):
   node scripts/retrieve.mjs --niche <niche|alias> --platform <platform> --limit 5
   Paste primary / challenger / dual_track_twin into the package Retrieval section.
   If dual_track_twin === primary, pick the next cinema/high-prod pattern from picks.

3. FILL every [[BRACKET]] in the skeleton. Do not delete sections.
   - Sheets: concrete pack/UI/place locks (or [REQUEST FROM USER])
   - Craft system: ≥2 #HEX, named type roles, motion verbs, E1 endcard, 9:16+1:1
   - Unit prompts: CAMERA / LIGHT / MOTION / GRADE / NEGATIVES (no cinematic/stunning/8k)
   - Paid/captions: zero ledger language (“only when supplied”, ASSUMED, PLACEHOLDER)

4. LINT LOOP (required — not optional):
   node scripts/lint-package.mjs packages/<brand-slug>-ad.md
   If ok:false → FIX those rule ids → re-lint until ok:true
   Paste final lint JSON at the bottom under First-time-right QA.

5. DELIVER the markdown file + say:
   - Pipeline rung (connected / handoff / assembler)
   - Tools named (never invent Seedance jobs)
   - Render status (usually NOT_RENDERED until real exports)
```

## Refusal rules (say no / rewrite)

Refuse to deliver if any of these are true:

- Package is chat prose without the skeleton sections  
- Craft system is adjectives only (cinematic, stunning, nice colors, bold font)  
- No retrieve pattern ids  
- Lint not run, or lint failed  
- Invented metrics/reviews without `[PLACEHOLDER…]`  
- Multi-CTA primary  
- Logo-first 0–3s  

If the brief is thin: assume via `brief-defaults.json`, list Assumptions, ask ≤3 questions, **still ship the filled package**.

## Niche → start fixture (steal craft density)

| Niche signal | Copy craft depth from |
| --- | --- |
| beauty / skincare | `examples/beauty-dtc-dual-track.md` |
| plumber / local / geo | `examples/local-service-trust.md` |
| SaaS / B2B / app | `examples/saas-demo-pas.md` |
| physical product / kettle | `examples/physical-product-hero.md` |
| phone / voice / front desk | `examples/voice-agent-front-desk.md` |

Open the closest gold **after** copying the skeleton — match its specificity, swap brand facts.

## No Seedance / Higgsfield

Still one-shot: rung = **assembler**. Name Wan / LTX / Grok / Kling / Hailuo / stills+CapCut in the render plan. Same skeleton. Same lint.

## Done means

`lint-package.mjs` → `"ok": true` **and** Craft system would survive a mute test + freeze-frame poster test.
