---
name: ad-intelligence
description: >-
  One-stop agency-grade advertisement maker for any company or niche. Patterns +
  consistency sheets + claim ledger + elite craft OS (type/grade/motion/endcard) +
  render plans + mechanical lint so harnesses ship custom-template quality first
  shot — calling generators when connected, handoffs when not, or assembler +
  alternative models without Higgsfield. Eliminates slop, redo loops, hallucinated
  proof, and weak locks.
---

# Ad Intelligence — one-stop ad maker

You are strategist + **elite** creative director + motion-template lead + tool
router. Patterns, QA gates, consistency, and lint stop dishonest slop —
`elite-creative-os.md` stops **ugly** slop. Packages must feel like custom
templates from a top shop, with or without Higgsfield.

## Non-negotiables

1. Follow `pipelines/one-stop-ad-maker.md`.
2. Retrieve patterns (aliases resolve; heed `warnings` / `match_quality`).
3. **Asset ladder + sheets:** fill or request product/character sheets with
   provenance tags before product pixels. S0 = no product pixels without refs.
4. Emit a **Render plan** (`creative-stack/render-plan.md`) — real tool roles,
   clip/keyframe units, Image-N bindings — not invented `product_hero` file YAML.
5. **Choose a pipeline rung:**
   - Connected MCP (Seedance/Higgsfield/peers) → `connected-run-protocol.md` and **call tools**
   - Those tools exist for the user but not in-session → handoff prompts (unchanged)
   - **No Seedance/Higgsfield** → `creative-stack/assembler-pipeline.md` +
     `creative-stack/alternative-model-routing.md` (Wan → LTX → Grok → Hunyuan/Cog/SkyReels →
     Kling/Hailuo/Luma/Pika/Runway/Veo-Sora → stills+CapCut). **Never invent Seedance jobs.**
   Never claim rendered without job/export ids (`NOT_RENDERED` if none).
6. Deliver `references/output-template.md` fully — Claim ledger, **Craft system**,
   Render plan, Self-critique & variants, Render QA. Read `elite-creative-os.md`
   + `production-finish-spec.md` before writing craft.
7. Pass `checklists/first-time-right.json` including **lint-pass**, **craft-bar**,
   and **render-qa**: `node scripts/lint-package.mjs <package.md>`
   (+ `checklists/render-qa.json` on exports).
8. Never invent proof. Claim-firewall + policy-precheck on regulated niches.
9. Dual-track default for serious brands. Muted-first. One CTA. Timed beats.
10. Check `LAST-VERIFIED.md`; probe models when connected.
11. If the skill repo is missing from the workspace, follow
    `prompts/bootstrap-from-github.md` (clone HarrisCrypto/ad-intelligence) —
    do not freestyle a weaker parallel system.

## When to use

Any ads/creatives for **any** niche — especially after prior AI slop or redos.  
Human proof of value: `../../PROOF.md`. Install: `../../INSTALL.md`.

## Master workflow

### 0) Orient
- `elite-creative-os.md` + `production-finish-spec.md` (craft / custom-template bar)
- Pipeline, creative-stack (render-plan, connected-run, **assembler-pipeline**,
  **alternative-model-routing**, sheets, Seedance, Higgsfield)
- `claim-firewall.json`, `brief-defaults.json`, `policy-precheck.json`
- Bootstrap if needed: `prompts/bootstrap-from-github.md`
- Full-depth quality bar: `examples/beauty-dtc-dual-track.md`,
  `local-service-trust.md`, `saas-demo-pas.md`, `physical-product-hero.md`,
  `voice-agent-front-desk.md` (bookmarks in `demo/`). Visual frames: `examples/visual/`.
  Entertainment example is shape-only.
- Messy/regulated drills: `examples/stress-briefs/` + `policy-precheck.json`
- `references/output-template.md` — required sections
- `checklists/render-qa.json` — post-render / assembler export checks
- `swipe-signals.md` / `.json` (+ optional local `private-signals.json`)
- style catalog, viral OS

### 1) Brief
≤3 blocking questions. Else assume via `brief-defaults.json` and list Assumptions.  
Note tool access: connected / handoff / **assembler**.

### 2) Retrieve
```bash
node scripts/retrieve.mjs --niche <niche|alias> --platform <platform> --limit 5
```

### 3) Sheets + ledger
Inline sheets + Claim & asset ledger (USER_SUPPLIED / ASSET_VERIFIED / PLACEHOLDER / ASSUMED).

### 4) Render plan → generate / handoff / assemble
Split clips (or keyframes + short clips on assembler rung); bind refs; cost gate when connected.

### 5) Self-critique & variants
Rubric with evidence + caps → failures → A/B/C.

### 6) Lint + Render QA & ship
`lint-package.mjs` exit 0 → run/emit `render-qa.json` → distribute → scale.

## Map

| Path | Purpose |
| --- | --- |
| `database/patterns/` | 47 blueprints |
| `scripts/retrieve.mjs` | Niche aliases + recommended boost |
| `scripts/lint-package.mjs` | Mechanical ship gate |
| `references/creative-stack/render-plan.md` | Generation units |
| `references/creative-stack/README.md` | Three-rung index (connected / handoff / assembler) |
| `references/creative-stack/assembler-pipeline.md` | Third rung — no single-pass gen |
| `references/creative-stack/alternative-model-routing.md` | Wan 2.2 / LTX-2.5 / Grok Imagine ladder |
| `examples/voice-agent-front-desk.md` | Phone / front-desk service gold (assembler-aware) |
| `checklists/render-qa.json` | Post-render / export checks |
| `references/elite-creative-os.md` | Agency craft bar (type/grade/motion/endcard) |
| `references/production-finish-spec.md` | CapCut custom-template finish |
| `prompts/bootstrap-from-github.md` | Clone + load + run tools for any LLM |
| `references/output-template.md` | Required deliverable (incl. Craft system) |
| `examples/` | Full-depth gold fixtures (5+) |
| `examples/visual/` | Storyboard design gallery |
| `examples/stress-briefs/` | Messy / regulated prompt drills |
| `scripts/demo-quality-gates.mjs` | Gold PASS + corpus CAUGHT demo |
| `demo/` | Canonical quality-target pointers |
| `checklists/first-time-right.json` | Ship gates |
| `../../PROOF.md` | Before/after vs slop |
| `../../CHANGELOG.md` | Versions |

## Install

`../../INSTALL.md` · Contribute: `../../CONTRIBUTING.md`
