# Example package — Entertainment / creator

Synthetic teaching example. Proof marked `[PLACEHOLDER]`. Not a scraped ad.

## Ad package

### Brief (locked or assumed)
- Brand / offer: Night Circuit — indie racing series Ep. 4 drop + merch
- Niche: entertainment / creator
- Platforms: tiktok, youtube_shorts, organic_short, influencer_seed
- Funnel: awareness → follows → merch
- Production tier: native_ugc + hybrid_polished BTS
- Virality posture: share_engineered / series
- Proof available: episode stills [PLACEHOLDER], BTS clips [PLACEHOLDER], merch packshot
- Tool access: prompt-handoff only
- Assumptions: Dual-track series cliffhanger + BTS making-of; one CTA = watch Ep.4 (merch secondary in caption only)

### Retrieval
- Primary pattern id: `series-cliffhanger`
- Challenger pattern id: `bts-making-of`
- Flow id: `hook-escalate-cliff-cta`
- Hook family ids: (series) spectacle_interrupt + stitch bait
- Trend class (if any): format for duet/stitch optional
- Niche pack: entertainment / creator
- Swipe / longevity signals used: entertainment high → cliffhanger, BTS, duet; avoid teleprompter hard-sell / unclear IP

### Job-to-be-done (one sentence)

Make viewers need Episode 4 tonight — one watch path — while keeping character and world consistent.

### Creative stack (required)
- Pipeline id / posture default: series_cliff + bts
- Primary generator: CapCut/Katana from real episode plates; Seedance only for interstitial world glue with character sheet
- Supporting tools: CapCut, Suno (cleared), Spark creators, Ad Multiplier for hook swaps
- Connected now?: no → handoff
- Creative-stack last verified: 2026-10-10

### Consistency sheets (required before gen)
- Product sheet: merch hoodie black/neon violet; series title card lock; car #47 livery refs if shown
- Character sheet / Soul-ID: “Rae — driver lead” face_front, three_quarter, wardrobe racing suit violet accents; **rights required**
- Style lock: night neon cyan/magenta grade; handheld pit energy for BTS; tighter anamorphic for cliffhanger trailer
- Multi-angle refs: rae faces, suit, car_47, hoodie_merch, title_card

### Hooks (3–5)
1. Cold open almost-crash freeze → `Ep.4 tonight`
2. `We almost didn’t make it out of Turn 9`
3. Stitch bait: `stitch if you’d take the inside`
4. BTS: helmet cam chaos 1s
5. Silent: eyes close-up Soul-ID → cut to title

### Timed script — cliffhanger 21s
| t | Visual | VO / text | Purpose |
| --- | --- | --- | --- |
| 0–2s | Spectacle almost-crash; Rae Soul-ID | Text: Turn 9 | Thumb-stop |
| 2–12s | Escalate rivalry / pit tension; world lock | Sparse VO | Desire |
| 12–18s | Freeze on choice; series title | `Ep.4 drops tonight` | Cliff |
| 18–21s | Watch CTA only | Watch Night Circuit | CTA |

### Timed script — BTS 20s
| t | Visual | VO / text | Purpose |
| --- | --- | --- | --- |
| 0–3s | Clapper / messy pit | `making Ep.4` | Format signal |
| 3–14s | Craft moments; same Rae lock | Soft | Trust / love |
| 14–20s | Title + watch | Watch | CTA |

### Shot list / visual system
- Prefer licensed episode plates over gen faces
- Seedance interstitial only with Soul-ID refs
- Merch pack for secondary organic post — not second CTA in trailer

### Seedance / film-gen execution (copy-paste)
```yaml
tool: seedance
model: seedance_2_5
mode: omni_reference
duration_s: 12
aspect_ratio: "9:16"
generate_audio: true
product_sheet: "Night Circuit title card + car #47 livery + hoodie"
character_sheet: "Rae driver — violet suit accents"
style_lock:
  grade: "night neon cyan/magenta"
  lens: "anamorphic night"
  motion_bias: "aggressive handheld inserts"
references:
  - role: face_front
    file: "[RAE_FRONT.png]"
  - role: face_three_quarter
    file: "[RAE_34.png]"
  - role: product_hero
    file: "[CAR_47.png]"
  - role: style_or_talent
    file: "[TITLE_CARD.png]"
negative:
  - "celebrity lookalike, identity drift, melted title, unclear IP plates, multi-CTA spam"
```

