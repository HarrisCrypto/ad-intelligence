# Changelog

## Unreleased — Classroom + Production Hub

**Gate 0–1 + Phase 5 early** — audit, legal floor, and render QA that fails Oply v1 for the right reasons.

### Added
- `AUDIT.md` — Phase 0 inventory, script runs, keep/replace/gaps (Gate 0)
- `HUB.md` — single-track status board
- `classroom/README.md` — legal & sourcing rules (Gate 1)
- `classroom/known-failure-modes.md` — Oply + process failure seeds
- `classroom/private-cache/` gitignored for local reference media
- `pipeline/qa/` — `run-qa.mjs`, `synthesize-oply-v1.mjs`, `prove-qa.mjs`
- `regression/fail/oply-v1/` — expected hard fails from measured teardown (C1)
- `regression/false-positive/` — corpus stub for over-aggressive gates (B7.2)

### Added (Gate 2.5)
- `scripts/brand-harvest.mjs` (+ `pipeline/scripts/brand-harvest.mjs`) — live-site palette/fonts/CTA/assets → ASSET_VERIFIED consistency block
- `library/typography/` — OFL Anton, Poppins, Inter Tight + `fallback-map.json`
- `library/sound/` — voice tier ladder + real-bed rule (no sine drones)
- Probe reports hardware (CPU/RAM/GPU/ffmpeg) + quality ceiling + voice tier default

### Added (Gate 2)
- `classroom/study-cards/_schema.json` — AdStudyCard schema (`format` + `timing_observable`, `what_not_to_copy`, confirmed/draft)
- `classroom/study-cards/home-services/` — 10 confirmed cards (void→answer, geo phone, UI demo, search_text honesty, …)
- `classroom/study-cards/technique/` — 6 confirmed pacing/caption/safe-zone/UI/format cards
- `classroom/niche-packs/home-services.md` — objections, hook bank, slop list
- `classroom/scripts/validate-card.mjs` + `retrieve-cards.mjs` — media rejection + niche retrieve

### Added (Gate 3)
- `library/{transitions,camera,captions,lighting,grades}/catalog.json` — executable craft presets
- `library/ui-kits/voice-agent-flat/` — 3-state kit + HTML preview
- `library/templates/home-services-missed-call/` — study-card → library binding
- `library/scripts/resolve-toolbox.mjs` + `demo-compose-plan.mjs`

### Added (Gate 4)
- `specs/ad-spec.schema.json` + `validate-ad-spec.mjs`
- Example specs: `oply-missed-call`, `local-geo-phone`
- Second template: `library/templates/home-services-local-geo/`

### Added (Gate 6 + E2E)
- `pipeline/critic/critique-frames.mjs` — offline package critic + QA handoff
- `pipeline/qa/synthesize-oply-v2.mjs` + `regression/pass/oply-v2/` — PASS inverse of oply-v1
- `pipeline/scripts/e2e-brief-to-plan.mjs` — brief → retrieve → spec → plan → optional v2 QA

### Fixed
- Finish completeness is evidence-derived: `render-status-contradicts-log` when `NOT_RENDERED` contradicts job receipts (B7.3)
- Compact retrieve keeps `gold_fixture` + `gold_fixtures[]` (B1.1)

### Note
v3.19 finish-cut quality lands in the same PR branch as this hub work.

## 3.19.0 — 2026-10-10

**Finish-the-cut quality bar** — silent 8s hooks cannot count as finished ads; shape-claims-pass no longer punishes honest synthesis labels.

### Fixed
- `shape-claims-pass` scoped to real fixture markers (`shape-only`, `not a length or quality target`, `SHAPE FIXTURE`) and `examples/` paths — bare `structure only` (retrieve join / synthesis honesty) no longer false-positives when lint reports PASS

### Added
- Lint: `incomplete-hook-only` — RENDERED packages that only cover the ~8s hook while the timed script continues
- Lint: `silent-cut-incomplete` — RENDERED packages with no VO/SFX/bed audio path
- Fail corpus: `fail-incomplete-hook-only.md`, `fail-silent-cut-incomplete.md`, `fail-shape-claims-pass.md`
- Finish-the-cut contract: `Audio laid in post` line; Done means requires full duration + audio + quality bar

