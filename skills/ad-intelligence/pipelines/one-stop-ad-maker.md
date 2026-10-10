# One-stop perfect ad maker — master pipeline

Default path for **any company / any niche**. Goal: **first-shot production packages**.

```
BRIEF → RETRIEVE → ASSET LADDER / SHEETS → LEDGER → RENDER PLAN → GENERATE/HANDOFF
→ FINISH → SELF-CRITIQUE → LINT/QA → DISTRIBUTE → SCALE → REVISE (minimal lever)
```

## 1) Brief (≤3 blocking questions)

| Field | Source |
| --- | --- |
| Company / product | user |
| Niche | user or resolve alias |
| Goal / platforms / offer | user or `brief-defaults.json` |
| Proof on hand | user — never invent |
| Asset ladder | S0 text / S1 URL / S2 photos / S3 footage+talent |
| Dual-track? | default YES for serious brands |
| Tool access | connected MCP / handoff / live |

List **Assumptions**. Ask only for offer, product refs, regulated claims if missing.

## 2) Retrieve

```bash
node scripts/retrieve.mjs --niche <niche|alias> --platform <platform> --limit 5
```

Heed `resolved`, `warnings`, `picks.routes`. If `match_quality: none`, do not fake a pattern — clarify niche.

Also: swipe-signals (only when niche matched), style catalog, mistakes, platform-specs, claim-firewall, policy-precheck.

## 3) Creative stack

`pattern-to-pipeline.json` (all 47 routed). Check `LAST-VERIFIED.md`. Probe models if connected.

| Track | Stack |
| --- | --- |
| High-production | Sheets → stills → Seedance units → CapCut |
| Viral / UGC | Sheets → UGC / creator → CapCut |
| Static | Ads Studio / photoshoot / Canva |
| Scale | Ad Multiplier (one variable) |

## 4) Consistency + asset ladder — hard gate

- [ ] Product sheet inlined (mode pack/ui/place/multi-sku) with tags  
- [ ] Character sheet if talent  
- [ ] **S0: no product pixels** — product-less units or REQUEST refs  
- [ ] S1 connected: fetch URL → photoshoot → then video  
- [ ] Claim & asset ledger started  
- [ ] Disclosure plan if AI talent (no fake personal endorsements)

## 5) Render plan → generate

Emit timed script + **Render plan** (`render-plan.md`):

1. Hook units (5–8s) ×3 drafts when connected  
2. Body/CTA units (split ≤ model max)  
3. Static twin  
4. Cinema twin if dual-track (same locks; separate aspect generates)

Connected → `connected-run-protocol.md`. Handoff → paste-ready prompts + mcp_params placeholders.

## 6) Finish

Captions/SRT, one CTA, safe margins, paid-safe audio, aspects.

## 7) Self-critique & variants

Score with evidence + caps → 2–3 failures → A/B/C (one variable).

## 8) Lint / QA

```bash
node scripts/lint-package.mjs <package.md>
```

`first-time-right.json` — lint-pass overrides self-scores.  
Render-acceptance: job ids or explicit NOT_RENDERED.

## 9) Distribute

Platform-specs + policy-precheck + disclosure.  
Naming: `brand_pattern_posture_aspect_unit_variant`

## 10) Scale

Ad Multiplier / Spark — preserve locks.

## 11) Revise (kill redo loops)

Classify → edit one unit_id / add ref / recut — sheets immutable unless new user assets. Bump package version; re-lint.

## Agent self-check before “done”

- [ ] Pattern ids + retrieve warnings handled  
- [ ] Sheets + ledger + render plan  
- [ ] Dual-track if serious brand  
- [ ] No invented proof  
- [ ] Lint exit 0  
- [ ] NOT_RENDERED or receipt  
- [ ] Self-critique + variants  
