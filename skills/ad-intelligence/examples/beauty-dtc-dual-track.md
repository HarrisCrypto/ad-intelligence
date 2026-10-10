# Gold example — Beauty DTC (dual-track) — FULL DEPTH

Teaching fixture for lint + template compliance. Fictional product. Not a scrape.

## Ad package
- Package version: 1
- Asset ladder state: S2 (pack photos assumed on hand for teaching; tagged ASSUMED where not real)
- Generation readiness: GENERATION_READY (handoff)
- Connected tools?: no
- Render status: NOT_RENDERED
- Creative-stack last verified date checked?: yes — LAST-VERIFIED.md 2026-10-10

### Brief (locked or assumed)
- Brand / offer: AuraBarrier Serum — barrier-repair serum, 30ml frosted glass
- Niche: beauty
- Platforms: tiktok, meta
- Funnel: tof_awareness → mof
- Production tier: hybrid_polished + premium_cinema twin
- Virality posture: trend_reactive + brand_film
- Proof available: [PLACEHOLDER: 2 real reviews]
- Tool access: prompt-handoff only
- Assumptions: US English; cosmetic claims only; pack photos on hand for lock (ASSUMED for this fixture)

### Retrieval
- Primary pattern id: `pov-day-in-life`
- Challenger pattern id: `beauty-macro-tabletop`
- Dual-track twin id: `beauty-macro-tabletop`
- Flow id: `pov-ritual-benefit-follow`
- Hook family ids: pov-identity, macro-lust, confession
- Trend class: format_meme
- Niche pack: beauty
- Pipeline route: higgsfield.ugc-video / seedance.omni_reference / capcut_captions
- Swipe-signal notes: high longevity = before_after + macro + ugc; avoid unsubstantiated clinical claims
- Retrieve warnings: none

### Job-to-be-done (one sentence)
Make “makeup that lasts a double shift” feel inevitable, then soft-shop the serum.

### Consistency systems (required)
- Identity mode: pack
- Provenance of sheet fields: ASSUMED (fixture) / PLACEHOLDER for proof

#### Product sheet — AuraBarrier Serum
- Official name: AuraBarrier Serum [ASSUMED]
- SKU: 30ml soft-sage label, matte cap [ASSUMED]
- Mechanism: barrier support for longer-wear makeup base [ASSUMED]
- Refs order: 1 hero frosted glass front · 2 label close-up · 3 ¾ · 4 macro drop
- Forbidden morphs: no logo melt, no wrong cap color, no second bottle
- Banned claims: clinically proven, cures acne, permanent [USER_SUPPLIED policy]

#### Character sheet — “Maya” creator
- Role: creator [ASSUMED]
- Look: mid-20s presentation, natural skin, gold hoops, white tee [ASSUMED]
- Soul-ID: candid tired → relieved; never stock smile
- Rights: AI-synthetic allowed only with disclosure; this cut prefers real creator [ASSUMED]
- Face ref: Image 4 front [REQUEST FROM USER if shooting live]

### Claim & asset ledger (required)
| Claim or asset | Where used | Tag | Source |
| --- | --- | --- | --- |
| Pack appearance (frosted 30ml, sage label) | All product frames | ASSUMED | Fixture sheet |
| “Makeup lasts a double shift” desire line | Hook overlay | ASSUMED | Creative angle — not a study |
| Customer reviews | Proof beat | PLACEHOLDER | [PLACEHOLDER: 2 real reviews] |
| Price / discount | none | PLACEHOLDER | Omitted until user supplies |
| Soft CTA “Link in bio” | End | ASSUMED | Organic path |

### Creative stack (required)
- Pipeline: viral POV + macro cinema twin
- Primary generator: seedance_2_5 via generate_video (handoff)
- Supporting: CapCut captions, original/paid-safe bed
- Connected now?: no → handoff
- Policy precheck: beauty / health_personal_attributes — no disease claims; cosmetic disclaimer if results claimed

### Hooks (3–5)
1. POV: your base finally survives a 10-hour shift
2. BEFORE: midday crease map (matched framing)
3. Macro: serum catching window light mid-drop

### Timed script
| t | Visual | VO / text | Purpose | Claim tags |
| --- | --- | --- | --- | --- |
| 0–2s | Mirror selfie, AM light | POV overlay ≤7 words | Hook | ASSUMED |
| 2–10s | Commute/desk; serum in bag | sparse | Ritual | — |
| 10–18s | Apply + texture macro (Image 1–2 lock) | “Only step I don’t skip” as skit line not medical claim | Mechanism | ASSUMED |
| 18–24s | End-of-day mirror | Link in bio | Soft CTA | ASSUMED |

### Shot list / visual system
Front camera → bag insert → macro drop (100mm feel) → end-day mirror. Grade: clean daylight. Leave lower caption safe zone clear.

### Render plan (required)
| unit_id | beats | seconds | model | start/end | refs | acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| U1 | 0–10s hook+ritual | 10 | seedance_2_5 | start keyframe / — | 1,2,3,4 | identity + label ok |
| U2 | 10–18s macro | 8 | seedance_2_5 | U1 last / — | 1,2,4 macro | texture; no melt |
| U3 | 18–24s CTA | 6 | seedance_2_5 | U2 last / pack hero end | 1,2 | endcard space |
| C1 | cinema twin 12s | 12 | seedance_2_5 | macro keyframe / pack hero | 1,2,3 | pack match |

