# ONE-SHOT playbook — creative first, then paperwork

Agents fail when they fill ledgers before having an idea. **Research → attention model → Concept → dense beat sheet → craft → lint.**

## Hard sequence

```text
0. BRIEF
   - If user gave a URL/site: `node scripts/brief-from-url.mjs <url>` (or prompts/brief-from-url.md).
     Keep ASSET_VERIFIED vs PLACEHOLDER tags; list Assumptions.
   - OPEN closest gold fixture (beauty / local / saas / physical / voice) — steal DENSITY, not brand facts.

1. START FILE:
   node scripts/start-package.mjs --out packages/<brand>-ad.md

2. RETRIEVE (prefer compact):
   node scripts/retrieve.mjs --niche <niche> --platform <platform> --limit 5 --compact
   Paste primary / challenger / dual_track_twin (twin ≠ primary).
   Paste attention_models.primary + challenger (timing sheets).
   Open attention_models.research[] URLs (Meta Ad Library, TikTok Creative Center, X, YouTube) —
   10-minute look: steal STRUCTURE only. Lab: examples/visual/attention-lab.html

3. EMULATE + WRITE CREATIVE FIRST (before polishing ledger):
   a) Attention model id + “why this stops scroll for THIS brief”
   b) Concept: 3 one-liners → pick ONE → "Not the default because…"
      (ban: smiling hold-to-camera, floating product+particles, drone #1, neon SaaS cockpit, invented %)
   c) Timed script: ≥6 rows matching model timing (±). VO/text = EXACT words in quotes (not “sparse”).
   d) Captions cover the cut. One CTA. Muted-first 0–3s (no logo).
   e) Craft system: ≥2 #HEX, real font names (no -style/-like), motion, E1, 9:16+1:1
      Design/layout/cut/shots/animation called out — not “nice images + caption.”
   f) One paste-ready prompt PER unit (CAMERA/LIGHT/MOTION/GRADE/NEGATIVES)

4. FILL remaining [[BRACKETS]] (sheets, ledger, rights). Never invent proof.

5. LINT LOOP:
   node scripts/lint-package.mjs packages/<brand>-ad.md
   Fix until ok:true. Paste real lint JSON (never invent it).
   No shell → write "LINT: not run (no shell)" + tick self-check; do not fake JSON.
```

## Niche cheat sheet

| Ask | Niche | Models / gold |
| --- | --- | --- |
| Hair, shampoo, skincare | beauty | `am_hair_transform`, beauty gold |
| Food, coffee, snacks | food_bev | `am_food_crave_asmr` |
| AI agent / voice / SaaS site | saas | `am_voice_agent_missed`, voice + saas gold |
| Local service | local_services | `am_local_geo_trust` |
| Any DTC product | ecommerce | `am_macro_lust_loop` / hero |

Full map: `references/ad-libraries.md`. Emulate: `prompts/emulate-attention-model.md`.

## Refusal / rewrite

Do **not** deliver if:

- Any `[[BRACKET]]` left  
- No attention model id + no Concept with “Not the default because…”  
- Timed script &lt; 6 rows or VO cells say “sparse” / “≤N words”  
- Craft is adjectives only or fonts hedged (-style/-like)  
- Invented metrics without `[PLACEHOLDER…]`  
- Multi-CTA or logo-first 0–3s  
- Chat-only brainstorm with no package file  
- Image collage + crappy slogan (no cut/timing/shots)

Thin brief → assume via brief-defaults, list Assumptions, ask ≤3 questions, **still ship**.

## No Seedance / Higgsfield

Rung = assembler. Name Wan / LTX / Grok / Kling / Hailuo / stills+CapCut. Same skeleton. Same lint.

## Done means

Lint `"ok": true` **and** a stranger can mute-watch 0–3s and know the situation.
