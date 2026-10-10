# Ad Intelligence — CONTEXT PACK (v3.11)

_Paste into system context. Then follow the one-shot sequence._
_Repo: https://github.com/HarrisCrypto/ad-intelligence_

---
## 1) ONE-SHOT

# ONE-SHOT playbook — creative first, then paperwork

Agents fail when they fill ledgers before having an idea. **Research → attention model → Concept → dense beat sheet → craft → lint.**

## Hard sequence

```text
0. BRIEF
   - If user gave a URL/site: follow prompts/brief-from-url.md (gather offer/proof/CTA; list Assumptions).
   - OPEN closest gold fixture (beauty / local / saas / physical / voice) — steal DENSITY, not brand facts.

1. START FILE:
   node scripts/start-package.mjs --out packages/<brand>-ad.md

2. RETRIEVE (prefer compact):
   node scripts/retrieve.mjs --niche <niche> --platform <platform> --limit 5 --compact
   Paste primary / challenger / dual_track_twin (twin ≠ primary).
   Paste attention_models.primary + challenger (timing sheets).
   Open attention_models.research[] URLs (Meta Ad Library, TikTok Creative Center, X, YouTube) —
   10-minute look: steal STRUCTURE only. Lab: examples/visual/attention-lab.html

3. EMULATE + WRITE CREATIVE FIRST (before polishing ledger):
   a) Attention model id + “why this stops scroll for THIS brief”
   b) Concept: 3 one-liners → pick ONE → "Not the default because…"
      (ban: smiling hold-to-camera, floating product+particles, drone #1, neon SaaS cockpit, invented %)
   c) Timed script: ≥6 rows matching model timing (±). VO/text = EXACT words in quotes (not “sparse”).
   d) Captions cover the cut. One CTA. Muted-first 0–3s (no logo).
   e) Craft system: ≥2 #HEX, real font names (no -style/-like), motion, E1, 9:16+1:1
      Design/layout/cut/shots/animation called out — not “nice images + caption.”
   f) One paste-ready prompt PER unit (CAMERA/LIGHT/MOTION/GRADE/NEGATIVES)

4. FILL remaining [[BRACKETS]] (sheets, ledger, rights). Never invent proof.

5. LINT LOOP:
   node scripts/lint-package.mjs packages/<brand>-ad.md
   Fix until ok:true. Paste real lint JSON (never invent it).
   No shell → write "LINT: not run (no shell)" + tick self-check; do not fake JSON.
```

## Niche cheat sheet

| Ask | Niche | Models / gold |
| --- | --- | --- |
| Hair, shampoo, skincare | beauty | `am_hair_transform`, beauty gold |
| Food, coffee, snacks | food_bev | `am_food_crave_asmr` |
| AI agent / voice / SaaS site | saas | `am_voice_agent_missed`, voice + saas gold |
| Local service | local_services | `am_local_geo_trust` |
| Any DTC product | ecommerce | `am_macro_lust_loop` / hero |

Full map: `references/ad-libraries.md`. Emulate: `prompts/emulate-attention-model.md`.

## Refusal / rewrite

Do **not** deliver if:

- Any `[[BRACKET]]` left  
- No attention model id + no Concept with “Not the default because…”  
- Timed script &lt; 6 rows or VO cells say “sparse” / “≤N words”  
- Craft is adjectives only or fonts hedged (-style/-like)  
- Invented metrics without `[PLACEHOLDER…]`  
- Multi-CTA or logo-first 0–3s  
- Chat-only brainstorm with no package file  
- Image collage + crappy slogan (no cut/timing/shots)

Thin brief → assume via brief-defaults, list Assumptions, ask ≤3 questions, **still ship**.

## No Seedance / Higgsfield

Rung = assembler. Name Wan / LTX / Grok / Kling / Hailuo / stills+CapCut. Same skeleton. Same lint.

## Done means

Lint `"ok": true` **and** a stranger can mute-watch 0–3s and know the situation.

---
## 2) ATTENTION + ANY NICHE

# Attention + any niche

- View models: examples/visual/attention-lab.html
- Public libraries: references/ad-libraries.md (Meta, TikTok, X, YouTube, LinkedIn)
- URL briefs: prompts/brief-from-url.md
- Emulate: prompts/emulate-attention-model.md
- Hair/shampoo → beauty · Food → food_bev · AI/voice agent → saas + voice gold
- retrieve.mjs returns attention_models + research URLs — use them

---
## 3) CRAFT DEFAULTS

# Craft defaults (compressed)

## AD-DEFAULTS to refuse (unless brief forces + you explain)
- Smiling person holding product to camera
- Floating product + particles / god-rays
- Logo-first open or whoosh logo sting in 0–3s
- “Tired of X? Meet Y.”
- Drone skyline for local “#1”
- Neon / holographic SaaS cockpit with invented %
- Cream+serif+terracotta or purple-glow AI-default looks
- Invented review counts / ROAS
- Image collage + crappy slogan (no cut/timing/shots)

