# Assembler / own-pipeline path (third rung)

Use this when the agent **does not** have Seedance, Higgsfield, or any single-pass long-form video generator — only its own media tools (image gen, short/light video models, compositing, CapCut-style finishing, TTS, etc.).

This is a **third rung** alongside:

| Rung | When | Doc |
| --- | --- | --- |
| **Connected** | Higgsfield/Seedance MCP (or peer) available | `connected-run-protocol.md` |
| **Handoff** | Those tools exist for the user, but not in-session | Seedance contract + Higgsfield playbook prompts |
| **Assembler** | No single-pass generator — build from keyframes + short clips | **this file** |

Connected and handoff paths stay unchanged. Assembler **does not** lower the quality bar.

## Non-negotiables (same as other rungs)

1. Product / character sheets with provenance tags (or REQUEST gaps) before product/talent pixels  
2. Claim & asset ledger — never invent proof  
3. Timed script + render plan with `unit_id`s  
4. One primary CTA · muted-first hook · dual-track default for serious brands  
5. `lint-package.mjs` exit 0  
6. **Never claim a render is finished if no tool was actually called** — use `NOT_RENDERED` or list real job/export ids  

## When to choose assembler

Pick **assembler** if any of these are true:

- No Seedance / Higgsfield / peer long-form model in the session  
- Available models only do stills, 2–5s clips, or weak identity lock  
- User will finish in CapCut / Premiere / Descript / similar  
- Pattern needs UI screens, phone UI, or real facility footage better assembled than invented in one pass  

State in the package:

```text
Tool access: assembler (own pipeline — no single-pass video gen)
Pipeline rung: assembler
```

## Method — keyframes + short clips (not one long gen)

1. **Lock the timed script** from the pattern (same JTBD / beats).  
2. **Split into units** of stills + 2–5s clips (match light-model max). Example for a 20s spot:

| unit_id | Type | Seconds | Source |
| --- | --- | --- | --- |
| K1 | keyframe still | — | image gen or real photo |
| C1 | short clip from K1 | 3–5 | image-to-video |
| K2 | keyframe still | — | next beat |
| C2 | short clip | 3–5 | i2v |
| A1 | audio bed / VO | full | TTS / Suno / licensed |
| E1 | endcard still | last 3s | CapCut / design tool |

3. **Prefer real stills or controlled image-to-video** when product/place/UI identity matters. Pure text-to-video is last resort for identity-critical frames.  
4. **Bind sheets:** every product/talent frame references Image-N from the sheet (even if generated locally).  
5. **Assemble in post:** captions, endcard, logo, legal, music, loudness, aspect exports — **do not** ask models to render perfect tiny text or logo kerning.  
6. **Render log:** list each still/clip/export id or mark `NOT_RENDERED` with clear handoff steps for the human editor.

## Render plan shape (assembler)

Use the same output-template **Render plan** table. For generator column, name the actual tool (e.g. `flux_still`, `kling_i2v_5s`, `capcut_assemble`) — not invent Seedance jobs.

```yaml
pipeline_rung: assembler
units:
  - unit_id: K1
    type: keyframe
    tool: image_gen_or_real_stills
    sheet_refs: [1, 2]
  - unit_id: C1
    type: clip
    duration_s: 4
    tool: image_to_video
    start_from: K1
  - unit_id: E1
    type: endcard
    tool: capcut
    note: logo SVG + CTA burn-in in post
finish:
  - captions_srt
  - one_cta
  - aspects: ["9:16", "1:1"]
  - paid_safe_audio
```

## Pattern adaptation tips

| Pattern family | Assembler bias |
| --- | --- |
| UGC / talking head | Real or sheet-locked face stills → short i2v → CapCut captions |
| Hero / macro product | Multi-angle stills from sheet → short turntable/pour clips → assemble |
| Local trust | Prefer phone-shot facility stills/clips; gen only interstitial B-roll |
| SaaS / UI | **Screen record** real UI; gen only B-roll under VO |
| Voice / front-desk | UI phone mock + waveform/VO in post; don’t invent call transcripts as proof |
| Listicle / kinetic | Design stills/cards in CapCut or motion tool; gen optional texture |

## Finish checklist (always)

1. Import clips + keyframes in timeline order  
2. Burn muted-first hook text 0–3s  
3. One CTA endcard (logo SVG/PNG from brand, not model-drawn)  
4. Normalize audio; paid-safe bed  
5. Export required aspects as **separate** timelines (not center-crop)  
6. Run `checklists/render-qa.json` on exports (or emit the checklist if human finishes)

## Agent honesty rules

- If you only wrote prompts/keyframes and did not call tools → `Render status: NOT_RENDERED`  
- If you generated stills/clips → list ids/paths in Render log; status `UNVERIFIED` until render-QA  
- If human assembled → package can still ship as GENERATION_READY handoff with assembler plan  

## Quality bar

Assembler packages must still match gold fixture depth (see `examples/`) and pass `lint-package.mjs`. The path changes **how** media is built — not whether sheets, ledger, critique, or lint apply.
