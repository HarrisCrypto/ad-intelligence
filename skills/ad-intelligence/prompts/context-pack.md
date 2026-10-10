# Ad Intelligence — CONTEXT PACK (v3.15)

_Paste into system context. Then follow the one-shot sequence._
_Repo: https://github.com/HarrisCrypto/ad-intelligence_
_Lite pack: node scripts/build-context-pack.mjs --lite_

---
## 1) ONE-SHOT

# ONE-SHOT playbook — study → emulate → build like a human → finish the cut

Agents fail when they fill ledgers before having an idea — or render a hook and stall asking for screenshots. **Retrieve studies → emulate structure → human_build with real tools → Concept → dense beats → craft → lint → finish the full cut.**

## Hard sequence

```text
0. PROBE + EQUALIZE
   node scripts/probe-harness.mjs
   Fill tool card (prompts/harness-equalization.md) → rung:
   connected | handoff | assembler | package-only
   Optional: read references/brand-context.md or .agents/brand-context.md if present

1. BRIEF
   - URL/site: node scripts/brief-from-url.mjs <url> (or prompts/brief-from-url.md)
   - OPEN closest gold fixture — steal DENSITY, not brand facts

2. START FILE:
   node scripts/start-package.mjs --out packages/<brand>-ad.md

3. RETRIEVE (prefer compact):
   node scripts/retrieve.mjs --niche <niche> --platform <platform> --limit 5 --compact
   Paste studies.primary (+ human_build steps) — viral / performance / award archetypes.
   Paste primary / challenger / dual_track_twin (twin ≠ primary).
   Paste attention_models.primary + challenger (timing included).
   Open research URLs + examples/visual/attention-lab.html — STRUCTURE only.
   Optional 10 min in public libraries (studies[].research_where).

4. EMULATE + HUMAN BUILD + WRITE CREATIVE FIRST:
   a) Study id + provenance (observed/basis) + attention model + angle axis
      Steal study.steal; obey study.never_copy; follow when_to_emulate.
      NEVER cite basis:synthesis as observed proof or metrics.
   b) Map study.human_build playbook + references/human-build-os.md to YOUR rung
   c) Concept: 3 one-liners → pick ONE → "Not the default because…"
      (ban: smiling hold-to-camera, floating product+particles, drone #1, neon SaaS cockpit, invented %)
   d) Timed script: ≥6 rows matching study/model timing (±). EXACT quoted VO/text.
   e) Captions cover the cut. One CTA. Muted-first 0–3s (no logo).
   f) Craft: ≥2 #HEX, real fonts, motion, E1, 9:16+1:1 — cut/shots/animation named
   g) One paste-ready prompt PER unit (CAMERA/LIGHT/MOTION/GRADE/NEGATIVES)
   h) Start human-build LOG artifact (references/human-build-log.template.md)

5. FILL remaining [[BRACKETS]]. Never invent proof.

6. LINT LOOP:
   node scripts/lint-package.mjs packages/<brand>-ad.md
   Fix until ok:true. Paste real lint JSON (never invent it).
   No shell → prompts/no-shell-lint-checklist.md; offline retrieve JSON;
   never invent ok:true JSON.

7. FINISH THE CUT (if image/video tools exist):
   Follow prompts/finish-the-cut.md — cover EVERY second of the timed script.
   Missing UI/screenshots? → references/generated-ui-authenticity.md (generate 3 states).
   Post owns captions/logo/CTA type. Log real job ids into the human-build LOG. No parallel agents.
   Do NOT deliver “send me screenshots to finish” when you can generate.
   Deliver package + lint JSON + build log (seed shape: examples/human-build-logs/).
```

## Niche cheat sheet

