# Alternative model routing (no Seedance / Higgsfield)

Use this when Seedance or Higgsfield are **not** connected and you still need cinematic motion — not a silent stills-only fallback by default.

**Hard rule:** Never invent a Seedance (or Higgsfield) job id, `mcp_params` receipt, or “rendered” claim if the tool was not called. Name the **actual** generator in the render plan (`wan_2_2_i2v`, `ltx_2_5`, `grok_imagine_video_1_5`, `kling_i2v`, …) or mark `NOT_RENDERED` with paste-ready prompts.

Three-rung structure stays intact: connected → handoff → assembler. This file is the **quality ladder inside the assembler rung** (and for peer handoffs when Seedance is unavailable).

## Quality ladder

| Priority | Route | When |
| --- | --- | --- |
| 1 | **Seedance / Higgsfield** | Connected MCP / platform — use `connected-run-protocol.md` |
| 2 | **Wan 2.2** | Best fully open option (Apache 2.0 weights); strong T2V + I2V |
| 3 | **LTX-2.5** | Local open weights; native A/V; camera control; license check if ≥$10M revenue |
| 4 | **Grok Imagine** (`grok-imagine-video-1.5`) | xAI API or Grok available — I2V / T2V up to ~15s |
| 5 | **Peers already in catalog** | Kling · Runway · Veo/Sora — when those are what the user has |
| 6 | **Stills + CapCut** | Last resort when no usable video model — still sheets/ledger/lint |

Assembler method (keyframes + short clips + post) applies to routes 2–6. See `assembler-pipeline.md`.

---

## 1) Wan 2.2 (preferred open path)

| | |
| --- | --- |
| **Access** | Local / ComfyUI / Diffusers / hosted open endpoints — **prompt handoff or local run** (not Seedance) |
| **License** | Apache 2.0 on open Wan2.2 weights (verify current card before commercial ship) |
| **Strengths** | Strong T2V + I2V; MoE A14B and lighter TI2V-5B; 480p/720p class clips |

**Best use cases**
- Product motion from a locked packshot (I2V)
- Short cinematic B-roll units (3–5s) for assembler timelines
- Open-weight / self-host pipelines with no Seedance budget

**Key prompt style**
- Prefer **I2V**: start frame = sheet Image-N; prompt = camera move + lighting + physics only
- Lock: product color/label, lens language, “no logo redraw / no new text”
- Example: `Slow 35mm push-in on frosted 30ml serum bottle, soft rim light, label stays sharp, subtle liquid shimmer, no new typography`

**Limitations**
- Open T2V/I2V weights are typically **short silent clips** (~5s class); mux VO/bed in CapCut
- Identity lock weaker than multi-ref Seedance omni — re-use the same start stills
- Do not ask the model for perfect endcard text or logo kerning

**Assembler fit**
- K1/K2 stills (FLUX/real) → C1/C2 Wan I2V 3–5s → CapCut captions/CTA/endcard
- Render plan `tool:` `wan_2_2_i2v` / `wan_2_2_t2v`

---

## 2) LTX-2.5

| | |
| --- | --- |
| **Access** | Local / ComfyUI / self-host — **prompt handoff or local run** |
| **License** | LTX-2.x Community License: commercial free under **~$10M** annual revenue (entity-wide); paid Commercial Use Agreement at/above — **confirm LICENSE before ship** |
| **Strengths** | Native synchronized audio + video; text/image/video-conditioned A/V; strong camera control |

**Best use cases**
- Cinema units that need diegetic SFX / ambience with picture
- Short hero clips with deliberate camera grammar
- Local production when Seedance is unavailable but GPU is available

**Key prompt style**
- Shot size + lens + move + lighting in one block; pin start image for product
- Call out audio intent lightly (`soft pour SFX`, `room tone`) — still burn captions/CTA in post
- Example: `Macro side dolly past matte black kettle, steam curl, warm tungsten practicals, gentle pour SFX, label readable, no on-screen logo`

