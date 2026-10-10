# ONE-SHOT playbook — creative first, then paperwork

Agents fail when they fill ledgers before having an idea. **Concept → dense beat sheet → craft → lint.**

## Hard sequence

```text
0. OPEN closest gold fixture (beauty / local / saas / physical / voice) — steal DENSITY, not brand facts.

1. START FILE:
   node scripts/start-package.mjs --out packages/<brand>-ad.md

2. RETRIEVE (prefer compact):
   node scripts/retrieve.mjs --niche <niche> --platform <platform> --limit 5 --compact
   Paste primary / challenger / dual_track_twin (twin ≠ primary).

3. WRITE CREATIVE FIRST (before polishing ledger):
   a) Concept: 3 one-liners → pick ONE → "Not the default because…"
      (ban: smiling hold-to-camera, floating product+particles, drone #1, neon SaaS cockpit, invented %)
   b) Timed script: ≥6 rows, ≈≤3–4s each. VO/text = EXACT words in quotes (not “sparse”).
   c) Captions cover the cut. One CTA. Muted-first 0–3s (no logo).
   d) Craft system: ≥2 #HEX, real font names (no -style/-like), motion, E1, 9:16+1:1
   e) One paste-ready prompt PER unit (CAMERA/LIGHT/MOTION/GRADE/NEGATIVES)

4. FILL remaining [[BRACKETS]] (sheets, ledger, rights). Never invent proof.

5. LINT LOOP:
   node scripts/lint-package.mjs packages/<brand>-ad.md
   Fix until ok:true. Paste real lint JSON (never invent it).
   No shell → write "LINT: not run (no shell)" + tick self-check; do not fake JSON.
```

## Refusal / rewrite

Do **not** deliver if:

- Any `[[BRACKET]]` left  
- No Concept with “Not the default because…”  
- Timed script &lt; 6 rows or VO cells say “sparse” / “≤N words”  
- Craft is adjectives only or fonts hedged (-style/-like)  
- Invented metrics without `[PLACEHOLDER…]`  
- Multi-CTA or logo-first 0–3s  
- Chat-only brainstorm with no package file  

Thin brief → assume via brief-defaults, list Assumptions, ask ≤3 questions, **still ship**.

## No Seedance / Higgsfield

Rung = assembler. Name Wan / LTX / Grok / Kling / Hailuo / stills+CapCut. Same skeleton. Same lint.

## Done means

Lint `"ok": true` **and** a stranger can mute-watch 0–3s and know the situation.
