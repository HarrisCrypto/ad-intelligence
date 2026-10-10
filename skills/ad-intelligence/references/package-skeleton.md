# Package skeleton — COPY THIS FILE, fill [[BRACKETS]], do not delete sections

Replace every `[[LIKE_THIS]]`. Tags must be USER_SUPPLIED | ASSET_VERIFIED | PLACEHOLDER | ASSUMED.

## Ad package
- Package version: 1
- Asset ladder state: [[S0|S1|S2|S3]]
- Generation readiness: GENERATION_READY
- Connected tools?: [[yes|no]]
- Pipeline rung: [[connected|handoff|assembler]]
- Render status: NOT_RENDERED
- Creative-stack last verified date checked?: yes — LAST-VERIFIED.md

### Brief (locked or assumed)
- Brand / offer: [[BRAND — one-line offer]]
- Niche: [[niche or alias]]
- Platforms: [[tiktok, meta, …]]
- Funnel: [[tof_awareness|mof|bof_conversion]]
- Production tier: [[hybrid_polished|premium_cinema|documentary_trust|clean_product|…]]
- Virality posture: [[trend_reactive|evergreen_dr|brand_film|local_performance|…]]
- Proof available: [[list or [PLACEHOLDER: …]]]
- Tool access: [[connected MCP|prompt-handoff|assembler|package-only]]
- Harness: [[Cursor|Claude|Codex|Gemini|OpenClaw|ChatGPT|other]]
- Tools declared: [[image/video/MCP/browser — from probe + tool card]]
- Assumptions: [[from brief-defaults if any]]

### Retrieval
- Primary pattern id: `[[from retrieve.mjs]]`
- Challenger pattern id: `[[from retrieve]]`
- Dual-track twin id: `[[≠ primary; cinema/high-prod if dual-track]]`
- Study id: `[[study_* from retrieve studies — or n/a if match_status none_for_query]]`
- Study provenance: observed:[[true|false]] · basis:[[synthesis|ad-library|named-campaign|owned-ad]] — [[STRUCTURE_ONLY if synthesis; never invent proof]]
- Attention model id (primary): `[[am_* from retrieve attention_models]]`
- Attention model id (challenger): `[[am_*]]`
- Research notes (public libraries — structure only): [[Meta/TikTok/X/YouTube — what timing you stole]]
- Flow id: `[[flow or n/a]]`
- Hook family ids: [[…]]
- Trend class (if any): [[…|none]]
- Niche pack: [[…]]
- Pipeline route (from pattern-to-pipeline): [[…]]
- Swipe-signal notes: [[…|none]]
- Retrieve warnings: [[none|paste warnings — heed no_study_match / study_niche_weak]]
- LAST-VERIFIED: [[creative-stack date]]

### Job-to-be-done (one sentence)
[[One job only — what the viewer should do/feel next]]

### Concept (chosen)
- Options: (1) [[AI-default you refuse]] (2) [[stronger idea]] (3) [[alt]]
- **Chosen:** [[one-line idea + the memorable frame]]
- Not the default because: [[concrete reason tied to brief — not vibes]]
- Emulates attention model: [[am_* — timing/shots/words stolen; brand facts original]]

### Consistency systems (required)
- Identity mode: [[pack|ui|place-service|multi-sku|n/a]]
- Provenance of sheet fields: [[tags]]

#### Product sheet — [[NAME]]
- Official name: [[…]] [[[TAG]]]
- SKU / UI / place lock: [[concrete visual facts]]] [[[TAG]]]
- Mechanism (non-medical unless USER_SUPPLIED): [[…]] [[[TAG]]]
- Refs order: 1 [[hero]] · 2 [[label/UI]] · 3 [[¾ or screen]] · 4 [[…]]
- Forbidden morphs: [[…]]
- Banned claims: [[…]]

#### Character sheet — [[NAME or n/a]]
- Role: [[…|n/a]]
- Look / Soul-ID: [[…|n/a]]
- Rights / disclosure: [[…]]