### Changed
- One-shot / SKILL / context packs / harness prompt: full cut + audio is mandatory for RENDERED
- Plugin **3.19.0**

## 3.18.0 — 2026-10-10

**Library access when TikTok / Meta gate you** — agents still see styles across platforms.

### Added
- Access tiers + deep links + fallback ladder in `references/ad-libraries.md`
- `public_libraries` metadata: `access`, `entry_url`, `deep_link_template`, `fallbacks`, `when_walled`, `covers_styles_also`
- `scripts/library-access.mjs` — prints research plan for niche/platform/keyword
- Retrieve `attention_models.research` includes access + deep_link + fallbacks
- Attention Lab cards show access tier + fallbacks

### Changed
- One-shot / SKILL: run library-access before stalling on login walls
- Plugin **3.18.0**

## 3.17.0 — 2026-10-10

**Study format projection** — search-text / static observations must not look like timed video after retrieve.

### Added
- Required `structure.format` + `timing_observable` on every study
- Retrieve/`compactStudy` projects `format`, `timing_observable`, `observed_limits`, `structure.format_note` (non-video)
- Fixture `study_fixture_search_text` + gates assert search_text survives compact retrieve
- Validate rejects video-second beat labels on `search_text` / static formats

### Changed
- Public corpus backfilled `format: video_timed`
- Plugin **3.17.0**

## 3.16.0 — 2026-10-10

**Mechanical honesty for studies** — the claim “studies are honest about what they are” is now lint-enforced, not README-only.

### Added
- `lint-package.mjs`: `study-synthesis-cited-as-proof`, `study-provenance-undeclared`, `study-unknown-id`
- Fail corpus: `examples/lint-corpus/fail-study-synthesis-as-proof.md`
- Media rejection in `validate-study.mjs` / ingest (data-URIs, base64 blobs, media URLs/keys)
- Retrieve `studies.match_status` + `loud` when no niche-aligned study (`none_for_query`)
- Observed-shape fixture docs under `studies/fixtures/observed-shape/` (private path; public corpus stays synthesis)

### Changed
- Voice gold Retrieval declares synthesis study provenance honestly
- Package skeleton requires study provenance lines when citing studies
- Plugin **3.16.0**

## 3.15.0 — 2026-10-10

**Studies honesty + any-harness proof** — provenance labels, ingest validator, loud private failures, join reconciliation tests, human-build log artifact, CI fresh-clone gates. Addresses: unlabelled synthesis-as-proof risk, empty private workflow, untested join, build-log as artifact.

### Added
- Hard `provenance` on every study (`observed`, `basis`, `claim_firewall`) — surfaced in retrieve
- `schema/study.schema.json` · `scripts/lib/validate-study.mjs` · `scripts/ingest-blueprint.mjs`
- Retrieve `studies.join` reconciliation rule; exit **3** on invalid study files (no silent skip)
- `studies/fixtures/private-join/` + gates asserting join; `fresh-clone-prove.mjs`
- `.github/workflows/fresh-clone-gates.yml`
- `references/human-build-log.template.md` + seed `examples/human-build-logs/voice-agent-assembler-seed.md`

### Changed
- One-shot: copy provenance; fill build **log** artifact; never launder synthesis into proof
- Plugin **3.15.0**

### Note
Shipped on `main` (merged from multi-harness PR). Default clone includes studies + gates.

## 3.14.0 — 2026-10-10

**Studies OS** — any LM / any harness can one-shot from archetypal viral, performance, and award-film structures: when to emulate, what to steal, how a human builds with real tools — without scraping creatives.

### Added
- `studies/corpus.json` — 10 archetypal studies (confession UGC, skit, PAS, hero film, beauty macro, food loop, local geo, voice agent, listicle, text-first X)
- `studies/README.md` · `studies/private.example.json` · gitignored `studies/private/`
- `references/human-build-os.md` — tool ladders + class playbooks (viral / DR / brand film)
- `retrieve.mjs` returns matched `studies` (public + private) in full and `--compact`
- Offline retrieve + context packs include studies / human-build

### Changed
- One-shot / SKILL / emulate / Attention Lab / INSTALL: study → emulate → human_build → finish-the-cut
- Plugin **3.14.0**

