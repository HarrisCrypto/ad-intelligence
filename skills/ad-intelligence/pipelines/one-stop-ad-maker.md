# One-stop perfect ad maker — master pipeline

Default path for **any company / any niche**. Goal: **first-shot production packages**.

```
BRIEF → RETRIEVE → ASSET LADDER / SHEETS → LEDGER → CRAFT SYSTEM
→ RENDER PLAN → CONNECTED / HANDOFF / ASSEMBLER → FINISH (custom template)
→ SELF-CRITIQUE → LINT + RENDER-QA → DISTRIBUTE → SCALE → REVISE (minimal lever)
```

**Craft bar:** before prompts, lock `elite-creative-os.md` (palette, type, motion,
sound, endcard). Finish like `production-finish-spec.md`. No Seedance/Higgsfield
still means **agency-looking** packages via assembler + alternative routing.

## 1) Brief (≤3 blocking questions)

| Field | Source |
| --- | --- |
| Company / product | user |
| Niche | user or resolve alias |
| Goal / platforms / offer | user or `brief-defaults.json` |
| Proof on hand | user — never invent |
| Asset ladder | S0 text / S1 URL / S2 photos / S3 footage+talent |
| Dual-track? | default YES for serious brands |
| Tool access | connected MCP / handoff / **assembler** / live |

List **Assumptions**. Ask only for offer, product refs, regulated claims if missing.

### Pipeline rung (pick one)

Index: [`../references/creative-stack/README.md`](../references/creative-stack/README.md)

| Rung | When | Follow |
| --- | --- | --- |
| Connected | Seedance / Higgsfield / peer MCP in session | `connected-run-protocol.md` — **call tools** |
| Handoff | Those tools exist for the user but not in-session | Seedance contract + Higgsfield briefs (unchanged) |
| **Assembler** | No Seedance/Higgsfield — keyframes + short clips + CapCut | [`assembler-pipeline.md`](../references/creative-stack/assembler-pipeline.md) |

On the assembler rung, pick video tools via [`alternative-model-routing.md`](../references/creative-stack/alternative-model-routing.md): **Wan → LTX → Grok → Hunyuan/Cog/SkyReels → Kling/Hailuo/Luma/Pika/Runway/Veo-Sora → stills+CapCut**. Never invent Seedance jobs.

Service-niche phone / front-desk gold: [`../examples/voice-agent-front-desk.md`](../examples/voice-agent-front-desk.md).

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
| High-production | Sheets → stills → Seedance units **or** Wan/LTX/Grok/peer clips (assembler) → CapCut |
| Viral / UGC | Sheets → UGC / creator → CapCut |
| Static | Ads Studio / photoshoot / Canva |
| Voice / front-desk | UI screen record + VO in post (assembler-friendly) |
| Scale | Ad Multiplier (one variable) when available |

## 4) Consistency + asset ladder — hard gate

- [ ] Product sheet inlined (mode pack/ui/place/multi-sku) with tags  
- [ ] Character sheet if talent / voice identity notes if VO-led  
- [ ] **S0: no product pixels** — product-less units or REQUEST refs  
- [ ] S1 connected: fetch URL → photoshoot → then video  
- [ ] Claim & asset ledger started  
- [ ] Disclosure plan if AI talent/voice (no fake personal endorsements)

## 5) Render plan → generate / handoff / assemble

Emit timed script + **Render plan** (`render-plan.md`):

1. Hook units (5–8s) ×3 drafts when connected — **or** keyframe K1 + short clip C1 on assembler  
2. Body/CTA units (split ≤ model max)  
3. Static twin  
4. Cinema twin if dual-track (same locks; separate aspect generates)

- Connected → `connected-run-protocol.md`  
- Handoff → paste-ready prompts + mcp_params placeholders  
- Assembler → `assembler-pipeline.md` + `alternative-model-routing.md` (name Wan/LTX/Grok/peer tools; never fake Seedance)

Prefer real stills / screen record / image-to-video over pure text-to-video when identity matters.  
Burn captions, endcard, logo, and legal **in post** — not inside the model.

## 6) Finish

Captions/SRT, one CTA, safe margins, paid-safe audio, aspects.

## 7) Self-critique & variants

Score with evidence + caps → 2–3 failures → A/B/C (one variable).

## 8) Lint / QA

```bash
node scripts/lint-package.mjs <package.md>
```

`first-time-right.json` — lint-pass overrides self-scores.  
**Render QA:** `checklists/render-qa.json` on exports (or emit checklist if NOT_RENDERED).  
Render-acceptance: job/export ids or explicit NOT_RENDERED — never fake PASS.

## 9) Distribute

Platform-specs + policy-precheck + disclosure.  
Naming: `brand_pattern_posture_aspect_unit_variant`

## 10) Scale

Ad Multiplier / Spark — preserve locks. Assembler: swap one variable per cut.

## 11) Revise (kill redo loops)

Classify → edit one unit_id / add ref / recut — sheets immutable unless new user assets. Bump package version; re-lint; re-run render-QA on changed exports.

## Agent self-check before “done”

- [ ] Pattern ids + retrieve warnings handled  
- [ ] Pipeline rung stated (connected / handoff / assembler)  
- [ ] Sheets + ledger + **Craft system** + render plan  
- [ ] Finish specs look like a custom CapCut/Figma template  
- [ ] Dual-track if serious brand  
- [ ] No invented proof / no fake Seedance jobs  
- [ ] Lint exit 0  
- [ ] NOT_RENDERED or receipt  
- [ ] Render-QA run or emitted  
- [ ] Self-critique + variants  
- [ ] Repo loaded (bootstrap-from-github if needed) + retrieve run  