## Hook / edit
- 0–3s muted-first; brand cue via product/place/color OK; logo sting only on endcard
- ≥6 timed-script rows for ~24s; EXACT on-screen/VO words in quotes
- Captions carry the story muted; one CTA; product hold ≥1.2s; endcard ≥2.5s
- Pick an attention model (am_*) and match its timing sheet

## Craft lint (must pass)
- ≥2 #HEX; real font names (no -style/-like); motion; E1; 9:16+1:1
- No cinematic/stunning/8k/sleek/nice in craft/prompts
- No “only when supplied” / ASSUMED in paid primary or captions
- No leftover [[BRACKETS]]

---
## 4) PACKAGE SKELETON

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
- Tool access: [[connected MCP|prompt-handoff|assembler]]
- Assumptions: [[from brief-defaults if any]]

### Retrieval
- Primary pattern id: `[[from retrieve.mjs]]`
- Challenger pattern id: `[[from retrieve]]`
- Dual-track twin id: `[[≠ primary; cinema/high-prod if dual-track]]`
- Attention model id (primary): `[[am_* from retrieve attention_models]]`
- Attention model id (challenger): `[[am_*]]`
- Research notes (public libraries — structure only): [[Meta/TikTok/X/YouTube — what timing you stole]]
- Flow id: `[[flow or n/a]]`
- Hook family ids: [[…]]
- Trend class (if any): [[…|none]]
- Niche pack: [[…]]
- Pipeline route (from pattern-to-pipeline): [[…]]
- Swipe-signal notes: [[…|none]]
- Retrieve warnings: [[none|paste warnings]]

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

---
## 5) GOLD DENSITY EXCERPT (beauty — match this specificity)

### Concept (chosen)
- Three options: (1) smiling hold-to-camera serum (2) “4:07pm” base-fail clock (3) ASMR drop only  
- **Chosen:** “4:07pm” — the moment base cracks, shown as time, not a smile  
- Not the default because: no product-to-camera grin; hook is a time-stamped failure then the ritual fix

### Timed script
| t | Visual | VO / text | Purpose | Claim tags |
| --- | --- | --- | --- | --- |
| 0–2s | ECU under-eye crease; watch reads 4:07 | “4:07pm.” | Hook | ASSUMED |
| 2–4s | Same face, fluorescent break-room | “Base: gone.” | Agitate | ASSUMED |
| 4–7s | Cut to 6:30am mirror, window light | “Start over.” | Orient | ASSUMED |
| 7–10s | Bag zip; frosted bottle (Image 1) | “One step.” | Ritual | ASSUMED |
| 10–14s | Macro drop (Image 2–4) | “Only step I don’t skip.” | Mechanism | ASSUMED |
| 14–18s | Hands press serum in | “Then makeup.” | Bridge | ASSUMED |
| 18–21s | End-of-day mirror, calm | “Still here.” | Payoff | ASSUMED |
| 21–24s | Endcard space | “Link in bio.” | Soft CTA | ASSUMED |

### Craft system (required)
- Style id + production_tier + virality_posture: `pov_day_in_life` + hybrid_polished; twin `beauty_macro_tabletop` / premium_cinema; trend_reactive + brand_film
- Palette: dominant soft sage `#8FA89A` · support frost white `#F4F7F5` · accent warm gold hoop `#C4A574` [ASSUMED]
- Grade name: clean daylight — skin natural, label sharp, no beauty-filter plastic
- Typography: hook Anton 700 white on soft plate ≤7 words · captions Inter Tight 600 2-line · CTA “Link in bio” end only · legal footer last 1.5s if needed
- Motion grammar: 0–2s locked front-cam hold → 2–10s micro handheld sway → 10–18s 100mm macro static with drip physics → 18–24s mirror hold ≥1.2s → E1 3s
- Sound plan: muted-first captions; optional soft bed paid-safe; light glass SFX on drip; no uncleared trend audio
- Endcard module E1: brand wordmark SVG clear space · one soft CTA · 3s hold · comps E1_9x16 + E1_1x1
- Aspect matrix: 9:16 master; 1:1 reflow type (not center-crop); cinema twin may add 16:9
- Finish handoff: CapCut V1 clips U1–U3 · V2 captions/endcard · per production-finish-spec.md

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
---
## 6) COMMANDS

```bash
cd skills/ad-intelligence
node scripts/start-package.mjs --out packages/<brand>-ad.md
node scripts/retrieve.mjs --niche <n> --platform <p> --limit 5 --compact
node scripts/lint-package.mjs packages/<brand>-ad.md
# open examples/visual/attention-lab.html
```