### Preserved
- No scraped creatives in public repo; claim firewall; private competitor breakdowns stay local

## 3.13.0 — 2026-10-10

**Finish the cut** — stop the Hermes failure mode: render an 8s hook, then ask the human for UI screenshots while parallel agents burn credits on rubber dashboards.

### Added
- `prompts/finish-the-cut.md` — full-duration completion contract; one agent owns budget
- `references/generated-ui-authenticity.md` — generate calm flat UI states when no captures exist

### Changed
- One-shot / SKILL / assembler / brief-defaults / voice gold: generate UI instead of stalling; user assets are v2 upgrades
- Harness equalization: no parallel credit burn; finish-the-cut duty when gen tools exist
- Plugin **3.13.0**

### Preserved
- Prefer real screen records when supplied; never invent metrics; post owns tiny type/logo

## 3.12.2 — 2026-10-10

Backtest hardening: compact retrieve keeps timing sheets; attention ranking respects query affinity (shampoo≠generic beauty); `scripts/backtest.mjs` mechanical suite.

### Added
- `scripts/backtest.mjs` — discovery, gates, retrieve matrix, offline align, URL brief, lint negatives, ranking sanity, gold lint

### Fixed
- `--compact` dropped `timing` (broke emulate path)
- Hair specialist winning every beauty query; food_crave winning plain ecommerce

## 3.12.1 — 2026-10-10

Close remaining 35-lens ROI items: offline retrieve for no-shell harnesses, lite context pack, hard no-shell lint checklist; drop “cinematic” plugin keywords.

### Added
- `references/retrieve-offline-compact.json` (+ `build-offline-retrieve.mjs`)
- `prompts/no-shell-lint-checklist.md`
- `prompts/context-pack-lite.md` via `build-context-pack.mjs --lite --write`

### Changed
- One-shot / harness-equalization: offline path + hard checklist
- Plugin **3.12.1**

## 3.12.0 — 2026-10-10

**Multi-harness Agent OS** — 35-lens pass + safe patterns from Agent Skills / awesome-agent-skills ecosystems so any LLM can discover the skill, equalize its own tools, and still hit gold density.

### Added
- Discovery symlinks: `.claude/skills`, `.agents/skills`, `.github/skills` (+ existing `.cursor/skills`)
- Root `AGENTS.md` for Codex / OpenClaw / generic agents
- `scripts/probe-harness.mjs` + `scripts/agent-ready.mjs`
- `prompts/harness-equalization.md` — capability → rung (connected/handoff/assembler/package-only)
- `references/angle-axes.md`, `brand-context.example.md`, `multi-lens-os.md`
- SKILL.md `compatibility` + `metadata.version` (agentskills-friendly)

### Changed
- One-shot / harness system prompt / bootstrap / INSTALL / context-pack: probe-first
- Plugin **3.12.0**

### Preserved
- Attention Lab, public libraries, claim firewall, craft lint, no scraped creatives

## 3.11.0 — 2026-10-10

**Attention Lab + any-niche research** — agents can view teachable scroll-stop models, open public TikTok/Meta/IG/X/YouTube libraries, and brief from any URL (hair, food, AI/voice SaaS, …) without image+slogan slop.

### Added
- `references/attention-models.json` — 14 timing/shot/word models across platforms
- `references/ad-libraries.md` — Meta Ad Library, TikTok Creative Center, Google Transparency, X Ads, LinkedIn
- `examples/visual/attention-lab.html` (+ `build-attention-lab.mjs` / `attention-data.js`)
- `prompts/brief-from-url.md`, `prompts/emulate-attention-model.md`
- `scripts/brief-from-url.mjs` — fetch public page → tagged S1 brief (no invented proof)
- Stress brief `messy-ai-ops-site.md` (URL-style AI/voice agent)
- `retrieve.mjs` returns `attention_models` + research URLs (compact too)
- `brief-defaults` S1_url extract checklist; tool-catalog public-library vs private-ingest boundary

### Changed
- Niche synonyms/aliases: shampoo/haircare, food, AI/voice agent → correct packs
- One-shot / SKILL / skeleton / context-pack: research → model → Concept → craft
- Swipe niche hints: apps, home, pets, automotive, fashion
- Plugin **3.11.0**