| Ask | Niche | Study / model / gold |
| --- | --- | --- |
| Hair, shampoo, skincare | beauty | `study_beauty_macro_transform` · `am_hair_transform` |
| Food, coffee, snacks | food_bev | `study_food_crave_loop` · `am_food_crave_asmr` |
| AI agent / voice / SaaS site | saas | `study_voice_agent_missed_call` · voice + saas gold |
| Local service | local_services | `study_local_geo_phone` · `am_local_geo_trust` |
| Any DTC product | ecommerce | `study_award_hero_spectacle` / macro · dual-track |
| Cold UGC trust | many | `study_viral_confession_ugc` |

Full map: `studies/corpus.json` · `references/ad-libraries.md`. Emulate: `prompts/emulate-attention-model.md`. Build: `references/human-build-os.md`.

## Refusal / rewrite

Do **not** deliver if:

- Any `[[BRACKET]]` left  
- No study id + provenance + attention model id + no Concept with “Not the default because…”  
- Cited a `basis:synthesis` study as observed performance proof  
- Timed script &lt; 6 rows or VO cells say “sparse” / “≤N words”  
- Craft is adjectives only or fonts hedged (-style/-like)  
- Invented metrics without `[PLACEHOLDER…]`  
- Multi-CTA or logo-first 0–3s  
- Chat-only brainstorm with no package file  
- Image collage + crappy slogan (no cut/timing/shots)  
- Copied competitor lines from a study or live library ad  
- **Hook-only render + “send screenshots”** while gen tools were available  
- Neon/rubber AI dashboard as the product UI  

Thin brief → assume via brief-defaults, list Assumptions, ask ≤3 questions, **still ship** (and still finish the cut if tools exist).

## No Seedance / Higgsfield

Rung = assembler. Name Wan / LTX / Grok / Kling / Hailuo / stills+CapCut. Same skeleton. Same lint. Same finish-the-cut duty. Same `human_build` mapping.

## Done means

1. Lint `"ok": true`  
2. Study + model named; structure emulated, words original  
3. Full timed duration covered (finish-the-cut contract)  
4. Stranger can mute-watch 0–3s and know the situation  
5. UI/product looks authentic — generated flat documentary chrome OK; rubber AI UI not OK  


---
## 2) FINISH THE CUT

# Finish the cut — do not stop after the hook

**Failure mode this kills:** agent renders U1 (8s phone ring), then asks the human for screenshots/logo and leaves 16s unfinished — while parallel agents burn credits on rubber UI.

## When gen tools exist (Kling / Wan / Flux / Seedance / etc.)

You **owe a full-duration cut**, not a teaser.

| Must | Must not |
| --- | --- |
| Cover **every second** of the timed script with units | Stop after hook “waiting on your UI” |
| Generate missing UI/product stills via authenticity protocol | Invent dashboard metrics or neon cockpits |
| Log **real** job/export ids per unit (or honest NOT_RENDERED) | Invent Seedance jobs |
| Burn captions/logo/CTA in **post** (CapCut) | Ask models to paint tiny UI type as the product |
| One session / one agent owns the render budget | Parallel agents racing the same package |

## Completion contract (paste into Render log)

```text
FINISH-THE-CUT
- Timed duration: [[Ns]]
- Units planned: [[K1,C1,U2,…,E1,A1]]
- Units rendered this session: [[list + job ids]]
- Units generated as stills (awaiting i2v/assemble): [[list + media ids]]
- Post assemble: [[CapCut steps — captions, VO, logo, aspects]]
- Blocked only if: [[truly no gen tools AND no assets — else generate]]
- User assets requested?: [[optional upgrade — NOT a blocker]]
```

## Asset ladder — generate vs ask

| State | Do |
| --- | --- |
| User gave UI screenshots / logo SVG | Bind as Image-N; screen-record preferred for UI beats |
| URL / brand colors only (S0–S1) | **Generate** calm UI keyframes per `generated-ui-authenticity.md`; tag ASSUMED; disclose synthetic UI if platform requires |
| Pack product, no photos | Generate pack-locked stills from sheet; don’t ask and stall |
| Truly text-only + **no** image/video tools | Package-only + NOT_RENDERED + paste-ready prompts — still full beat sheet |

