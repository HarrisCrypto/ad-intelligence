# Example package — Physical product (consumer electronics)

Synthetic teaching example. Proof marked `[PLACEHOLDER]`. Not a scraped ad.

## Ad package

### Brief (locked or assumed)
- Brand / offer: Nimbus Buds S2 — flagship ANC earbuds launch
- Niche: ecommerce (consumer electronics)
- Platforms: tiktok, meta, youtube, ctv_ott
- Funnel: awareness → purchase
- Production tier: native_ugc + premium_cinema
- Virality posture: brand_film + unboxing
- Proof available: pack/product multi-angle stills, charging case, [PLACEHOLDER lab ANC claim — omit until supplied]
- Tool access: prompt-handoff only
- Assumptions: Dual-track unboxing ASMR + 30s hero film; one capability as experience (not bullet list)

### Retrieval
- Primary pattern id: `unboxing-asmr` (viral) / `hero-product-film` (cinema)
- Challenger pattern id: `product-loop-demo`
- Flow id: `spectacle-desire-cta`
- Hook family ids: unboxing_texture, spectacle_interrupt
- Trend class (if any): n/a for cinema; light ASMR organic
- Niche pack: ecommerce
- Swipe / longevity signals used: ecommerce high → loop demo, unboxing, hero film; avoid logo-first / melting packs

### Job-to-be-done (one sentence)

Brand memory for flagship buds via material desire, then one “Shop Nimbus” path.

### Creative stack (required)
- Pipeline id / posture default: unbox_ugc + seedance_hero
- Primary generator: Seedance 2.5 omni_reference; Higgsfield ugc-video unboxing
- Supporting tools: CapCut, Suno, product-photoshoot stills, Ad Multiplier colorways
- Connected now?: no → handoff
- Creative-stack last verified: 2026-10-10

### Consistency sheets (required before gen)
- Product sheet: matte graphite buds + case, silver hinge, embossed N mark; refs: product_hero, product_front, product_detail (hinge/logo), product_in_hand, product_open (buds in case)
- Character sheet / Soul-ID: “Sam — unbox creator” for UGC track; cinema can be faceless hands only (hands continuity notes on sheet)
- Style lock: UGC = desk lamp warm handheld; cinema = hard product key, anamorphic 40mm feel, controlled turntable
- Multi-angle refs: all product roles above + face_front if Sam on camera

### Hooks (3–5)
1. Case open ASMR — no logo
2. Macro material + light streak (cinema)
3. `The hinge doesn’t creak` (tactile claim only if true)
4. Commute mute world (experience — no dB number unless supplied)
5. Loop: buds snap-in ×3

### Timed script — cinema 30s
| t | Visual | VO / text | Purpose |
| --- | --- | --- | --- |
| 0–3s | Macro material + light streak; no logo | — | Spectacle |
| 3–18s | Human commute context + kinetic product moves (lock) | Sparse VO | Desire |
| 18–26s | One capability as experience (quiet street) | Optional | Proof-feel |
| 26–30s | Signature endcard CapCut | Shop Nimbus | CTA |

### Timed script — viral unbox 20s
| t | Visual | VO / text | Purpose |
| --- | --- | --- | --- |
| 0–2s | Box texture / peel | ASMR / text `unboxing the S2` | Hook |
| 2–12s | Case open, buds in-hand scale | Soft VO | Desire |
| 12–18s | Snap-in loop + wear | — | Demo |
| 18–20s | Pack + CTA | Shop | CTA |

### Shot list / visual system
- Turntable 30° match product_hero
- In-ear wear only if character sheet allows
- Endcard logo official SVG

### Seedance / film-gen execution (copy-paste)
```yaml
tool: seedance
model: seedance_2_5
mode: omni_reference
duration_s: 30
aspect_ratio: "9:16"
generate_audio: true
bitrate_mode: high
product_sheet: "Nimbus Buds S2 — matte graphite, silver hinge, embossed N"
character_sheet: "faceless hands OR Sam unbox"
style_lock:
  grade: "hard product key, cool shadows"
  lens: "anamorphic 40mm feel / macro inserts"
  motion_bias: "slow dolly + turntable"
references:
  - role: product_hero
    file: "[BUDS_HERO.png]"
  - role: product_detail
    file: "[HINGE_LOGO.png]"
  - role: product_in_hand
    file: "[IN_HAND.png]"
  - role: product_open
    file: "[CASE_OPEN.png]"
negative:
  - "melted logo, extra buds, wrong colorway, fake dB overlays, identity drift"
```