**Limitations**
- License cliff at $10M revenue (parents/affiliates count)
- Local VRAM / runtime heavy — plan short units, not one 30s fantasy pass
- Tiny brand text and legal still finish in CapCut

**Assembler fit**
- Keyframe → LTX I2V/T2V unit with native audio → trim/replace VO in post if needed
- Render plan `tool:` `ltx_2_5`

---

## 3) Grok Imagine (`grok-imagine-video-1.5`)

| | |
| --- | --- |
| **Access** | xAI API (`grok-imagine-video-1.5`) and/or Grok product — **API or product handoff** when credentials exist |
| **Strengths** | Image-to-video with start-frame lock; T2V; clips up to ~15s; native 1080p on 1.5 for T2V/I2V; optional references / voices on current 1.5 docs |

**Best use cases**
- Product I2V from sheet stills when xAI is available
- Mid-length cinema units (8–15s) before CapCut assemble
- Fast iteration when open-weight local GPU is not available

**Key prompt style**
- Pass sheet still as `image` (first frame); prompt = motion + light only
- Keep aspect from the still for I2V; avoid model-drawn CTA type
- Example: `Gentle orbit around product on slate, soft overhead diffusion, label locked, no text overlay`

**Limitations**
- Requires xAI/Grok access and spend — not a free open-weight path
- API shapes evolve — emit prompt + model id; do **not** invent request ids
- Still prefer post for captions, logo, legal

**Assembler fit**
- One Grok I2V unit per beat **or** longer body unit + separate hook unit
- Render plan `tool:` `grok_imagine_video_1_5` (or `grok_imagine_video_1_5_lite` if cost-constrained)
- If only chat Grok is available: paste-ready prompt handoff; `NOT_RENDERED` until export exists

**Honesty:** Higgsfield catalogs sometimes list `grok_video_v15` as a peer model — that does **not** mean Seedance ran. Name Grok/xAI explicitly when that is the route.

---

## 4) Existing peers (catalog)

Use when the user’s stack already includes them (see `tool-catalog.json`):

| Tool | Prefer for | Assembler note |
| --- | --- | --- |
| **Kling** | Motion control, character performance, product I2V | Short locked-start clips |
| **Runway** | Director camera language, editorial VFX-ish moves | Image ref + concise shot grammar |
| **Veo / Sora** | High cinematic world-building, brand films | Scene blocks + timecodes; VO in post |

Same rule: name the real tool in the render plan; never substitute a fake Seedance receipt.

---

## 5) Fallback — stills + CapCut

Only when **no** usable video model exists:

1. Generate or collect keyframe stills from sheets  
2. Optional micro-motion (Ken Burns) in CapCut  
3. VO / bed / captions / endcard in post  
4. Render plan tools: `image_gen`, `capcut_assemble`  
5. Status `NOT_RENDERED` or list real export paths after human finish  

Non-negotiables unchanged: sheets, claim ledger, one CTA, muted-first, lint, render-QA.

---

## Render plan naming (copy pattern)

```yaml
pipeline_rung: assembler
alternative_route: wan_2_2   # or ltx_2_5 | grok_imagine | kling | runway | veo_sora | stills_capcut
units:
  - unit_id: K1
    type: keyframe
    tool: flux_or_real_still
    sheet_refs: [1, 2]
  - unit_id: C1
    type: clip
    duration_s: 5
    tool: wan_2_2_i2v          # ← real name — never seedance_* unless called
    start_from: K1
finish:
  - captions_srt
  - one_cta
  - aspects: ["9:16", "1:1"]
```

## Agent checklist

- [ ] Seedance/Higgsfield connected? → use them; stop here  
- [ ] Else pick highest available row on the quality ladder  
- [ ] Name that tool in every render-plan unit  
- [ ] Prefer I2V from sheet stills over pure T2V for product/talent  
- [ ] Never invent Seedance job ids  
- [ ] Lint + render-QA still required  