**Optional ask (≤1):** “If you have real product UI exports, send them for a v2 lock.”  
**Forbidden ask as delivery:** “Send screenshots so I can finish” when you already have Kling/Flux/etc.

## UI / SaaS / voice-agent products

The interface **is** the product. Rubber holographic UI is the trap (credits burned, looks fake).

1. Lock a **flat UI documentary** product sheet (palette, type, 3 screen states).  
2. Generate **3 stills**: idle / solved / confirm — see `references/generated-ui-authenticity.md`.  
3. Short i2v or hold + CapCut cuts between states (cursor/tap implied).  
4. Burn labels/CTA in post if type melts.  
5. Never invent “1,204 calls answered” on screen.

## Credit hygiene

- One harness owns renders for a package.  
- Cost-check before each gen; prefer turbo/short clips for B-roll.  
- Do not spawn a second agent on the same brief.  
- Hook-only render is **incomplete** unless the brief asked for a 6–8s cut.

## Done means

1. Lint `ok: true`  
2. Full timed script covered  
3. Either all units have real job/export ids **or** a complete generated asset kit + CapCut assemble steps the agent (or user) can run without new creative decisions  
4. Stranger mute-watches 0–3s and knows the situation  

---
## 3) HUMAN BUILD OS

# Human Build OS — how a practitioner actually makes the ad

**Mission:** Studies teach *what* to emulate. This file teaches *how* a human builds it with real tools — so any LM finishes a cut instead of stopping at a concept slide.

Pair with: `studies/corpus.json` (`human_build` **playbook** steps) · **`human-build-log.template.md` (the auditable artifact)** · `prompts/finish-the-cut.md` · `references/generated-ui-authenticity.md` · retrieve `payload.studies` (always copy `provenance`).

`human_build` in a study is a checklist. The **log** is the filled artifact (decisions, job ids, retries, cost, lint). Seed: `examples/human-build-logs/voice-agent-assembler-seed.md`.

## Rule

Steal **structure** (timing, shot job, text density, cut rhythm). Never copy competitor lines, logos, reviews, or claimed CTR/ROAS.

```text
study.when_to_emulate → pick study
→ rewrite every word for THIS brand
→ run human_build steps with the tools you actually have
→ finish-the-cut across the full timed duration
→ lint until ok:true
```

## Tool ladders (pick what your harness probe found)

| Job | Connected | Assembler | Package-only |
| --- | --- | --- | --- |
| Talking-head / confession | Seedance / Kling i2v | Kling / Hailuo / Wan + CapCut | Still + timed script + prompts |
| UI / SaaS aha | Screen record → edit | Generate 3 flat UI states → CapCut | Exact UI prompts + states |
| Macro beauty / food | Product plate → i2v | Flux/Nano stills → short i2v | Macro still prompts + loop notes |
| Hero / brand film | Seedance cinema ladder | Wan/LTX/Kling keyframes → grade | Dual-track prompts + endcard spec |
| Captions / CTA / logo | CapCut / AE in post | CapCut / CapCut web | Post owns type — never hope the model burns it |
| Voice | Studio / Eleven / TTS | TTS in CapCut | VO script quoted in beats |

Probe first (`probe-harness.mjs`). Do not invent MCP job ids. Missing UI captures → generate authentic flat UI; do not stall asking for screenshots.

## Class playbooks

### `viral_native` (confession, skit, food loop, listicle)

1. Hook from **customer language** (reviews/support), not brand vibes.  
2. Imperfect light / native texture on face or food — brand late.  
3. Product/UI insert as **proof**, not a floating logo.  
4. Jump cuts on breath; captions ≤8 words on the open.  
5. One CTA endcard; export 9:16 (+1:1 if paid Meta).

### `performance_dr` (PAS, local geo, voice agent, text-first)

1. One JTBD + one pain **object** (bill, missed call, inbox, city).  
2. Solution after ~8–12s via demo (real or generated UI).  
3. Objection crush only with ledger-safe lines.  
4. Single CTA path (Start free / Book / Call).  
5. Finish every second of the timed sheet — hook-only is incomplete.