```text
COMMERCIAL / TRAILER BEAT — entertainment — series-cliffhanger
Job-to-be-done: Need Ep.4 tonight → one watch path.
CHARACTER / SOUL-ID LOCK — Rae exact from face refs; same suit accents.
STYLE LOCK: night neon grade full beat.
TIMELINE:
0–2s HOOK: almost-crash spectacle — no merch hard-sell.
2–8s BODY: rivalry escalate; car #47 matches ref.
8–12s CLIFF + CTA: title card; watch only.
Do not invent view counts or “#1 series” badges.
```

### Higgsfield execution brief
- Workflow: katana (preferred on real plates) or seedance for glue; ugc-video for host rant optional
- Inputs: Rae sheet, car, title, BTS clips
- Consistency locks: Soul-ID Rae + livery + neon grade
- Variants: A crash hook · B stitch bait · C BTS cold open

### Other tool prompts
- CapCut: series endcard template locked
- Creator Spark brief: must-say Ep.4 tonight; do-not-say fake metrics; FTC if paid

### Caption track (muted-first)
`Turn 9` → escalate → `Ep.4 tonight` → `Watch Night Circuit`  
Caption-only: merch link optional

### Paid social copy
- Primary text: Turn 9 almost ended it. Episode 4 drops tonight — watch Night Circuit.
- Headline: Ep.4 tonight
- Description: Series · [PLACEHOLDER platform URL]

### Static / carousel twin
3 stills: freeze frame → title → watch CTA

### CTA
- Primary (only one in-cut): Watch Night Circuit Ep.4
- Alternates: Follow for Ep.5 (organic series) — not simultaneous hard CTAs

### A/B matrix
| Variant | What changes | Tool action | Hypothesis |
| --- | --- | --- | --- |
| A | Crash hook | edit 0–2s | Thumb-stop |
| B | Stitch bait | organic | Shares |
| C | BTS cold open | challenger cut | Comment love |

### Dual-track twin
- Viral/native: series-cliffhanger + stitch
- High-production: polished trailer grade same JTBD; BTS as trust twin
- Shared JTBD: need Ep.4 → watch

### Self-critique & variants (mandatory)

| Dimension | Score | Note |
| --- | --- | --- |
| thumbstop | 5 | Spectacle ≤2s |
| clarity | 5 | Ep.4 watch job clear |
| native_fit | 5 | Shorts-native cliff |
| desire_or_proof | 4 | Story desire; no fake views |
| cta_hygiene | 5 | Watch only in cut |
| production_truth | 5 | Soul-ID + IP caution |

**Likely failure modes:**
1. `fm_multi_cta` — watch + merch + follow spam
2. `fm_identity_drift` — Rae face drift in gen glue
3. `fm_no_disclosure` / IP — uncleared plates or unlabeled AI Rae

**Concrete variants:**
| Variant | Targets failure # | Change | Expected fix |
| --- | --- | --- | --- |
| A | 1 | Merch only in caption | One CTA |
| B | 2 | Prefer real plates; Soul-ID strict | Identity |
| C | 3 | Rights tree + AI label if gen | Compliance |

### Scale plan
- Weekly cliff hooks via region edit; Spark 5 creators before paid
- Ad Multiplier: hook swaps keep Rae sheet

### AI disclosure & rights
- Synthetic media used?: only if Seedance glue — disclose; prefer real episode
- Platform disclosure required?: yes if AI-altered Rae
- Audio rights: cleared series bed / original; trend sound organic-only
- Faces / talent release: Rae `[PLACEHOLDER]` required for paid
- Footage / UGC license: episode IP owned/licensed — never scraped
- Likeness / deepfake policy: no celebrity drivers
- Claims to avoid: fake view counts, “Netflix #1” style lies
- Rights decision: paid-safe only with IP + releases + disclosure

### Rights & compliance (detail)
- Music Content ID check for YT
- Influencer FTC paid partnership
- Stitch/duet: follow platform reuse rules

### Landing / store / bio mirror
Bio link = Ep.4 watch URL; merch separate link tree item not conflicting CTA

### First-time-right QA
- Checklist gates: PASS (example)
- Rubric dims: ≥4
- Consistency sheets gate: pass
- Self-critique gate: pass
- Mistakes library hits rewritten: yes
- Seedance/Higgsfield quality bar: pass
