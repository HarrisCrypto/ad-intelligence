# Seedance prompt contract (Higgsfield-quality handoff)

Use this whenever the stack includes **Seedance 2.0 / 2.5** (BytePlus, CapCut/Dreamina, TikTok Symphony, or Higgsfield `seedance_2_*`).  
Even with **no API connected**, emit this block so anyone can paste into Seedance and hit ad-grade output.

**Consistency prerequisite:** fill or request  
`product-sheet-template.md` and (if talent) `character-sheet-template.md`  
before generating. Paste their lock language into the prompt.

## Golden rules

1. **Product lock first** — attach real pack / product stills as references (omni_reference). Multi-angle + label close-up. Do not rely on text-only for ecommerce.
2. **Character / Soul-ID lock** — when a person appears, attach face refs and identity-lock phrasing. Same person every frame.
3. **Style lock** — one grade + lens family for the spot; don’t remix looks mid-cut unless pattern requires it.
4. **One job per generation** — match the pattern’s JTBD; don’t cram feature laundry.
5. **Timed beats in the prompt** — Seedance follows narrative better with `0–3s / 3–10s / …` blocks.
6. **Native audio OK** — set `generate_audio: true`, but still plan burned captions for muted feeds.
7. **Don’t ask the model to render tiny legal text or perfect logo kerning** — add endcard/captions in CapCut/edit.
8. **Variants** — change ONE variable (hook visual, talent, background, CTA line). Prefer region/timestamp edit on 2.5 when available.

## Settings block (emit always)

```yaml
tool: seedance
model: seedance_2_5   # or seedance_2_0 if 2.5 unavailable
mode: omni_reference  # prefer over t2v for ads
duration_s: 15        # 8–12 hooks | 15–30 full spots
resolution: 1080p
aspect_ratio: "9:16"  # also deliver 16:9 twin brief
generate_audio: true
bitrate_mode: high
product_sheet: "[PATH_OR_FILLED_INLINE]"
character_sheet: "[PATH_OR_N/A]"
style_lock:
  grade: "[e.g. soft beauty daylight / hard product / cinematic teal-safe]"
  lens: "[e.g. 35mm / macro 100mm]"
  motion_bias: "[handheld ugc | locked tripod | slow dolly]"
references:
  - role: product_hero
    file: "[PRODUCT_PACK.png]"
  - role: product_detail
    file: "[LABEL_OR_MACRO.png]"
  - role: product_in_hand   # optional but preferred for scale
    file: "[IN_HAND.png]"
  - role: face_front        # if talent
    file: "[FACE_FRONT.png]"
  - role: face_three_quarter
    file: "[FACE_34.png]"
  - role: style_or_talent
    file: "[OPTIONAL_REF.png]"
  - role: audio_mood
    file: "[OPTIONAL_BED.mp3]"
negative:
  - "blurry logo, melted text, extra fingers, watermark, stock lower-third, brand parody, identity drift, celebrity lookalike"
```

## Prompt skeleton (copy-paste)

```text
COMMERCIAL AD SPOT — [NICHE] — [PATTERN_ID]
Job-to-be-done: [ONE SENTENCE]
Style: [cinematic|ugc-hybrid|macro|performance] · Grade: [describe] · Lens: [e.g. 35mm / macro 100mm]
Aspect feel: vertical social, subject centered with safe margins for captions.
STYLE LOCK: Maintain the same grade, contrast, and lens family for the full duration.

PRODUCT SHEET LOCK — use attached references as ground truth.
Keep exact silhouette, proportions, colorway, cap/lid, label layout, logo placement,
and material finish from product_hero + product_detail every frame.
Do not invent alternate packaging, fake badges, or extra SKUs.

CHARACTER / SOUL-ID LOCK — [N/A or:] match attached face references exactly.
Same person every frame: bone structure, eye/skin/hair from face_front + face_three_quarter.
No identity drift, beauty-filter morph, or celebrity lookalike.

TIMELINE:
0–2s HOOK: [exact visual + on-screen idea — no logo]. Pattern interrupt: […].
2–8s BODY: [mechanism / demo / desire]. Camera: [move]. Product must match reference exactly.
8–12s PROOF OR ESCALATION: [result / social proof placeholder — do not invent numbers on screen].
12–15s CTA BEAT: [action] with clean end pose; leave lower 20% quieter for caption burn-in.

AUDIO: [VO line if any — short]. SFX: [whoosh/impact]. Music energy: [low/medium/high]. No copyrighted song titles.

IDENTITY LOCK: Keep product shape, colorway, and label from reference images consistent every frame.
PHYSICS: Believable materials, no morphing packaging.
```

## Hook-test mini prompt (5–8s)

```text
Thumb-stop hook only. 0–1s: [spectacle or confession visual]. 1–5s: product enters as solution. Hard stop before CTA. Match product reference + style lock. Vertical 9:16. generate_audio true.
```

## Edit brief (Seedance 2.5 region/timestamp)

```text
EDIT MODE — keep all shots except:
- Replace 0–3s hook with: […]
- Replace final 3s CTA with: […]
Do not change product identity, character Soul-ID, or grade (style lock).
```

## Quality bar checklist (Seedance)

- [ ] Product sheet + multi-angle refs attached (or gaps requested)
- [ ] Character sheet / Soul-ID when talent appears
- [ ] Style lock stated (grade + lens)
- [ ] Product recognizable vs reference
- [ ] Hook works muted
- [ ] No melted logos / fake metrics on screen
- [ ] Length matches media plan
- [ ] Vertical + horizontal twin planned
- [ ] Rights: original/licensed audio for paid