#### Unit U1 — paste-ready prompt
```text
COMMERCIAL AD UNIT — beauty — pov-day-in-life — U1
Job: makeup lasting a double shift feels inevitable; soft-shop serum.
Lens / Light / Surface / Motion: front-camera phone; AM window light; skin + frosted glass; slow push-in.
Aspect: 9:16; lower caption zone clear.

REF BINDING: Image 1 = hero pack. Image 2 = label. Image 3 = ¾. Image 4 = face front.

PRODUCT SHEET LOCK: 30ml frosted glass, soft-sage label, matte cap; no logo melt; true color.
CHARACTER SHEET LOCK: gold hoops, white tee, candid tired energy; same person every frame.

TIMELINE:
0–2s HOOK: mirror selfie; on-screen POV idea (burn exact words in CapCut).
2–10s: commute/desk; serum briefly visible matching Image 1.

AUDIO PATH: muted gen + captions (VO optional in post)
NEGATIVES: melted type, wrong label, identity drift, extra fingers, watermark, clinical claims on screen
```

#### Unit U1 — mcp_params (handoff shape)
```json
{
  "model": "seedance_2_5",
  "duration": 10,
  "aspect_ratio": "9:16",
  "prompt": "See U1 prompt; Image 1=hero Image 2=label Image 3=¾ Image 4=face",
  "medias": [
    { "role": "start_image", "value": "<MEDIA_ID:start>" },
    { "role": "image_references", "value": "<MEDIA_ID:hero>" },
    { "role": "image_references", "value": "<MEDIA_ID:label>" },
    { "role": "image_references", "value": "<MEDIA_ID:face>" }
  ],
  "get_cost": true,
  "draft": true
}
```

### Render log
| job_id | unit_id | status | vs_sheet | action |
| --- | --- | --- | --- | --- |
| — | — | NOT_RENDERED | n/a | handoff only |

### Caption track (muted-first)
```srt
1
00:00:00,000 --> 00:00:02,000
POV: base that lasts the shift

2
00:00:10,000 --> 00:00:14,000
The one step I don’t skip

3
00:00:18,000 --> 00:00:24,000
Link in bio
```

### Paid social copy
- Primary text (142): Barrier support for long days — texture you’ll feel. Soft launch kit in bio. Results vary.
- Headline (18): Lasting base days
- Description (32): AuraBarrier Serum · 30ml

### Static / carousel twin
Card 1 macro drop · Card 2 pack hero · Card 3 soft CTA — same sheet lock

### CTA
- Primary (only one in-cut): Link in bio
- Alternates (A/B only): Shop now on Meta; Comment SERUM

### Dual-track twin
- Viral/native unit ids: U1–U3
- High-production unit ids: C1 (macro tabletop → pack hero)
- Shared JTBD / claims / sheets locked?: yes
- Aspects: 9:16 master + separate 4:5 Meta generate (not center-crop)

### Scale plan
- After winner: Ad Multiplier one variable (hook line OR opening face)
- Spark whitelist if real creator

### AI disclosure & rights
- Synthetic talent/voice/footage?: no for preferred cut; if AI → caption disclosure
- Audio rights path: original bed for paid; trend sound organic-only
- Face/release status: creator release if real
- Policy category + prerequisites: beauty cosmetic; avoid personal-attribute targeting
- Claims used: ledger only; reviews PLACEHOLDER
- Rights decision-tree: paid audio cleared; no competitor logos

### Landing / store / bio mirror
Bio/PDP: AuraBarrier Serum 30ml — same “long-shift base” language; no invented clinical badge

### Self-critique & variants (mandatory)
#### Rubric scores (1–5)
| Dimension | Score | Evidence (timecode/line) |
| --- | --- | --- |
| thumbstop | 5 | 0–2s POV overlay identity |
| clarity | 4 | Benefit clear by 10–14s caption |
| native_fit | 5 | Front-camera ritual grammar |
| desire_or_proof | 3 | Texture desire; reviews PLACEHOLDER (cap) |
| cta_hygiene | 5 | Single “Link in bio” 18–24s |
| production_truth | 4 | Handoff hybrid honest; NOT_RENDERED |
| consistency_lock | 4 | Sheets + Image 1–4 bindings; refs ASSUMED fixture |

#### Likely failure modes (2–3 for this niche/platform)
1. Clinical claim creep on beauty TikTok
2. Shade/SKU landing mismatch
3. Overfiltered skin → identity drift vs Image 4

#### Variants that attack those failures
| Variant | Changes (ONE variable) | Failure it fixes | Tool action |
| --- | --- | --- | --- |
| A | Captions-only; no VO lines that sound clinical | Claim creep | CapCut recut |
| B | Insert [PLACEHOLDER] review card at 14–17s | Proof gap | U2 edit |
| C | Meta 4:5 opens on C1 macro | Native fit on Meta | New generate C1b |

### First-time-right QA
- lint-package.mjs: run on this file before treating as ship fixture
- Checklist gates: designed to PASS for handoff teaching (NOT_RENDERED explicit)
- Mistakes library + claim-firewall + policy-precheck: yes
- Self-critique completed: yes