### Preserved
- No scraped creatives; claim firewall; craft lint; gold fixtures; Cursor `.cursor/skills` discovery

## 3.10.0 — 2026-10-10

**One-shot quality that agents can’t paperwork-game** — concept-first density, Cursor discovery, and lint that rejects empty skeletons.

### Added
- `.cursor/skills/ad-intelligence` symlink so Cursor discovers the skill when the repo is open
- Lint rules: `unfilled-placeholder`, Concept (“Not the default because…”), script-density ≥6 rows, exact-copy (no “sparse” VO), font-hedge bans
- `examples/lint-corpus/fail-unfilled-skeleton.md`
- Committed `prompts/context-pack.md` (pasteable for external LLMs)
- `retrieve.mjs --compact` for pick-focused context

### Changed
- `prompts/one-shot.md` / skeleton / output template: Concept → dense beats → craft before ledger polish
- Gold fixtures denser (Concept + ≥6 exact-VO rows + real fonts)
- SKILL description: trigger-rich + concept-first one-shot
- Plugin **3.10.0**

### Preserved
- Claim firewall honesty, triple-path, assembler + model routing, elite craft OS

## 3.9.0 — 2026-10-10

**One-shot agent path** — stop brainstorming; copy skeleton → retrieve → fill → lint loop (how top Cursor skills keep quality reliable).

### Added
- `prompts/one-shot.md` — hard sequence + refusal rules
- `references/package-skeleton.md` — fill-`[[BRACKET]]` package agents copy
- `scripts/start-package.mjs` — write skeleton to `packages/<brand>-ad.md`
- `scripts/build-context-pack.mjs` — single pasteable pack for any LLM
- `.cursor/rules/ad-intelligence.mdc` — route ad requests to the one-shot path

### Changed
- `SKILL.md` rewritten: trigger-rich description + mandatory one-shot procedure first
- Harness / INSTALL / README: one-shot commands as the default
- Plugin **3.9.0**

### Preserved
- Craft lint (3.8.1), elite OS, assembler + model routing, claim firewall, gold fixtures

## 3.8.1 — 2026-10-10

Harden craft gates so a Craft system **heading** is not enough — vague “cinematic / nice colors” packages fail lint (follow-up from quality audit).

### Added
- Lint rules: `craft-hex`, `craft-type` / `craft-font-generic`, `craft-endcard`, `craft-aspect`, `craft-motion`, `craft-vague-lexicon`, `copy-leak`
- Lint corpus: `fail-vague-craft.md`, `fail-copy-leak.md`

### Changed
- Gold fixtures: named type roles, ≥2 HEX palettes, consumer paid copy without ledger leaks
- `elite-creative-os.md` + output template: document hard craft lint bans
- `retrieve.mjs`: dual-track twin never equals primary
- Plugin **3.8.1**

### Preserved
- Claim firewall, three rungs, elite OS / finish spec / bootstrap from 3.8.0

## 3.8.0 — 2026-10-10

Elite craft layer so packages look like **custom templates from a top creative shop** — even without Higgsfield — and so any LLM actually loads the GitHub repo + tools.

### Added
- `references/elite-creative-os.md` — agency craft OS (hooks, edit rhythm, palette/grade, typography, motion, sound, endcard)
- `references/production-finish-spec.md` — CapCut / aspect / type finish template
- `prompts/bootstrap-from-github.md` — clone → read order → retrieve/lint for any harness
- Output template + lint: required **Craft system** section
- `first-time-right` gate `craft-bar`

### Changed
- All five gold fixtures: filled Craft system blocks
- Harness system prompt rewritten for elite craft + repo/tool mandates
- SKILL / one-stop / INSTALL / README: craft bar + bootstrap path
- Plugin **3.8.0**

### Preserved
- Claim firewall, mechanical lint honesty, three rungs, alternative model routing, render-QA

## 3.7.1 — 2026-10-10

Expand alternative-model routing with more open-weight and hosted peers agents actually use.

### Added / expanded
- `alternative-model-routing.md`: **HunyuanVideo**, **CogVideoX**, **SkyReels**, **Hailuo**, **Luma**, **Pika** (+ quick chooser)
- `tool-catalog.json` v3.2: matching entries with license/access notes (no invented endpoints)

