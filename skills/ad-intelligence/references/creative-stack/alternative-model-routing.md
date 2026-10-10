# Alternative model routing (no Seedance / Higgsfield)

Use this when Seedance or Higgsfield are **not** connected and you still need cinematic motion — not a silent stills-only fallback by default.

**Hard rule:** Never invent a Seedance (or Higgsfield) job id, `mcp_params` receipt, or “rendered” claim if the tool was not called. Name the **actual** generator in the render plan (`wan_2_2_i2v`, `ltx_2_5`, `grok_imagine_video_1_5`, `hunyuan_video`, `kling_i2v`, …) or mark `NOT_RENDERED` with paste-ready prompts.

Three-rung structure stays intact: connected → handoff → assembler. This file is the **quality ladder inside the assembler rung** (and for peer handoffs when Seedance is unavailable).

## Quality ladder

| Priority | Route | When |
| --- | --- | --- |
| 1 | **Seedance / Higgsfield** | Connected MCP / platform — use `connected-run-protocol.md` |
| 2 | **Wan 2.2** | Best fully open default (Apache 2.0); strong T2V + I2V |
| 3 | **LTX-2.5** | Local open weights; native A/V; license check if ≥$10M revenue |
| 4 | **Grok Imagine** (`grok-imagine-video-1.5`) | xAI API or Grok available — I2V / T2V up to ~15s |
| 5 | **Other open-weight** | HunyuanVideo · CogVideoX · SkyReels — when those weights/hosts are what you have |
| 6 | **Hosted / API peers** | Kling · Runway · Veo/Sora · Hailuo · Luma · Pika — when that is the user’s stack |
| 7 | **Stills + CapCut** | Last resort when no usable video model — still sheets/ledger/lint |

**Pick the highest row you can actually run.** If the user already has Kling or Hailuo connected, use that — do not force Wan. If they only have open ComfyUI, prefer Wan → LTX → Hunyuan/Cog/SkyReels.

Assembler method (keyframes + short clips + post) applies to routes 2–7. See `assembler-pipeline.md`.

---

## 1) Wan 2.2 (preferred open path)

| | |
| --- | --- |
| **Access** | Local / ComfyUI / Diffusers / hosted open endpoints — **prompt handoff or local run** |
| **License** | Apache 2.0 on open Wan2.2 weights (verify current card before commercial ship) |
| **Strengths** | Strong T2V + I2V; MoE A14B and lighter TI2V-5B; 480p/720p class clips; large LoRA ecosystem |

**Best use cases:** product I2V from packshots; short cinematic B-roll (3–5s); self-host with no Seedance budget  

**Prompt style:** Prefer I2V — start frame = sheet Image-N; prompt = camera + lighting + physics; “no logo redraw / no new text”  
Example: `Slow 35mm push-in on frosted 30ml serum bottle, soft rim light, label stays sharp, subtle liquid shimmer, no new typography`

**Limitations:** Open T2V/I2V usually short **silent** clips — mux VO in CapCut; weaker multi-ref lock than Seedance omni  

**Assembler:** K stills → `wan_2_2_i2v` 3–5s → CapCut  

---

## 2) LTX-2.5

| | |
| --- | --- |
| **Access** | Local / ComfyUI / self-host — **prompt handoff or local run** |
| **License** | LTX-2.x Community License: commercial free under **~$10M** annual revenue (entity-wide); paid above — **confirm LICENSE** |
| **Strengths** | Native synchronized audio + video; strong camera control |

**Best use cases:** cinema units needing diegetic SFX/ambience; deliberate camera grammar  

**Prompt style:** Shot size + lens + move + light; pin start image; light SFX cues OK — captions/CTA still in post  
Example: `Macro side dolly past matte black kettle, steam curl, warm tungsten, gentle pour SFX, label readable, no on-screen logo`

**Limitations:** License cliff at $10M; heavy VRAM — short units only  

**Assembler:** Keyframe → `ltx_2_5` → trim/replace VO in post  

---

## 3) Grok Imagine (`grok-imagine-video-1.5`)

| | |
| --- | --- |
| **Access** | xAI API and/or Grok product — **API or product handoff** |
| **Strengths** | I2V start-frame lock; T2V; clips up to ~15s; native 1080p on 1.5 for T2V/I2V (per current docs) |

**Best use cases:** product I2V when xAI is available; mid-length body units before CapCut  

**Prompt style:** Still as first frame; motion + light only; no model-drawn CTA type  

**Limitations:** Credentials/spend; never invent request ids; name Grok/xAI explicitly (not Seedance)  

**Assembler:** `grok_imagine_video_1_5` (or `_lite` if cost-constrained) per beat or longer body unit  

---

## 4) Other open-weight options

Use when Wan/LTX are unavailable but local/open hosts exist. Always **confirm the current license card** before commercial ship.

### HunyuanVideo (1.5 family)