### Claim & asset ledger (required)
| Claim or asset | Where used (beat/copy) | Tag | Source |
| --- | --- | --- | --- |
| [[pack/UI appearance]] | all product frames | [[TAG]] | [[…]] |
| [[desire line — not a study]] | hook | ASSUMED | creative angle |
| [[reviews/metrics if any]] | proof | PLACEHOLDER | [[PLACEHOLDER: …]] |
| [[CTA path]] | end | ASSUMED | funnel |

### Creative stack (required)
- Pipeline id / posture default: [[…]]
- Pipeline rung: [[connected|handoff|assembler]]
- Primary generator: [[real tool name — wan_2_2_i2v / grok_imagine_video_1_5 / seedance_2_5 / screen_record / …]]
- Supporting tools: CapCut captions/endcard, [[…]]
- Connected now?: [[yes → call tools|no → handoff/assembler]]
- Creative-stack last verified date checked?: yes
- Policy precheck: [[niche flags or none]]

### Hooks (3–5)
1. [[machine + concrete frame 0 — ≤7 words on-screen idea]]
2. [[…]]
3. [[…]]

### Timed script
(≥6 rows. VO/text = EXACT words in quotes — not “sparse”.)
| t | Visual | VO / text | Purpose | Claim tags |
| --- | --- | --- | --- | --- |
| 0–2s | [[no logo — concrete scene]] | “[[exact]]” | Hook | [[TAG]] |
| 2–4s | [[…]] | “[[exact]]” | Agitate/orient | [[TAG]] |
| 4–7s | [[…]] | “[[exact]]” | Bridge | [[TAG]] |
| 7–10s | [[…]] | “[[exact]]” | Ritual | [[TAG]] |
| 10–14s | [[product/UI lock]] | “[[exact]]” | Mechanism | [[TAG]] |
| 14–18s | [[…]] | “[[exact]]” | Payoff | [[TAG]] |
| 18–21s | [[…]] | “[[exact]]” | Bridge | [[TAG]] |
| 21–24s | [[endcard space]] | “[[ONE CTA]]” | CTA | [[TAG]] |

### Shot list / visual system
[[beat → camera/lens → light — one line each; concrete nouns only]]

### Craft system (required)
- Style id + production_tier + virality_posture: [[…]]
- Palette: dominant `#[[______]]` · support `#[[______]]` · accent `#[[______]]` [[[TAG]]]
- Grade name: [[clean daylight|cool clinical|warm tungsten|flat UI doc|high-contrast editorial]] — [[skin/product priority]]
- Typography: hook [[Anton|DIN 2014|Inter Tight]] [[weight]] ≤7 words · captions [[Inter Tight]] 2-line · CTA [[one line]] · legal [[last 1.5s|omit]] (no -style/-like hedges)
- Motion grammar: [[0–2s … → … → product hold ≥1.2s → E1 ≥2.5s]]
- Sound plan: muted-first captions; [[VO?]] [[bed paid-safe]] [[SFX]]; no uncleared trend audio for paid
- Endcard module E1: logo SVG · one CTA “[[…]]” · hold ≥2.5s · comps E1_9x16 + E1_1x1
- Aspect matrix: 9:16 master; 1:1 reflow type (not center-crop); [[16:9 if needed]]
- Finish handoff: CapCut V1=clips · V2=captions/endcard · per production-finish-spec.md

### Render plan (required)
| unit_id | beats | seconds | model / tool | start/end | refs | acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| U1 or K1 | 0–[[n]]s | [[n]] | [[real tool]] | [[start]] / — | [[1,2,…]] | identity ok |
| U2 or C1 | [[…]] | [[n]] | [[real tool]] | [[…]] | [[…]] | [[…]] |
| E1 | endcard | 3–5 | capcut | — | logo SVG | one CTA |

