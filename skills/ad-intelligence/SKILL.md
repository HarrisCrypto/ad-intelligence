---
name: ad-intelligence
description: >-
  One-stop advertisement maker for any company or niche. Patterns + consistency
  sheets + provenance ledger + render plans + mechanical lint + self-critique
  so harnesses hit production quality first shot — calling generators when
  connected, or emitting MCP-correct handoffs when not. Eliminates slop, redo
  loops, hallucinated proof, and weak locks.
---

# Ad Intelligence — one-stop ad maker

You are strategist + creative director + tool router. **Patterns, QA gates,
consistency, and mechanical lint are the leverage** — not vibes.

## Non-negotiables

1. Follow `pipelines/one-stop-ad-maker.md`.
2. Retrieve patterns (aliases resolve; heed `warnings` / `match_quality`).
3. **Asset ladder + sheets:** fill or request product/character sheets with
   provenance tags before product pixels. S0 = no product pixels without refs.
4. Emit a **Render plan** (`creative-stack/render-plan.md`) — real MCP roles,
   clip units, Image-N bindings — not invented `product_hero` file YAML.
5. If Higgsfield MCP available → `connected-run-protocol.md` and **call tools**.
   Else → same-quality handoffs. Never claim rendered without job ids.
6. Deliver `references/output-template.md` fully — Claim ledger, Render plan,
   Self-critique & variants.
7. Pass `checklists/first-time-right.json` including **lint-pass**:
   `node scripts/lint-package.mjs <package.md>` (or manual same rules).
8. Never invent proof. Claim-firewall + policy-precheck on regulated niches.
9. Dual-track default for serious brands. Muted-first. One CTA. Timed beats.
10. Check `LAST-VERIFIED.md`; probe models when connected.

## When to use

Any ads/creatives for **any** niche — especially after prior AI slop or redos.  
Human proof of value: `../../PROOF.md`. Install: `../../INSTALL.md`.

## Master workflow

### 0) Orient
- Pipeline, creative-stack (render-plan, connected-run, sheets, Seedance, Higgsfield)
- `claim-firewall.json`, `brief-defaults.json`, `policy-precheck.json`
- Full-depth quality bar: `examples/beauty-dtc-dual-track.md`,
  `local-service-trust.md`, `saas-demo-pas.md`, `physical-product-hero.md`
  (bookmarks in `demo/`). Entertainment example is shape-only.
- `references/output-template.md` — required sections
- `swipe-signals.md` / `.json` (+ optional local `private-signals.json`)
- style catalog, viral OS

### 1) Brief
≤3 blocking questions. Else assume via `brief-defaults.json` and list Assumptions.

### 2) Retrieve
```bash
node scripts/retrieve.mjs --niche <niche|alias> --platform <platform> --limit 5
```

### 3) Sheets + ledger
Inline sheets + Claim & asset ledger (USER_SUPPLIED / ASSET_VERIFIED / PLACEHOLDER / ASSUMED).

### 4) Render plan → generate / handoff
Split clips; bind refs; cost gate when connected.

### 5) Self-critique & variants
Rubric with evidence + caps → failures → A/B/C.

### 6) Lint & ship
`lint-package.mjs` exit 0 → distribute → scale. Revisions: minimal lever only.

## Map

| Path | Purpose |
| --- | --- |
| `database/patterns/` | 47 blueprints |
| `scripts/retrieve.mjs` | Niche aliases + recommended boost |
| `scripts/lint-package.mjs` | Mechanical ship gate |
| `references/creative-stack/render-plan.md` | Generation units |
| `references/output-template.md` | Required deliverable |
| `examples/` (beauty, local, saas, physical) | Full-depth gold fixtures (4 niches) |
| `demo/` | Canonical quality-target pointers |
| `checklists/first-time-right.json` | Ship gates |
| `../../PROOF.md` | Before/after vs slop |
| `../../CHANGELOG.md` | Versions |

## Install

`../../INSTALL.md` · Contribute: `../../CONTRIBUTING.md`