```text
COMMERCIAL AD SPOT — ecommerce — hero-product-film
Job-to-be-done: Flagship memory via material desire → Shop Nimbus.
PRODUCT SHEET LOCK — exact silhouette, graphite colorway, silver hinge, embossed N from refs.
STYLE LOCK: hard product grade full duration.
TIMELINE:
0–3s HOOK: macro light streak — no endcard logo yet.
3–18s BODY: commute + product kinetic; match refs every frame.
18–26s: quiet-world experience — NO invented ANC numbers on screen.
26–30s CTA: hero pack; lower 20% for caption.
PHYSICS: believable materials; no morphing case.
```

### Higgsfield execution brief
- Workflow: ugc-video Unboxing + seedance generate_video
- Inputs: full product sheet stills; Sam faces if used
- Consistency locks: product / optional Soul-ID / dual style
- Variants: colorway, hook 0–3s, CTA line

### Other tool prompts
- Kling i2v: slow push from product_hero, 5–8s hook tests
- Suno: cinematic short bed, no vocals, paid-safe
- CapCut: captions + endcard

### Caption track (muted-first)
Cinema: minimal until CTA · Unbox: `unboxing the S2` → `Shop Nimbus`

### Paid social copy
- Primary text: Meet Nimbus Buds S2. Feel the build. Then hear the quiet. Shop now.
- Headline: Nimbus Buds S2
- Description: ANC details [PLACEHOLDER] — omit if not supplied

### Static / carousel twin
Hero still → open case → in-hand → CTA

### CTA
- Primary: Shop Nimbus
- Alternates: Learn more (YT only A/B)

### A/B matrix
| Variant | What changes | Tool action | Hypothesis |
| --- | --- | --- | --- |
| A | Spectacle hook | Seedance edit 0–3s | Thumb-stop |
| B | Unbox ASMR hook | ugc-video | Native CTR |
| C | Colorway graphite vs white | Ad Multiplier | SKU preference |

### Dual-track twin
- Viral/native: `unboxing-asmr` + Sam Soul-ID
- High-production: `hero-product-film` Seedance
- Shared JTBD: material desire → Shop Nimbus

### Self-critique & variants (mandatory)

| Dimension | Score | Note |
| --- | --- | --- |
| thumbstop | 5 | Macro/unbox interrupt |
| clarity | 5 | Flagship buds clear |
| native_fit | 5 | Dual tiers intentional |
| desire_or_proof | 4 | Sensory strong; lab claims omitted |
| cta_hygiene | 5 | One CTA |
| production_truth | 5 | Product lock enforced |

**Likely failure modes:**
1. `fm_identity_drift` — buds morph / wrong color
2. `fm_fake_proof` — fake dB / award badges
3. `fm_logo_first` — cold logo open on cinema

**Concrete variants:**
| Variant | Targets failure # | Change | Expected fix |
| --- | --- | --- | --- |
| A | 1 | Re-upload multi-angle; strengthen negative | Pack lock |
| B | 2 | Strip all numeric overlays | Honesty |
| C | 3 | Force 0–3s macro without logo | Thumb-stop |

### Scale plan
- Ad Multiplier: colorways + markets; new product sheet per SKU
- CTV 16:9 twin from same Seedance brief

### AI disclosure & rights
- Synthetic media used?: yes for gen cinema; disclose if required on Meta/YT
- Platform disclosure required?: check CTV publisher + Meta/TikTok AI labels
- Audio rights: original Suno paid
- Faces: Sam release `[PLACEHOLDER]`
- Footage: brand stills
- Likeness: no celebrity
- Claims to avoid: unverified ANC numbers, “#1 earbuds”
- Rights decision: paid-safe with disclosure + cleared audio

### Rights & compliance (detail)
- Electronics claims follow user legal copy only
- Music cleared for CTV

### Landing / store / bio mirror
PDP hero = same “feel the build / hear the quiet” line; SKU S2

### First-time-right QA
- Checklist gates: PASS (example)
- Rubric dims: ≥4
- Consistency sheets gate: pass
- Self-critique gate: pass
- Mistakes library hits rewritten: yes
- Seedance/Higgsfield quality bar: pass
