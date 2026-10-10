# Seedance prompt contract (Higgsfield-quality handoff)

Use for **Seedance 2.0 / 2.5** anywhere (BytePlus, CapCut/Dreamina, Symphony, or Higgsfield `generate_video`).  
**Canonical execution shape:** `references/creative-stack/render-plan.md` (clip units + real MCP roles).  
This file is the **prompt text + quality bar**. Do not invent media roles like `product_hero` in API calls.

See `LAST-VERIFIED.md` + runtime `models_explore get`.

## Golden rules

1. **Product / character lock first** — sheets with provenance tags. Sheet wins.
2. **One job per unit** — match pattern JTBD.
3. **Timed beats in every unit prompt** — `0–3s / …`
4. **Split long spots** — pattern durations are assembly targets, not one `duration` arg. Prefer ≤15s when face-on-camera.
5. **Bind refs by number in prompt** — Image 1=hero, 2=label, 3=¾, 4=face.
6. **No tiny legal text / perfect logo kerning in-model** — CapCut/endcard in post.
7. **Variants** — one variable per unit retry / A-B-C request.
8. **Audio path** — pick exactly one (see render-plan.md).

## Settings for handoff (document only)

```yaml
tool: seedance
model: seedance_2_5          # probe live; seedance_2_0 max ~15s
# API roles (connected): start_image | end_image | image_references | video_references | audio_references
duration_s_per_unit: 8-15    # assemble for longer spots
resolution: prefer_1080_final_draft_480_first
aspect_ratio: "9:16"         # always set explicitly
generate_audio: true         # only if audio path = native
references_order:
  - 1_hero
  - 2_label
  - 3_three_quarter
  - 4_face_optional
negative:
  - "melted text, wrong label, color shift, extra fingers, watermark, different person, beauty-filter identity drift, brand parody"
```

## Prompt skeleton (per unit)

```text
COMMERCIAL AD UNIT — [NICHE] — [PATTERN_ID] — [unit_id]
Job-to-be-done: [ONE SENTENCE]
Lens / Light / Surface / Motion: [concrete — not "cinematic/stunning/8k"]
Aspect: vertical social; leave lower caption safe zone clear.

REF BINDING: Image 1 = hero pack. Image 2 = label close-up. Image 3 = ¾. Image 4 = face (if any).

PRODUCT SHEET LOCK (sheet wins):
[2–6 lines — silhouette, colorway, label truths, forbidden morphs]

CHARACTER SHEET LOCK (if any):
[2–4 lines — likeness, wardrobe, Soul-ID]

TIMELINE:
0–2s HOOK: [exact visual — no logo]. Interrupt: […]
2–8s BODY: [mechanism]. Camera: [move]. Match Image 1–2 exactly.
… CTA BEAT: clean end pose; pack hero if end_image set.

AUDIO PATH: [native bed | muted+VO | dialogue | silent+captions]
IDENTITY LOCK: Same product (+ person) every frame.
PHYSICS: Believable materials; no melting type.
```

## Hook-test mini unit (5–8s)

```text
Thumb-stop only. Image 1–2 lock on. 0–1s spectacle/confession. 1–5s product as solution. Hard stop before CTA. 9:16.
```

## Edit brief (region/timestamp)

```text
EDIT — keep product/character identity + grade:
- Replace 0–3s hook with: […]
- Do not change product identity, label, or talent likeness.
```

## Quality bar

- [ ] Sheets filled or REQUEST rows + asset ladder state set
- [ ] Multi-angle refs (hero + label minimum) for product units
- [ ] Units ≤ model max; assembly listed
- [ ] Prompt cites Image N bindings
- [ ] Hook works muted
- [ ] No melted logos / fake metrics
- [ ] Rights + disclosure noted
- [ ] Connected: cost preflight + receipt — or NOT_RENDERED