| | |
| --- | --- |
| **Access** | Local / ComfyUI / HF — **prompt handoff or local** |
| **License** | Tencent Hunyuan Community License — **geo exclusions often include EU / UK / South Korea**; MAU/commercial caps may apply — verify before ship |
| **Best for** | Cinematic motion; open experimentation; 720p/1080p-class local runs when licensed |
| **Prompt style** | I2V from sheet still; camera + lighting; lock label/color |
| **Limitations** | Territory/commercial license traps; not a drop-in for EU-heavy brands without counsel |
| **Assembler** | `hunyuan_video_i2v` short units → CapCut |

### CogVideoX (1.5 family)

| | |
| --- | --- |
| **Access** | Local / Diffusers / Comfy — **prompt handoff or local** |
| **License** | Varies by checkpoint (e.g. 2B often Apache-friendly; larger checkpoints may differ) — **read the card** |
| **Best for** | Prompt adherence; lower-memory experimentation; draft motion before hero regen |
| **Prompt style** | Concise shot grammar; start-frame lock when I2V checkpoint available |
| **Limitations** | Older / lighter than Wan 2.2 for many ad looks; duration/res limits per checkpoint |
| **Assembler** | `cogvideox_i2v` / `cogvideox_t2v` draft clips → promote winners |

### SkyReels (V3 family)

| | |
| --- | --- |
| **Access** | Local / HF / some API routes — **prompt handoff or local/API** |
| **License** | Skywork / community terms on model card — verify before ship |
| **Best for** | Multi-reference (character/object/bg); audio-guided; video-to-video / extend |
| **Prompt style** | Bind sheet refs as reference images; instruction = action + camera; avoid inventing talent |
| **Limitations** | Heavier ops; reference count/res limits; deployment maturity varies |
| **Assembler** | `skyreels_r2v` for identity-heavy UGC beats; V2V for extend — still CapCut for CTA/text |

### Also acceptable (niche)

| Tool | Note |
| --- | --- |
| **MAGI / SANA-Video / LongCat** (Apache/MIT class where applicable) | Fine if already installed — name real id; still prefer Wan as default open pick |
| **Mochi** | Older open stack; OK for drafts, not first choice for product lock |

---

## 5) Hosted / API peers

Use when the user’s paid stack already includes them (see `tool-catalog.json`). Same honesty rule: **name the real tool**.

| Tool | Prefer for | Prompt / lock tips | Assembler note |
| --- | --- | --- | --- |
| **Kling** | Motion control, character performance, product I2V | Lock start frame; camera + physics; label readable | Short locked-start clips |
| **Runway** | Director camera language, editorial / VFX-ish | Shot size + lens + move; image ref; don’t overcrowd | Editorial units → CapCut |
| **Veo / Sora** | High cinematic world-building, brand films | Scene blocks + timecodes; lighting + lens; VO in post | Cinema units when access exists |
| **MiniMax Hailuo** | Camera-controlled T2V/I2V; fast hosted iteration | Subject/start image; explicit camera verbs | Ideation + body B-roll |
| **Luma** | Keyframed start–end; fast ideation | Start/end stills from sheet; short moves | Bridge stills into motion |
| **Pika** | Social-native motion, quick hooks | Punchy move; avoid tiny text in-model | Hook tests; finish in CapCut |

If Higgsfield (or another platform) exposes these as peer models, still label **Kling/Hailuo/…** in the render plan — never relabel as Seedance.

---

## 6) Fallback — stills + CapCut

Only when **no** usable video model exists:

1. Keyframe stills from sheets  
2. Optional Ken Burns in CapCut  
3. VO / bed / captions / endcard in post  
4. Tools: `image_gen`, `capcut_assemble`  
5. `NOT_RENDERED` or real export paths after human finish  

Non-negotiables unchanged: sheets, claim ledger, one CTA, muted-first, lint, render-QA.

---

## Quick chooser

| You have… | Prefer |
| --- | --- |
| Seedance / Higgsfield MCP | Connected path — stop |
| Open Comfy / local GPU, permissive license needed | **Wan 2.2** |
| Need native audio locally, under $10M revenue | **LTX-2.5** |
| xAI / Grok API | **Grok Imagine 1.5** |
| Multi-ref talent/object lock locally | **SkyReels** (or Kling if hosted) |
| Hosted camera control, no local GPU | **Hailuo** or **Kling** |
| Brand film / world-building budget | **Veo / Sora** or **Runway** |
| Nothing video-capable | Stills + CapCut |

---

## Render plan naming (copy pattern)

```yaml
pipeline_rung: assembler
alternative_route: wan_2_2   # ltx_2_5 | grok_imagine | hunyuan | cogvideox | skyreels | kling | hailuo | luma | pika | runway | veo_sora | stills_capcut
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
- [ ] Else pick highest **available** row on the quality ladder (or user’s existing peer)  
- [ ] Name that tool in every render-plan unit  
- [ ] Prefer I2V from sheet stills over pure T2V for product/talent  
- [ ] Confirm license geo/revenue cliffs (esp. LTX, Hunyuan) before commercial claim  
- [ ] Never invent Seedance job ids  
- [ ] Lint + render-QA still required  
