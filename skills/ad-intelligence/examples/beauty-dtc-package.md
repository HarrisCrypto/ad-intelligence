# Example package — Beauty DTC (dual-track)

Synthetic teaching example. Proof marked `[PLACEHOLDER]`. Not a scraped ad.

## Ad package

### Brief (locked or assumed)
- Brand / offer: Lumenveil Barrier Serum — “all-day barrier without the mask feel”
- Niche: beauty
- Platforms: tiktok, meta, youtube_shorts
- Funnel: consideration → purchase
- Production tier: native_ugc + premium_cinema (dual)
- Virality posture: trend_reactive (viral) / brand_film (cinema)
- Proof available: pack stills [user], shade chart [PLACEHOLDER], review quotes [PLACEHOLDER]
- Tool access: prompt-handoff only
- Assumptions: 15–30s paid + organic Spark; no clinical claims without user copy

### Retrieval
- Primary pattern id: `pov-day-in-life`
- Challenger pattern id: `grwm-soft-sell`
- Flow id: `hook-demo-proof-cta`
- Hook family ids: confession_wrong, before_after_honest
- Trend class (if any): `format_meme` (POV overlay)
- Niche pack: beauty
- Swipe / longevity signals used: beauty high → POV + GRWM + macro; avoid fake clinical overlays

### Job-to-be-done (one sentence)

Make “base that survives a 10-hour shift” feel like an identity win in under 3 seconds, then one shop path.

### Creative stack (required)
- Pipeline id / posture default: viral_ugc + seedance_cinema
- Primary generator: Higgsfield ugc-video (viral) / Seedance 2.5 omni_reference (cinema)
- Supporting tools: CapCut, ElevenLabs (optional VO), Suno (paid bed), Ad Multiplier
- Connected now?: no → handoff prompts below
- Creative-stack last verified: 2026-10-10

### Consistency sheets (required before gen)
- Product sheet: filled — Lumenveil 30ml frosted glass, soft-gold cap, cream label; refs: product_hero, product_detail (label), product_in_hand
- Character sheet / Soul-ID: filled — “Maya, night-shift nurse”; face_front + face_three_quarter; warm natural makeup; scrubs top optional
- Style lock: viral = handheld daylight soft; cinema = macro 100mm, cool-room key + warm rim
- Multi-angle refs listed: product_hero, product_detail, product_in_hand, face_front, face_three_quarter

### Hooks (3–5)
1. `POV: your base finally survives a 10-hour shift`
2. `I stopped blotting every 90 minutes`
3. `The serum under my SPF that didn’t pill [PLACEHOLDER shade]`
4. Duet bait: `duet if your foundation fails by lunch`
5. Cinema mute: extreme label macro → pour → skin sheen (no text until 2s)

### Timed script
| t | Visual | VO / text | Purpose |
| --- | --- | --- | --- |
| 0–2s | Mirror selfie, soft AM light; Maya Soul-ID lock | Overlay: POV line | Thumb-stop |
| 2–10s | Commute / desk / coffee; bottle briefly in bag (product lock) | Sparse / silent | Desire context |
| 10–20s | Quick apply + skin texture; label readable at rest | “Only step I don’t skip.” | Mechanism |
| 20–28s | End-of-day same mirror; same lighting | Review [PLACEHOLDER] or omit | Proof honesty |
| 28–32s | Clean end pose; lower 20% quiet | Soft CTA: Shop Lumenveil | CTA |

### Shot list / visual system
- A-cam: front mirror (locked framing for before/after honesty)
- B: bag → product_in_hand scale
- C: apply macro (product_detail consistent)
- Endcard: logo SVG in CapCut only

### Seedance / film-gen execution (copy-paste)
```yaml
tool: seedance
model: seedance_2_5
mode: omni_reference
duration_s: 15
resolution: 1080p
aspect_ratio: "9:16"
generate_audio: true
bitrate_mode: high
product_sheet: "Lumenveil Barrier Serum — frosted 30ml, soft-gold cap"
character_sheet: "N/A for pure macro twin; Maya sheet for hybrid"
style_lock:
  grade: "cool key, warm rim, soft beauty"
  lens: "macro 100mm"
  motion_bias: "slow push + controlled pour"
references:
  - role: product_hero
    file: "[LUMENVEIL_HERO.png]"
  - role: product_detail
    file: "[LUMENVEIL_LABEL.png]"
  - role: product_in_hand
    file: "[LUMENVEIL_HAND.png]"
negative:
  - "blurry logo, melted text, fake clinical charts, identity drift, watermark"
```

