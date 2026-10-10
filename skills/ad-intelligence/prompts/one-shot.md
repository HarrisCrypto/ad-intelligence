# ONE-SHOT playbook — creative first, then finish the cut

Agents fail when they fill ledgers before having an idea — or render a hook and stall asking for screenshots. **Research → attention model → Concept → dense beats → craft → lint → finish the full cut.**

## Hard sequence

```text
0. PROBE + EQUALIZE
   node scripts/probe-harness.mjs
   Fill tool card (prompts/harness-equalization.md) → rung:
   connected | handoff | assembler | package-only
   Optional: read references/brand-context.md or .agents/brand-context.md if present

1. BRIEF
   - URL/site: node scripts/brief-from-url.mjs <url> (or prompts/brief-from-url.md)
   - OPEN closest gold fixture — steal DENSITY, not brand facts

2. START FILE:
   node scripts/start-package.mjs --out packages/<brand>-ad.md

3. RETRIEVE (prefer compact):
   node scripts/retrieve.mjs --niche <niche> --platform <platform> --limit 5 --compact
   Paste primary / challenger / dual_track_twin (twin ≠ primary).
   Paste attention_models.primary + challenger (timing included).
   Open research URLs + examples/visual/attention-lab.html — STRUCTURE only.

4. EMULATE + WRITE CREATIVE FIRST:
   a) Attention model id + angle axis (references/angle-axes.md)
   b) Concept: 3 one-liners → pick ONE → "Not the default because…"
      (ban: smiling hold-to-camera, floating product+particles, drone #1, neon SaaS cockpit, invented %)
   c) Timed script: ≥6 rows matching model timing (±). EXACT quoted VO/text.
   d) Captions cover the cut. One CTA. Muted-first 0–3s (no logo).
   e) Craft: ≥2 #HEX, real fonts, motion, E1, 9:16+1:1 — cut/shots/animation named
   f) One paste-ready prompt PER unit (CAMERA/LIGHT/MOTION/GRADE/NEGATIVES)

5. FILL remaining [[BRACKETS]]. Never invent proof.

6. LINT LOOP:
   node scripts/lint-package.mjs packages/<brand>-ad.md
   Fix until ok:true. Paste real lint JSON (never invent it).
   No shell → prompts/no-shell-lint-checklist.md; offline retrieve JSON;
   never invent ok:true JSON.

7. FINISH THE CUT (if image/video tools exist):
   Follow prompts/finish-the-cut.md — cover EVERY second of the timed script.
   Missing UI/screenshots? → references/generated-ui-authenticity.md (generate 3 states).
   Post owns captions/logo/CTA type. Log real job ids. No parallel agents.
   Do NOT deliver “send me screenshots to finish” when you can generate.
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
- **Hook-only render + “send screenshots”** while gen tools were available  
- Neon/rubber AI dashboard as the product UI  

Thin brief → assume via brief-defaults, list Assumptions, ask ≤3 questions, **still ship** (and still finish the cut if tools exist).

## No Seedance / Higgsfield

Rung = assembler. Name Wan / LTX / Grok / Kling / Hailuo / stills+CapCut. Same skeleton. Same lint. Same finish-the-cut duty.

## Done means

1. Lint `"ok": true`  
2. Full timed duration covered (finish-the-cut contract)  
3. Stranger can mute-watch 0–3s and know the situation  
4. UI/product looks authentic — generated flat documentary chrome OK; rubber AI UI not OK  
