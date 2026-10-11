# Human assembly playbook — how practitioners actually put the ad together

**Not** brainstorming. **Not** dumping stills on a timeline and panning.  
This is the order a working editor / performance creative uses once the study and materials exist.

Pair with: [`human-build-os.md`](./human-build-os.md) · [`human-build-log.template.md`](./human-build-log.template.md) · [`../footage/RULE.md`](../../../library/footage/RULE.md) · [`finish-the-cut.md`](../prompts/finish-the-cut.md) · [`creative-stack/assembler-pipeline.md`](./creative-stack/assembler-pipeline.md)

```bash
# Emit a CapCut-ready shot→asset plan from a study card
node library/scripts/assemble-plan.mjs --card hvac-missed-call-void-01 --niche home-services
```

---

## What humans do that agents skip

| Human habit | Agent failure mode |
| --- | --- |
| Cut between **different photographed setups** | One canvas, new slogans |
| Lay **audio early** (ring → silence → VO → bed) | Silent 8s “hook” as the ad |
| Pull **B-roll by job** (vehicle, phone, hands) then grade | Filename shopping / Ken-Burns stills |
| Burn **type/logo/CTA in post** | Hope the model draws readable UI text |
| One CTA held ≥3s in safe zone | Multi-CTA endcard spam |
| Log what was used and why | Invented job ids / no ledger |

---

## Assembly order (mandatory sequence)

```text
0. STUDY — steal structure only (timing, shot jobs, text density)
1. MATERIALS — select-footage by bucket; assert ceiling; never substitute stills
2. PRODUCT LOCK — UI kit / pack sheet (generate flat UI if no captures)
3. TIMELINE SKELETON — place clips on the beat sheet BEFORE generating fluff
4. AUDIO BED — ring/SFX + room tone + VO scratch + licensed bed under
5. MOTION FILL — i2v / connected gen only where stock/UI still leaves a hole
6. TYPE IN POST — captions, logo, CTA, legal (CapCut owns kerning)
7. EXPORT + QA — aspects, loudness, render-qa.json, human-build LOG
```

Skip step 5 if the bucket clips + UI stills already cover every second.  
**Higgsfield / Seedance** sit in step 5 (or replace steps 3–5 when Rung 1 connected) — they do not replace materials selection or post type.

---

## Shot job → footage bucket (home-services)

| Shot job (study card purpose) | Bucket | Notes |
| --- | --- | --- |
| Missed-call / ring / after-hours phone | `hook_phone_ring` | Diegetic ring SFX over clip |
| Van / bay / geo trust | `hook_vehicle` | Hard cut — different setup than phone |
| Hands / tools / work proof | `problem_hands_tools` | Macro; no logo |
| Owner / tech face | `person_face` | Optional; disclosure if synthetic |
| Product answers / UI demo | `product_screen` | Prefer real screen-record; stock = niche_fit med |
| House / job site establish | `place_job_site` | P1 — use when geo needs place |
| Booked / confirm | `result_booking` | Often same UI kit as product_screen |
| Cost / empty calendar / stress | `money_or_cost` | P2 — only if PAS needs cost beat |
| Endcard | — | CapCut E1 + bed; **not** a footage bucket |

```bash
node library/scripts/select-footage.mjs --niche home-services --bucket hook_phone_ring
```

Eligible = `kind:video` + `motion_confirmed` + `niche_fit` high|med + `reject:false`.  
Gap → report + i2v on a **vetted still** in `library/stills/` **or** lower ceiling. Never drop a still into the footage slot.

---

## CapCut timeline (24s void→answer archetype)

Humans build this left-to-right, audio tracks live from minute one:

| t | V1 picture | A1 / A2 | Type (post) |
| --- | --- | --- | --- |
| 0–3s | `hook_phone_ring` clip | `sfx_phone_ring` + `amb_room_tone_owned` | ≤4 words muted-first (“Missed. Again.”) |
| 3–8s | `hook_vehicle` **or** empty bay / hands | ring tails → silence / whoosh | “Job walks” |
| 8–14s | UI idle→answered (`product_screen` or UI kit stills) | `sfx_ui_click` + VO | “Answered” |
| 14–20s | UI confirm / `result_booking` | VO | “Booked” |
| 20–24s | Hold / grade match | `bed_*` under | E1 one CTA ≥3s |

**Hard cuts** between setups (phone desk ≠ van ≠ flat UI). Same canvas with new words fails the FB/TikTok look test even with perfect VO.

---

## Connected (Higgsfield / Seedance) vs assembler

| If probe finds… | Human does… |
| --- | --- |
| Seedance / Higgsfield MCP live | Still select B-roll buckets for truth; use connected gen for identity-locked hero/UI units; **name the tool**; post still owns type |
| Only short i2v | Keyframes from sheets + bucket clips → short i2v bridges → CapCut |
| No video model | Motion storyboard (degradation Rung 3) — director pre-viz, not slideshow |

Never claim connected jobs you did not run. Never stay on storyboard when a video tool appeared mid-session.

---

## Per-shot checklist (editor’s eye)

For every beat before export:

1. **Setup change?** Different camera / place / light than previous beat  
2. **Asset id logged?** Footage id or UI kit state + why  
3. **Audio event?** Ring, click, VO line, or intentional silence  
4. **Text owner?** Model must not burn endcard/CTA type  
5. **Claim safe?** No invented call counts on screen  

---

## Done (human definition)

- Full timed duration on the timeline (not hook-only)  
- Audio laid (VO and/or SFX and/or bed) — silent export ≠ finished  
- One CTA ≥3s · muted-first readable  
- `assemble-plan.mjs` (or equivalent) shows bucket picks + gaps honestly  
- Brief states **`achieved_rung`** from `assert-assets` (honest ceiling — free stock ≠ top-decile)  
- Human-build **log** filled with real receipts  
- `render-qa.json` after export  

Studies teach *what* to steal. **This file teaches the hands on the timeline.**
