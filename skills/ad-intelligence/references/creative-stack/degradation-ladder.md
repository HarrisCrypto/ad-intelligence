# Degradation ladder — video capability → deliverable quality

**Probe tools first** (`probe-harness.mjs` + tool card). Never invent a connected job id. Never default to stills if any video tool is available in the session.

Cross-links: [`alternative-model-routing.md`](./alternative-model-routing.md) · [`assembler-pipeline.md`](./assembler-pipeline.md) · [`connected-run-protocol.md`](./connected-run-protocol.md) · [`../external-resources.md`](../external-resources.md)

---

## Rung 1 — Single-pass connected

| | |
| --- | --- |
| **When** | Seedance / Higgsfield / peer MCP (or equivalent) is **connected in this session** |
| **Do** | Generate the spot (or long units) in one pass where the tool allows; **name the real tool** in the render plan |
| **Docs** | `connected-run-protocol.md` · Seedance contract · Higgsfield playbook |
| **Forbidden** | Claiming Seedance/Higgsfield jobs when the MCP was not called |

---

## Rung 2 — Keyframes → short i2v → post

| | |
| --- | --- |
| **When** | Any image-to-video (or short T2V) model is available: Kling, Wan, Grok Imagine, LTX, Veo, Runway, Hailuo, Luma, Pika, … |
| **Do** | Lock product/UI/place sheets → generate keyframe stills → short i2v clips (3–8s typical) → CapCut/post for captions, VO, bed, endcard, aspects |
| **Pick model** | Highest available on the [`alternative-model-routing.md`](./alternative-model-routing.md) ladder (prefer Wan 2.2 open → LTX-2.5 → Grok → peers) |
| **Render plan** | One row per unit with **actual** model id (`wan_2_2_i2v`, `kling_i2v`, `ltx_2_5`, …) — never a fake Seedance id |

---

## Rung 3 — Motion storyboard (no video model)

| | |
| --- | --- |
| **When** | **No** video / i2v tool exists in the session (image gen and/or text only) |
| **Do** | Emit a **director’s pre-viz**, not a slideshow |

### Motion storyboard contract (required on Rung 3)

For every beat of the timed script, deliver:

1. **Generated or specified still** (sheet-locked)  
2. **Camera move** (push / pan / handheld drift / lock-off — one clear verb)  
3. **Lighting shift** (what changes from previous beat)  
4. **Duration** (seconds) + **easing** hint  
5. **Frame-to-frame continuity** (what must match: wardrobe, pack angle, UI state, geography)  
6. **Audio event** (VO line, SFX, bed swell)  
7. **Compositor notes** — how a human or cheap editor animates the still (Ken Burns path, whip cut, overlay)

Label the package: `Pipeline rung: motion_storyboard` · `Render status: NOT_RENDERED` (unless stills were actually generated — then log job ids for stills only).

**This is NOT:** a pile of posters with slogans.  
**This IS:** a pre-viz a finisher can animate without guessing intent.

---

## Hard rules

1. **Probe before choosing a rung.**  
2. **Never default to stills/storyboard if any video tool is available.**  
3. **Never invent rendered.** Sheets, claim ledger, one CTA, lint, finish-the-cut (for the chosen rung) stay mandatory.  
4. **Name the real tool** in every render-plan row.  
5. If tools appear mid-session, **upgrade the rung** and continue — do not stay on storyboard out of habit.

## Quick decision

```text
Seedance/Higgsfield MCP live?     → Rung 1
Else any i2v/T2V available?       → Rung 2 (name Wan/LTX/Grok/Kling/…)
Else                              → Rung 3 motion storyboard (pre-viz density)
```
