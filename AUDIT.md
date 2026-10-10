# AUDIT.md — Phase 0 (Gate 0)

**Date:** 2026-10-10  
**Audited tip:** `a08497a` (v3.19 finish-cut quality) on branch `cursor/classroom-hub-audit-08cd`  
**Authoritative remote check:** `origin/main` at audit time = `921c1eb` (v3.18). v3.19 lives on PR tip / this branch — **not yet on main**. Verified via `git fetch origin main` + `git log origin/main -1` (not a shallow cache guess).  
**Scope:** inventory + run every ship script. **No code changes in this phase.**

Audience: builder of Classroom + Production Hub (PART A–C of the upgrade plan). Gate 0 = this file committed and reviewed by the user.

---

## 0. One-line diagnosis (confirmed)

**The repo gates package shape well and sources / measures render reality almost not at all.**

Lint, study provenance, finish-the-cut *document* rules, claim ledger, and backtest are real and green. There is **no** instrument that opens a rendered `.mp4` and fails delivery. There is **no** brand-harvest gate. There is **no** classroom of annotated real ads with measured pacing. Agents that pass lint can still ship the Oply-class defects in plan §0 / PART B.

---

## 1. What exists (tree)

### 1.1 Repo root

| Path | Role |
| --- | --- |
| `skills/ad-intelligence/` | Canonical skill (Agent Skills) |
| `.cursor/skills/ad-intelligence` → symlink | Same tree (also `.claude`, `.agents`, `.github`) |
| `AGENTS.md`, `INSTALL.md`, `README.md`, `PROOF.md`, `CONTRIBUTING.md`, `PUBLISH.md`, `LICENSE` | Discovery / proof / legal |
| `CHANGELOG.md` | Version history (top = **3.19.0** on this tip) |
| `.cursor-plugin/plugin.json` | Plugin **3.19.0** |
| `schema/` | `ad-blueprint`, `study`, `query` JSON schemas |
| `ingest/` | Sample private-study ingest JSON + README |
| `scripts/rebuild-index.mjs` | Rebuilds `database/index.json` from patterns |
| `packages/` (repo root) | Empty placeholder (`.gitkeep`) — **easy to confuse** with skill scratch |
| `skills/ad-intelligence/packages/` | Local start-package / backtest scratch (**gitignored**) |
| `.cursor/rules/ad-intelligence.mdc` | Cursor routing rule → same one-shot path (`alwaysApply: false`) |

**Plan targets — all MISSING at root and under skill:**

`classroom/` · `library/` · `pipeline/` (compose/qa/critic) · `regression/` · `specs/ad-spec.schema.json` · `logs/`

(There is a prose `skills/ad-intelligence/pipelines/one-stop-ad-maker.md` — not an executable compose pipeline.)

### 1.2 Skill layout (`skills/ad-intelligence/`)

| Dir / file | Count / size | Purpose |
| --- | --- | --- |
| `SKILL.md` | **82 lines** | Already under 150-line target; still says **“Do not brainstorm”** + **≥6 beats** + lint-then-finish order |
| `scripts/` | 15 entrypoints + `lib/validate-study.mjs` | Probe, retrieve, lint, gates, ingest, library-access, brief-from-url, packs |
| `database/` | 47 patterns, 23 niches, hooks/flows/trends | Grammar index |
| `studies/` | `corpus.json` (10 studies, all `synthesis` / `video_timed`), private gitignored, fixtures | Archetype studies + provenance |
| `references/` | Craft OS, sheets, firewall, policy, attention models, offline retrieve (~179KB), creative-stack | Prose + JSON toolbox (not executable render components) |
| `prompts/` | one-shot, finish-the-cut, context-pack (**684** / lite **615** lines), harness | Rituals; context packs duplicate finish-the-cut / human-build |
| `examples/` | 5 full-depth golds, shape-only `entertainment-creator-series.md`, stub `viral-plus-cinema-brief.json`, 9 lint-corpus fails, 6 stress briefs, Attention Lab + **tracked** `visual/frames/*.jpg` | Teaching fixtures |
| `checklists/` | `first-time-right.json` (25 gates), `render-qa.json` (12 checks) | **Self-filled** checklists — not video instruments |
| `demo/` | Pointers to gold quality targets | |
| `packages/` | gitignored scratch | |