### Changed
- Assembler preferred-tools table, SKILL / one-stop / harness / creative-stack README pointers
- Plugin **3.7.1**

### Preserved
- Priority still Wan → LTX → Grok before other opens; three rungs; sheets/ledger/lint/render-QA

## 3.7.0 — 2026-10-10

Alternative-model routing for agents **without** Seedance/Higgsfield — aim for cinematic quality via open/accessible tools instead of defaulting to silent stills.

### Added
- `references/creative-stack/alternative-model-routing.md` — quality ladder: Wan 2.2 → LTX-2.5 → Grok Imagine (`grok-imagine-video-1.5`) → Kling/Runway/Veo-Sora → stills+CapCut
- `tool-catalog.json` entries for Wan 2.2, LTX-2.5, Grok Imagine (license/access notes; prompt-handoff/local/API — no invented endpoints)

### Changed
- Assembler pipeline: Preferred tools subsection + ladder pointer
- SKILL.md, one-stop pipeline, harness prompt, creative-stack README, INSTALL, LAST-VERIFIED
- Plugin **3.7.0**

### Preserved
- Three rungs (connected / handoff / assembler); sheets, claim ledger, lint, render-QA, never invent proof/Seedance jobs

## 3.6.1 — 2026-10-10

Discoverability: make the **assembler** rung and **voice/front-desk** fixture impossible to miss. No new gates; content from 3.6.0 unchanged.

### Added
- `references/creative-stack/README.md` — three-rung index (connected · handoff · assembler) + voice fixture pointer

### Changed
- Root README / PROOF: **triple-path** wording; assembler + voice + render-QA in Start here tables
- INSTALL / one-stop pipeline: rung index + assembler tool option in agent prompts
- Plugin **3.6.1**

### Preserved
- Assembler pipeline, render-QA checklist, voice gold fixture, five full-depth fixtures, lint gates

## 3.6.0 — 2026-10-10

Three targeted upgrades for agents **without** Seedance/Higgsfield, plus post-render QA and a voice/front-desk gold fixture.

### Added
- `references/creative-stack/assembler-pipeline.md` — third rung (keyframes + short clips + CapCut); sheets/ledger/lint unchanged
- `checklists/render-qa.json` — post-render / assembler export checks (hands, text-melt, identity drift, audio, frozen beats, duration, endcard, muted-fail, …)
- `examples/voice-agent-front-desk.md` — full-depth lint-clean phone-call / front-desk service fixture (assembler-aware)

### Changed
- SKILL.md, one-stop pipeline, output template, first-time-right: pipeline rung + render-qa gates
- PROOF / demo / INSTALL / demo-quality-gates: list voice fixture + assembler path
- Plugin **3.6.0**

### Preserved
- Connected + handoff paths unchanged; dual-track; claim firewall; mechanical lint; prior gold fixtures

## 3.5.0 — 2026-10-10

Toward-perfect layer: **visual design examples**, stress briefs, lint corpus demo, deeper compliance, richer signals — gates still intact.

### Added
- `examples/visual/` — HTML gallery + 7 storyboard stills (beauty, local, SaaS, kettle) paired to gold fixtures
- `examples/stress-briefs/` — messy real-world prompts (beauty, local, fintech, housing, health) with expected traps
- `examples/lint-corpus/` — intentional fail packages
- `scripts/demo-quality-gates.mjs` — proves gold PASS + corpus CAUGHT

### Changed
- `policy-precheck.json` v1.1 — housing/credit/health decision tree + human-review rule
- `swipe-signals.json` v1.2 — real-estate / b2b / travel niche hints
- LAST-VERIFIED, README, PROOF, INSTALL, demo pointers, plugin **3.5.0**

### Preserved
- Dual-path, sheets, claim ledger, render plans, lint, self-critique, dual-track, full-depth markdown fixtures

## 3.4.0 — 2026-10-10

Final polish: multi-niche full-depth gold fixtures + version sync. Quality gates unchanged.

### Added
- Full-depth lint-clean fixtures: `local-service-trust.md`, `saas-demo-pas.md`, `physical-product-hero.md` (match beauty honesty/structure)
- `examples/README.md` depth table