### `award_brand_film` (hero spectacle)

1. Lock product sheet (colorway/pack) before any gen.  
2. Spectacle must still be the product’s physics — no logo 0–3s.  
3. Keyframe stills → i2v; hold product ≥1.2s; grade once.  
4. Signature endcard in post.  
5. Always cut a UGC/DR twin for spend (dual-track).

## Per-unit habit (every class)

For each unit prompt name: **CAMERA / LIGHT / MOTION / GRADE / NEGATIVES**.  
Craft block: ≥2 `#HEX`, real fonts, motion, E1, formats.  
Claims: user proof or `[PLACEHOLDER…]` — never invented %.

## Research ritual (10 minutes, optional but sharp)

1. Open libraries from retrieve `attention_models.research` / `studies[].research_where`.  
2. Note: hook type, seconds-to-product, caption density, CTA count, audio type.  
3. Emulate those jobs for **this** brand (`prompts/emulate-attention-model.md`).  
4. Private named-competitor breakdowns → `studies/private/` (gitignored).

## Done

- Study id + attention model id named in the package  
- Timed script ≥6 rows with exact quoted VO  
- `human_build` steps executed or explicitly mapped to your rung  
- Full duration covered (`finish-the-cut`)  
- Lint `"ok": true` with real JSON  

---
## 4) HARNESS EQUALIZATION

# Harness equalization — make any LLM’s tools good enough

Different agents see different tools. **Equalize before you invent missing capabilities.**

Run (preferred):

```bash
node scripts/probe-harness.mjs
# or: node scripts/probe-harness.mjs --fill   # interactive checklist → JSON
```

## Capability → pipeline rung

| You have | Rung | Do this |
| --- | --- | --- |
| Seedance / Higgsfield / peer **MCP live in session** | **connected** | Call tools per `connected-run-protocol.md`. Log real job ids. |
| Those tools exist for the **user** but not here | **handoff** | Write paste-ready prompts + refs; user runs elsewhere. |
| Image gen and/or short video + editor (CapCut etc.) | **assembler** | Keyframes → short clips → edit. Same sheets/lint. |
| Text-only / no gen tools | **package-only** | Still ship lint-clean package + unit prompts. Say `NOT_RENDERED`. |
| Browser / web fetch | Use for URL briefs + public ad libraries | `brief-from-url.mjs` · `ad-libraries.md` |
| Shell + Node | Use mechanical loop | start → retrieve → lint until ok |
| No shell | Paste `prompts/context-pack-lite.md` (or full pack) · offline retrieve JSON · `no-shell-lint-checklist.md` — **never invent lint JSON** |

## Equalization rules (non-negotiable)

1. **Name your tools** in the package Brief (`Tool access:`).  
2. **Pick one rung** — don’t pretend connected if you only have ChatGPT images.  
3. **Quality does not drop with rung** — density of Concept / beats / Craft stays gold-level.  
4. **Swap models, not standards** — Wan/LTX/Grok/Kling/Hailuo/stills per `alternative-model-routing.md`.  
5. **Never invent** Seedance/Higgsfield job ids, exports, or `"ok": true` lint.  
6. If a harness has a **native skill path**, load this skill from it (see INSTALL harness matrix).  
7. **Finish the cut** — if you can gen video/images, cover the full timed duration (`finish-the-cut.md`). Missing UI → generate authentic stills, don’t stall.  
8. **One agent owns the budget** — no parallel agents on the same package burning credits.

## Tool card (paste into package or chat)

```text
HARNESS TOOL CARD
- Harness: [[Cursor|Claude Code|Codex|Gemini|OpenClaw|ChatGPT|other]]
- Shell/node: [[yes|no]]
- Network/fetch: [[yes|no]]
- Image gen: [[tool names or none]]
- Video gen: [[tool names or none]]
- MCP ads/video: [[Seedance|Higgsfield|none]]
- Browser: [[yes|no]]
- Chosen rung: [[connected|handoff|assembler|package-only]]
- Equalization note: [[what you substituted]]
```