### 1.3 Scripts (headers / real role)

| Script | Works? | Role |
| --- | --- | --- |
| `probe-harness.mjs` | ✅ | Tool card + rung hint (`assembler_or_handoff_candidate` here). **No hardware/GPU/ffmpeg/TTS report.** |
| `retrieve.mjs` | ✅ | Patterns ⊕ studies ⊕ attention models + provenance + format projection + library_access |
| `lint-package.mjs` | ✅ | Markdown ship gate (sections, craft, claims, study honesty, incomplete-hook / silent-cut on **claimed RENDERED**) |
| `demo-quality-gates.mjs` | ✅ | Gold PASS + lint-corpus FAIL + studies join |
| `backtest.mjs` | ✅ | 58/58 mechanical assertions |
| `fresh-clone-prove.mjs` | ✅ | Studies + gates on clone |
| `agent-ready.mjs` | ✅ | Wrapper: probe + gates |
| `start-package.mjs` | ✅ | Writes skeleton from package-skeleton |
| `brief-from-url.mjs` | ✅ | Thin S1 brief; **not** full brand harvest (palette/mascot/fonts/UI) |
| `library-access.mjs` | ✅ | Access ladder JSON (claims Meta `login_free` — see §5) |
| `ingest-blueprint.mjs` | ✅ | Validate → private write; media rejection present |
| `build-context-pack.mjs` / `build-offline-retrieve.mjs` / `build-attention-lab.mjs` | ✅ builders | Regenerate packs / offline JSON / lab |

---

## 2. Script runs (this environment — pasted facts)

### 2.1 Environment (probe *should* say this; it currently does not)

```
Host:        Linux, CPU-only
GPU:         none (no nvidia-smi)
CPU / RAM:   4 cores / ~15 GB
Node:        v22.14.0
ffmpeg:      6.1.1 present
Python:      3.12.3
uv:          not on PATH in this shell
~/.fonts:    empty / not provisioned in this audit shell
Network:     GitHub ✅ · oplyai.com HTTP/2 200 ✅
```

`probe-harness --json` reported: `recommended_rung_hint: assembler_or_handoff_candidate`, files_ok all true, **no GPU/hardware fields**.

### 2.2 Gate suite

| Command | Result |
| --- | --- |
| `node scripts/demo-quality-gates.mjs` | OK — 5 golds PASS; 9 lint-corpus CAUGHT; studies join PASS |
| `node scripts/backtest.mjs` | **58/58** passed |
| `node scripts/fresh-clone-prove.mjs` | OK |
| `node scripts/agent-ready.mjs` | Gates: PASS |
| `lint examples/beauty-dtc-dual-track.md` | `ok: true` |
| `start-package` → lint skeleton | `ok: false` (unfilled-placeholder + craft) — expected |
| `brief-from-url.mjs https://example.com` | Fetches; PLACEHOLDER-heavy brief |
| `library-access --niche "home services" --platform meta` | Returns Meta primary + Google/Lab fallbacks |
| `retrieve --niche "voice ai" --platform meta --compact` | Studies primary `study_voice_agent_missed_call`; AM primary `am_ui_aha_saas`, challenger `am_voice_agent_missed` |

### 2.3 Confirmed mechanical bugs (PART B) — reproduced here

#### B1.1 — `gold_fixture` pointer dropped

`references/attention-models.json` has:

`am_voice_agent_missed.gold_fixture = "examples/voice-agent-front-desk.md"`

Compact retrieve projection of that model **omits** `gold_fixture` (keys: id, name, why_stops_scroll, pattern_ids, ideal_seconds, timing, anti_slop only). Agent never forced to open the gold that says UI screenshots required for ship.

#### B7.3 — finish gate trusts `Render status` over receipts (fail-open)

Experiment: identical package (real job id `a50b03aa`, FINISH-THE-CUT hook-only, no audio), only header differs:

| Header | `lint-package` |
| --- | --- |
| `Render status: RENDERED` | `ok: false` → `incomplete-hook-only`, `silent-cut-incomplete` |
| `Render status: NOT_RENDERED` | **`ok: true`**, issues `[]` |

