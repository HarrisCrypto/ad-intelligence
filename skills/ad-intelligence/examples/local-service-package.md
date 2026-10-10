# Example package — Local service (HVAC)

Synthetic teaching example. Proof marked `[PLACEHOLDER]`. Not a scraped ad.

## Ad package

### Brief (locked or assumed)
- Brand / offer: Harbor Air Pros — same-day AC repair, North Shore ZIP cluster
- Niche: local-services
- Platforms: meta, youtube, organic_short
- Funnel: leads (calls)
- Production tier: hybrid_polished
- Virality posture: brand_trust
- Proof available: facility photo, tech WIP clip [PLACEHOLDER], Google review text [PLACEHOLDER], phone
- Tool access: prompt-handoff only
- Assumptions: Geo = North Shore; specialty = AC repair; dual-track optional B-roll cinema

### Retrieval
- Primary pattern id: `local-service-trust`
- Challenger pattern id: `testimonial-cutdown-ugc`
- Flow id: `geo-proof-cta`
- Hook family ids: local_proof_phone
- Trend class (if any): n/a
- Niche pack: local-services
- Swipe / longevity signals used: local high → trust cutdown; avoid stock handshake / unproven #1

### Job-to-be-done (one sentence)

Get North Shore homeowners who need AC repair to call the number on screen within 20 seconds.

### Creative stack (required)
- Pipeline id / posture default: local_trust_hybrid
- Primary generator: Seedance 2.5 omni_reference (facility + WIP stills) or CapCut edit of real footage
- Supporting tools: CapCut, Meta Advantage+, optional ElevenLabs VO
- Connected now?: no → handoff
- Creative-stack last verified: 2026-10-10

### Consistency sheets (required before gen)
- Product sheet: treated as **service identity sheet** — branded van/logo colors, uniform, facility exterior; refs: facility_hero, van_side, tech_in_action
- Character sheet / Soul-ID: “Luis — lead tech” face_front + three_quarter OR N/A if faceless WIP only
- Style lock: documentary daylight, locked-off + light handheld; no fake glam grade
- Multi-angle refs: facility_hero, van_side, tech_in_action, [face if used]

### Hooks (3–5)
1. On-screen: `North Shore AC down?`
2. `Same-day repair — real techs, real vans`
3. Review cold open: `[PLACEHOLDER review]` then cut to WIP
4. Heat-wave B-roll interrupt → phone number
5. Cinema twin: golden-hour facility slow push (no claims)

### Timed script
| t | Visual | VO / text | Purpose |
| --- | --- | --- | --- |
| 0–3s | City + specialty on screen + real facility | `North Shore · AC repair` | Geo thumb-stop |
| 3–8s | Honest WIP — panel open, gauges | Optional soft VO | Trust / craft |
| 8–14s | Review quote [PLACEHOLDER] + years [PLACEHOLDER] | Text card | Proof honesty |
| 14–20s | Phone number held 3s+; van endcard | `Call [PHONE]` | CTA |

### Shot list / visual system
- Facility exterior match ref
- WIP tight tools (no staged “stock smile”)
- Endcard: logo + phone only (CapCut)

### Seedance / film-gen execution (copy-paste)
```yaml
tool: seedance
model: seedance_2_5
mode: omni_reference
duration_s: 15
aspect_ratio: "9:16"
generate_audio: true
product_sheet: "Harbor Air Pros — navy/white van, facility exterior"
character_sheet: "Luis lead tech OR N/A"
style_lock:
  grade: "documentary daylight"
  lens: "35mm"
  motion_bias: "locked + light handheld"
references:
  - role: product_hero
    file: "[FACILITY.png]"
  - role: product_detail
    file: "[VAN_SIDE.png]"
  - role: style_or_talent
    file: "[TECH_WIP.png]"
negative:
  - "stock handshake, fake #1 badge, melted phone number, celebrity lookalike"
```