```text
COMMERCIAL AD SPOT — beauty — beauty-macro-tabletop
Job-to-be-done: Make barrier serum feel inevitable via texture desire, then one CTA.
Style: macro · Grade: cool key warm rim · Lens: 100mm
STYLE LOCK: same grade/lens full duration.
PRODUCT SHEET LOCK — frosted 30ml, soft-gold cap, cream label from refs; no alternate packaging.
TIMELINE:
0–2s HOOK: label macro light streak — no logo endcard yet.
2–8s BODY: controlled pour + skin applique matching product colorway.
8–12s PROOF: soft sheen result — no invented % on screen.
12–15s CTA: hero pack resting; leave lower 20% for caption.
AUDIO: soft whoosh; music energy low. No copyrighted titles.
```

### Higgsfield execution brief (if relevant)
- Workflow: ugc-video (viral) + generate_video seedance_2_5 (cinema)
- Model / preset: UGC Product Review / Seedance 2.5
- Inputs to upload: product sheet stills + Maya face refs
- Consistency locks: product / Soul-ID Maya / dual style locks
- Variants: A silent captions · B storytime VO · C stitch bait

### Other tool prompts (Kling/Runway/MJ/VO/music)
- Suno: instrumental soft beauty bed, no vocals, 30s, paid-safe
- CapCut: burn POV hook 0–3s; endcard logo last 3s

### Caption track (muted-first)
0–2s POV line → 10s “only step I don’t skip” → end “Shop Lumenveil”

### Paid social copy
- Primary text: Your base shouldn’t quit before you do. Barrier serum under SPF — shop the routine.
- Headline: All-day barrier feel
- Description: [PLACEHOLDER shade] · Real reviews only when supplied

### Static / carousel twin (if any)
3 cards: problem oil blot → apply still → pack + CTA

### CTA
- Primary (only one in-cut): Shop Lumenveil
- Alternates (A/B only): Link in bio · “Shade quiz” if landing exists

### A/B matrix
| Variant | What changes | Tool action | Hypothesis |
| --- | --- | --- | --- |
| A | Silent captions | CapCut only | Muted feeds |
| B | Storytime VO | ElevenLabs | Sound-on lift |
| C | Stitch bait hook | region edit 0–3s | Share rate |

### Dual-track twin
- Viral/native: `pov-day-in-life` with Maya Soul-ID
- High-production / Seedance-cinema: `beauty-macro-tabletop` same JTBD
- Shared JTBD: all-day barrier identity win → one shop path

### Self-critique & variants (mandatory)

| Dimension | Score | Note |
| --- | --- | --- |
| thumbstop | 5 | POV format signal ≤1s |
| clarity | 5 | Barrier job clear by 8s |
| native_fit | 5 | Handheld UGC vs intentional macro |
| desire_or_proof | 4 | Sensory strong; proof is PLACEHOLDER |
| cta_hygiene | 5 | One CTA |
| production_truth | 5 | Sheets + dual tier honest |

**Likely failure modes for this niche/platform (2–3):**
1. `fm_fake_proof` — beauty ads invent % / clinical charts
2. `fm_identity_drift` — pack or face morph under soft beauty filters
3. `fm_muted_fail` — POV fails without huge burned text

**Concrete variants that attack those failures:**
| Variant | Targets failure # | Change | Expected fix |
| --- | --- | --- | --- |
| A | 1 | Omit on-screen numbers; texture-only proof | Honest desire |
| B | 2 | Re-assert omni refs; disable beauty morph | Pack/face lock |
| C | 3 | Larger 0–2s overlay; silent bed | Muted thumb-stop |

### Scale plan
- Ad Multiplier: shade cast swaps with new character sheets; keep product sheet
- Spark whitelist Maya organic if release on file

### AI disclosure & rights
- Synthetic media used?: partial if AI Maya; no if real talent
- Platform disclosure required?: yes if AI talent — TikTok/Meta AI labels
- Audio rights: Suno original for paid; trend sound organic-only twin
- Faces / talent release: `[PLACEHOLDER]`
- Footage / UGC license: brand-owned stills
- Likeness / deepfake policy: no celebrity clone
- Claims to avoid: medical/clinical cure language
- Rights decision: paid-safe with original audio + disclosure if AI

### Rights & compliance (detail)
- Audio: original bed paid
- Faces / footage: release required for Maya
- Claims to avoid: “clinically proven” without user proof

### Landing / store / bio mirror
Hook “10-hour shift” → PDP hero line same benefit; shade [PLACEHOLDER]

### First-time-right QA
- Checklist gates: PASS (assumed for example)
- Rubric dims: all ≥4
- Consistency sheets gate: pass
- Self-critique gate: pass
- Mistakes library hits rewritten: yes
- Seedance/Higgsfield quality bar: pass