So an agent can log a real render job, claim a finish block, leave status `NOT_RENDERED`, and **pass**. Gate is opt-out by omission. Needs evidence-derived finishedness + `render-status-contradicts-log`.

#### shape-claims-pass (v3.19)

Fixed on this tip: fixture markers + `examples/` path scope; bare `structure only` no longer false-positives (backtest asserts). Still **no** `regression/false-positive/` corpus as a standing pattern (B7.2).

#### Library access vs agent runtime (B3.1)

Repo marks Meta Ad Library `access: login_free`. PART B evidence (and plan): headless agent sees login wall / 0 ads. **Missing:** `verified_via: human_browser | agent_runtime` on access claims. Google Transparency is the reliable login-free path and often yields **search_text** (no timing).

#### Oply brand harvest spot-check (C2)

`curl https://oplyai.com` returns 200; HTML contains `asset-1.png`, `asset-2.png`, “Same brain”, “access call”, hex samples. Confirms brand reality is one HTTP fetch away — and `brief-from-url` does **not** pull palette/mascots/fonts into consistency sheets.

---

## 3. Keep / replace / cut (plan §10 + PART B10)

### 3.1 KEEP (verified working)

| Asset | Evidence |
| --- | --- |
| Claim ledger / never invent proof | Golds + lint metric rules; Oply session used PLACEHOLDER honesty |
| Harness probe | Correct rung hint; files_ok |
| Consistency sheet *structure* | Present; failure is sourcing (B1), not the sheet shape |
| Study provenance + join precedence | retrieve + ingest + lint `study-synthesis-cited-as-proof` |
| Ingest validation + media rejection | Rejects bad private JSON / media-shaped fields |
| Backtest / demo-quality-gates / fresh-clone | Real assertions, green |
| Policy precheck + claim-firewall + mistakes-library | Present under `references/` |
| Stress briefs | 6 messy briefs |
| Finish-the-cut *intent* + v3.19 incomplete/silent lint | Directionally right; still document-level + fail-open (B7.3) |
| Library-access ladder concept | Right idea; needs runtime-verified tiers |
| `structure.format` / `timing_observable` | Required on studies; search_text fixture gated |

### 3.2 MARK FOR REPLACEMENT

| Current | Why | Plan target |
| --- | --- | --- |
| **≥6 beats** (`script-density` in lint) | Rewards slow 3–4s fades; Oply had ~6 scenes, 0 hard cuts | Cut-rate / pacing curves from study cards |
| **Lint as final ship gate** | Lint green ≠ render good | Render QA on actual video (Phase 5) |
| **“Do not brainstorm” / single concept** | First idea ships | 3 concepts → cull (workflow step 4) |
| **Prose craft system** | “Kinetic type” never becomes motion | `library/` executable components + Remotion spec |
| **Archetype-only studies corpus** | 10 synthesis JSON; no measured keyframes/taste | `classroom/study-cards/` with measured stats |
| **Self-filled `render-qa.json`** | Same model ticks boxes | Instrument suite (`pipeline/qa/`) |
| **Assembler slideshow ceiling** | Stills + captions + fades when probe lands assembler | Honest ceiling + UI kits + compose engine |
| **Font names without files** | Spec “Anton” → Liberation fallback | Provisioned `library/typography/` |
| **Music / bed as “any audio”** | Sine tone passes presence checks | Licensed beds + “bed is real music” QA |
| **`brief-from-url` as brand intake** | Thin OG/H1 scrape | Phase 2.5 brand harvest gate |

### 3.3 OVERLAPS / DEAD WEIGHT

| Item | Note |
| --- | --- |
| Context-pack.md / lite embed full finish-the-cut + human-build | Triple maintenance with `prompts/finish-the-cut.md` |
| `pipelines/one-stop-ad-maker.md` vs `prompts/one-shot.md` vs SKILL | Three entry narratives |
| Symlinked harness copies | Good — single tree |
| Entertainment shape-only example | Keep as shape teaching; not quality bar |
| Offline retrieve JSON (~179KB) | Useful for no-shell; will need classroom projection later |

### 3.4 SKILL.md