```text
COMMERCIAL AD SPOT — local-services — local-service-trust
Job-to-be-done: Drive calls from North Shore AC-repair intent.
STYLE LOCK: documentary daylight 35mm.
PRODUCT/SERVICE LOCK: match facility + van refs; no invented awards.
TIMELINE:
0–3s HOOK: facility + on-screen geo/specialty — not logo-first alone.
3–8s BODY: honest WIP matching tech_in_action ref.
8–12s PROOF: review [PLACEHOLDER] only — do not invent.
12–15s CTA: phone held; lower third quiet for burn-in.
```

### Higgsfield execution brief (if relevant)
- Workflow: generate_video seedance_2_5 or video-montage from real clips
- Inputs: facility, van, WIP, logo SVG
- Consistency locks: service identity + optional Luis Soul-ID
- Variants: A phone CTA · B form CTA · C review-first hook

### Other tool prompts
- Prefer real phone footage over gen when available; Seedance for B-roll gaps only
- CapCut: burn phone last 4s large

### Caption track (muted-first)
`North Shore AC repair` → WIP → `[PLACEHOLDER review]` → `Call [PHONE]`

### Paid social copy
- Primary text: AC out on the North Shore? Same-day repair from Harbor Air Pros. Call [PHONE].
- Headline: North Shore AC repair
- Description: Licensed · Insured · [PLACEHOLDER years]

### Static / carousel twin (if any)
Facility → WIP → review card → phone card

### CTA
- Primary: Call [PHONE]
- Alternates: Get a quote form (landing only — not second in-cut CTA)

### A/B matrix
| Variant | What changes | Tool action | Hypothesis |
| --- | --- | --- | --- |
| A | Phone CTA | CapCut | Call volume |
| B | Review-first 0–3s | region edit | Trust lift |
| C | Form CTA on landing only | Meta CTA button | Lead quality |

### Dual-track twin
- Viral/native: trust cutdown UGC-adjacent
- High-production: golden-hour facility cinema B-roll, same JTBD + phone
- Shared JTBD: calls from geo + specialty intent

### Self-critique & variants (mandatory)

| Dimension | Score | Note |
| --- | --- | --- |
| thumbstop | 5 | Geo + specialty ≤3s |
| clarity | 5 | AC repair obvious |
| native_fit | 4 | Honest local, not fake TikTok dance |
| desire_or_proof | 4 | Depends on real review PLACEHOLDER |
| cta_hygiene | 5 | Phone only in cut |
| production_truth | 5 | Documentary tier |

**Likely failure modes:**
1. `fm_geo_mismatch` — no city/specialty on screen
2. `fm_fake_proof` — “#1 rated” without source
3. `fm_multi_cta` — call + DM + comment keyword

**Concrete variants:**
| Variant | Targets failure # | Change | Expected fix |
| --- | --- | --- | --- |
| A | 1 | Bigger geo overlay 0–3s | Local relevance |
| B | 2 | Only user review or omit | Honest trust |
| C | 3 | Phone only; form in Meta button | One path |

### Scale plan
- Geo variants via Ad Multiplier / CapCut text swaps; new facility sheets per market

### AI disclosure & rights
- Synthetic media used?: no if real footage; yes if Seedance B-roll — disclose if required
- Platform disclosure required?: Meta toggles if AI B-roll
- Audio rights: original/licensed
- Faces / talent release: Luis `[PLACEHOLDER]`
- Footage license: brand-owned
- Likeness policy: no celebrity
- Claims to avoid: unproven #1, guarantees without terms
- Rights decision: paid-safe with releases + cleared audio

### Rights & compliance (detail)
- Audio: licensed bed
- Faces / footage: release for identifiable techs
- Claims: licensing/insurance only if user-confirmed

### Landing / store / bio mirror
Headline = North Shore AC repair; click-to-call same [PHONE]

### First-time-right QA
- Checklist gates: PASS (example)
- Rubric dims: ≥4
- Consistency sheets gate: pass
- Self-critique gate: pass
- Mistakes library hits rewritten: yes
- Seedance/Higgsfield quality bar: pass