### Changed
- `PROOF.md` + `demo/` point at four full-depth fixtures; entertainment remains shape-only
- README / INSTALL / SKILL quality-bar pointers list multi-niche fixtures
- Plugin / marketplace version **3.4.0**
- Output template confirmed aligned (claim ledger, consistency systems, render plan/log, self-critique, AI disclosure)

### Preserved
- Dual-path, claim firewall, sheets, render plans, mechanical lint, self-critique, dual-track default
- Adoption layer from 3.3 (PROOF, INSTALL, CONTRIBUTING, private swipe notes)

## 3.3.0 — 2026-10-10

Adoption upgrade: make the value obvious and the repo easy to install — without diluting lint, claim firewall, sheets, render plans, or dual-path logic.

### Added
- `PROOF.md` — before/after vs generic LLM slop + “what this prevents”
- `CONTRIBUTING.md` — niche/pattern/example/handoff/slop-report contribution paths + how to share results
- `.github/ISSUE_TEMPLATE/slop-report.md` — “package still produced X slop”
- `skills/ad-intelligence/demo/` — canonical quality-target pointer for agents
- `references/swipe-signals.md` — human structure + **private winning notes** how-to
- `references/private-signals.example.json` + gitignore for `private-signals.json`
- Retrieve optional merge of private signals (`AD_INTEL_PRIVATE_SIGNALS` or local file)

### Changed
- `README.md` — outcome-first; dual-path one-liner; proof / install / demo / lint prominent; tool-status summary
- `INSTALL.md` — one-line paths per harness + **Quick start for agents** block; discoverable retrieve/lint
- `swipe-signals.json` → v1.1.0 (more formats/niches + `failure_mode_index`)
- `LAST-VERIFIED.md` — tool status + signals freshness
- Plugin / marketplace version **3.3.0**
- `SKILL.md` — points at PROOF, demo, swipe docs (gates unchanged)

### Preserved
- Dual-path connected vs handoff
- Claim ledger, sheets, render plans, mechanical lint, self-critique
- Pattern DB + retrieve aliases
- Dual-track default; never invent proof

## 3.2.0 — 2026-10-10

Multi-model audit consensus (Fable 5.1, Opus 5.5, GPT-5.6, Grok 4.7, Sonnet 5.5): make gates mechanical and generation MCP-correct.

### Added
- `scripts/lint-package.mjs` — mechanical ship gate (`lint-pass`)
- `references/creative-stack/render-plan.md` — clip units + real MCP roles
- `references/creative-stack/connected-run-protocol.md` — preflight→receipt state machine
- `references/claim-firewall.json` — provenance tags + niche bans + slop lexicon
- `references/brief-defaults.json` — thin-brief defaults + asset ladder S0–S3
- `references/policy-precheck.json` — SAC / restricted vertical flags
- Output template: Claim ledger, Render plan, Render log, revision protocol
- Rubric caps + evidence requirement for score 5s

### Changed
- `retrieve.mjs`: niche aliases/synonyms, recommended_pattern boost, platform aliases, no silent alphabetical fallback, picks.routes, swipe hints only when niche matches
- `pattern-to-pipeline.json`: all **47** patterns routed
- Seedance contract + Higgsfield playbook: remove invented API roles; multi-clip; cost/draft/receipt
- Product/character sheets: provenance tags + identity modes + ref quality bar
- `examples/beauty-dtc-dual-track.md`: full-depth gold fixture (lint-clean)
- Other examples: marked **shape-only** (not quality targets)
- SKILL / pipeline / harness / first-time-right aligned to lint + render plan
- Plugin version **3.2.0**

### Preserved
- Dual-path connected vs handoff; dual-track default; never invent proof; pattern DB structure

### Publish fix (same day)
- `lint-package.mjs`: fix timecode allowlist regex that crashed on some packages (`i.test is not a function`)

## 3.1.0 — 2026-10-10

First-shot reliability upgrade (anti-slop / anti-redo).

### Added
- Product/character sheet templates + LAST-VERIFIED.md
- swipe-signals.json
- Self-critique & variants + hard gates
- Gold example set (later deepened/demoted in 3.2)
- Platform AI disclosure & rights

### Preserved
- Retrieve + patterns; dual-path; dual-track; no invented proof