Already **82 lines** (under ~150). Content still encodes the old ritual: brainstorm ban, ≥6 beats, lint-then-finish. Shrink is done; **rewire order** to Classroom workflow (plan §9) after Gate 0.

---

## 4. Gap map vs Classroom + Hub plan

| Plan component | Status |
| --- | --- |
| `classroom/study-cards/` + schema + private-cache | **Missing** |
| Niche packs / derived patterns from cards | **Missing** (have `database/niches` + attention models instead) |
| `library/` transitions/camera/captions/lighting/grades/type/sound/ui-kits/templates | **Missing** (prose in references/creative-stack) |
| Remotion / deterministic compose | **Missing** |
| `pipeline/qa` render instruments | **Missing** (only checklist JSON) |
| `pipeline/critic` vision loop | **Missing** |
| `specs/ad-spec.schema.json` | **Missing** (have package markdown skeleton) |
| `regression/fail/oply-v1` + pass corpus + false-positive corpus | **Missing** |
| Brand harvest Phase 2.5 | **Missing** |
| Hardware in probe | **Missing** |
| Pointer resolution (`gold_fixture`) | **Broken** (field exists, not projected) |
| Evidence-derived finish gate | **Broken** (B7.3 reproduced) |
| Multi-aspect re-render QA | **Missing** (docs say separate aspects; no hard fail) |

---

## 5. Access & legal (current)

- LICENSE / CONTRIBUTING: do not commit scraped creatives — **aligned** with plan Phase 1.
- `.gitignore`: `studies/private/**`, skill `packages/`, private-signals — **good**.
- **Gap:** no explicit `*.mp4` / media-blob ignore; fictional storyboard JPGs under `examples/visual/frames/` are tracked (OK as owned teaching frames — Phase 1 must still ban competitor media / private-cache commits).
- No `classroom/private-cache/` yet (should be gitignored when added).
- Media rejection in validate-study — **keep / harden** (B3.2).
- Access tiers lack `verified_via` (B3.1).

Inventory cross-check: [Audit skill file inventory](bc-1637eb83-f53d-5844-bdb8-cb4081f4ef67) — line counts, symlink map, and script headers agree with §1; no additional KEEP/REPLACE conflicts.

---

## 6. Recommended build order (unchanged from plan; confirmed)

1. **Gate 0** — this audit (stop here for user review).  
2. **Phase 1** — `classroom/README.md` legal/sourcing rules.  
3. **Phase 5 early** — `pipeline/qa` + `regression/fail/oply-v1` with C1 measured expectations; fix B7.3 finish gate + false-positive corpus.  
4. **Phase 2.5 + B5.1** — brand-harvest script + font/voice/music provisioning **before** next design attempt.  
5. **Phase 2** — study cards for home-services / AI phone agents first; fix `gold_fixture` projection.  
6. Phase 3 toolbox → Phase 4 spec/templates → Phase 6 critic → E2E Oply rebuild.

Do **not** expand archetype JSON further as the main learning path. Do **not** treat lint `ok: true` as ship.

---

## 7. Known failure modes seed (for later `known-failure-modes.md`)

Seed from plan §0 + PART B0.1 / B0.2 (not implemented this phase):

- Frame-0 empty black caption pill / zero-alpha flatten  
- Declared font ≠ rendered font  
- search_text projected as timed video  
- Silent / hook-only “finished” via NOT_RENDERED opt-out  
- shape-claims false positive on sanctioned vocabulary (fixed v3.19; needs false-positive corpus)  
- Inaudible sine “music bed”  
- Caption duplicates headline  
- Unattributed credit spend / shared account  
- Cropped multi-aspect from 720 master  
- Stale git cache “not on main” false claim  
- Tool-output masking (`***` / `...`) phantom defects  

---

## 8. Gate 0 checklist

- [x] Inventory of skill + root  
- [x] Every major script executed with recorded output  
- [x] Keep / replace / cut called out  
- [x] Plan-target gaps listed  
- [x] PART B defects reproduced where testable (gold_fixture drop, finish fail-open)  
- [x] No product code changed in this phase  
- [ ] **User has seen this file** ← exit condition for Gate 0  

**Stop.** Do not start Phase 1 until Gate 0 is acknowledged.