#### Unit U1 — paste-ready prompt
```text
COMMERCIAL — [[pattern]] — U1
SHEET LOCK: Image 1=[[…]] Image 2=[[…]]
CAMERA: [[size + lens feel + move]]
LIGHT: [[practicals / key / rim]]
MOTION: [[what moves; what stays locked]]
GRADE: [[same as Craft system]]
DURATION: [[n]]s
AUDIO PATH: muted+captions
NEGATIVES: melted type, wrong label, logo redraw, extra fingers, watermark, identity drift, plastic skin, default purple glow, illegible text
```

#### Unit U1 — mcp_params / assembler handoff
```json
{
  "pipeline_rung": "[[handoff|assembler|connected]]",
  "model": "[[real_model_id]]",
  "duration": 8,
  "aspect_ratio": "9:16",
  "prompt": "[[same as paste-ready]]",
  "note": "NOT_RENDERED until real job/export ids"
}
```

### Render log
| job_id / export_id | unit_id | status | vs_sheet | action |
| --- | --- | --- | --- | --- |
| — | — | NOT_RENDERED | n/a | run after exports |

### Render QA
- Status: N/A (NOT_RENDERED)
- Checks emitted for finisher: hands-fingers · text-melt · identity-drift · audio-sync · frozen-beats · duration-match · logo-endcard · muted-fail · one-cta-on-export · aspect-exports · claims-on-screen · receipt-honesty
- Notes: [[…]]

### Caption track (muted-first)
[[timed lines — consumer language only]]

### Paid social copy
- Primary text ([[count]]): [[consumer language only — no ledger meta]]
- Headline ([[count]]): [[…]]
- Description: [[…|n/a]]

### Static / carousel twin (if any)
[[…|n/a]]

### CTA
- Primary (only one in-cut): [[ONE]]
- Alternates (A/B matrix only — not in this cut): [[…]]

### Dual-track twin
- Viral/native unit ids: [[…]]
- High-production unit ids: [[…]]
- Shared JTBD / claims / sheets locked?: yes
- Aspects delivered as separate generates (not center-crop): yes

### Scale plan
- Ad Multiplier / Spark / whitelisting: [[…|n/a]]

### AI disclosure & rights
- Synthetic talent/voice/footage?: [[yes/no — disclosure plan]]
- Audio rights path: [[organic trend|original|licensed]]
- Face/release status: [[…]]
- Policy category + prerequisites: [[…]]
- Claims used (ledger only): [[…]]
- Rights decision-tree outcomes: [[…]]

### Landing / store / bio mirror
[[offer matches ad]]

### Self-critique & variants (mandatory)
#### Rubric scores (1–5) — cite timecode for any 5; caps apply
| Dimension | Score | Evidence (timecode/line) |
| --- | --- | --- |
| thumbstop | [[n]] | [[0–2s …]] |
| clarity | [[n]] | [[…]] |
| native_fit | [[n]] | [[…]] |
| desire_or_proof | [[n]] | [[PLACEHOLDER ⇒ ≤3]] |
| cta_hygiene | [[n]] | [[one CTA]] |
| production_truth | [[n]] | [[NOT_RENDERED ⇒ ≤3]] |
| consistency_lock | [[n]] | [[sheet binds]] |

#### Likely failure modes (2–3)
1. [[…]]
2. [[…]]
3. [[…]]

#### Variants that attack those failures
| Variant | Changes (ONE variable) | Failure it fixes | Tool action |
| --- | --- | --- | --- |
| A | [[…]] | [[…]] | [[…]] |
| B | [[…]] | [[…]] | [[…]] |
| C | [[…]] | [[…]] | [[…]] |

### First-time-right QA
- lint-package.mjs: [[PASS — paste JSON]]
- render-qa.json: N/A-NOT_RENDERED (checklist emitted?: yes)
- Checklist gates: [[PASS/fails]]
- Mistakes library + claim-firewall + policy-precheck: yes
- Self-critique completed: yes