## Done means

Rung chosen + tool card filled + lint-clean package (or honest no-shell self-check).

---
## 5) NO-SHELL LINT

# No-shell lint checklist — hard gate

Use **only** when you cannot run `node scripts/lint-package.mjs`.  
Write at the top of the delivery: `LINT: not run (no shell)` — **never invent `"ok": true` JSON.**

Tick every box. Any fail → rewrite before delivery.

## Required sections (must exist as headings)

- [ ] Brief  
- [ ] Retrieval (pattern ids from live retrieve **or** `references/retrieve-offline-compact.json`)  
- [ ] Job-to-be-done (one sentence)  
- [ ] Concept (+ “Not the default because…”)  
- [ ] Consistency systems (sheets)  
- [ ] Creative stack / Hooks  
- [ ] Timed script (≥6 rows; exact quoted VO/on-screen — not “sparse”)  
- [ ] Claim ledger (no invented proof)  
- [ ] Craft system (≥2 `#HEX`, real font names, motion, E1, 9:16+1:1)  
- [ ] Render plan  
- [ ] Caption + Paid social copy (no ASSUMED/PLACEHOLDER/“only when supplied” leaks)  
- [ ] CTA (exactly one primary in-cut)  
- [ ] AI disclosure / rights  
- [ ] Self-critique  
- [ ] First-time-right  

## Hard fails

- [ ] No leftover `[[BRACKETS]]`  
- [ ] Attention model id (`am_*`) named  
- [ ] Harness tool card / rung declared  
- [ ] Muted-first 0–3s (no logo sting)  
- [ ] Craft free of: cinematic, stunning, 8k, sleek, epic, nice…  
- [ ] No invented Seedance/Higgsfield job ids (`NOT_RENDERED` OK)  
- [ ] Offline retrieve used only if no shell — ids must exist in offline JSON  

## Offline retrieve

Open `references/retrieve-offline-compact.json` → key like `beauty|tiktok` or `voice ai|meta` → paste `picks` + `attention_models`.

## Deliverable footer (paste)

```text
LINT: not run (no shell)
NO-SHELL CHECKLIST: all boxes ticked
RUNG: [[connected|handoff|assembler|package-only]]
ATTENTION MODEL: [[am_*]]
PATTERN PRIMARY: [[id from offline or prior retrieve]]
```

---
## 6) STUDIES + ATTENTION + HARNESS

- Probe: node scripts/probe-harness.mjs
- Studies: studies/corpus.json (via retrieve `studies`)
- Human build: references/human-build-os.md
- Lab: examples/visual/attention-lab.html
- Libraries: references/ad-libraries.md
- Generated UI: references/generated-ui-authenticity.md
- Offline retrieve: references/retrieve-offline-compact.json
- Angles: references/angle-axes.md

---
## 7) CRAFT DEFAULTS

# Craft defaults (compressed)

## Refuse
- Smiling hold-to-camera · floating product+particles · logo-first 0–3s
- “Tired of X? Meet Y.” · drone #1 · neon SaaS % · purple-glow AI
- Invented reviews/ROAS · image collage + slogan

## Must
- Attention model am_* · Concept + Not the default because…
- ≥6 timed rows · EXACT quoted VO · one CTA · muted-first
- Craft: ≥2 #HEX · real fonts · motion · E1 · 9:16+1:1
- No leftover [[BRACKETS]] · never invent lint JSON or job ids

---
## 8) PACKAGE SKELETON

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
## 9) GOLD DENSITY EXCERPT

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
---
## 10) COMMANDS

```bash
cd skills/ad-intelligence
node scripts/probe-harness.mjs
node scripts/agent-ready.mjs
node scripts/start-package.mjs --out packages/<brand>-ad.md
node scripts/retrieve.mjs --niche <n> --platform <p> --limit 5 --compact
node scripts/lint-package.mjs packages/<brand>-ad.md
```
