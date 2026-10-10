# One-stop perfect ad maker — master pipeline

This is the default end-to-end path for **any company / any niche**.

```
BRIEF → RETRIEVE PATTERN (+ optional swipe signals) → PICK STACK → ASSET KIT / SHEETS → GENERATE → SELF-CRITIQUE & VARIANTS → FINISH → QA → DISTRIBUTE → SCALE
```

## 1) Brief (5 minutes)

Collect or assume (state assumptions):

| Field | Example |
| --- | --- |
| Company / product | … |
| Niche | from niches/* |
| Goal | awareness / traffic / leads / purchases / app installs |
| Platforms | TikTok, Meta, YT, CTV… |
| Offer | … |
| Proof on hand | stills, reviews, footage, URL |
| Budget posture | AI-only / hybrid / live shoot |
| Dual-track? | viral + cinema (default YES for serious brands) |

## 2) Retrieve intelligence

```bash
node scripts/retrieve.mjs --niche <niche> --platform <platform> --limit 5
node scripts/retrieve.mjs --tag viral --limit 3
node scripts/retrieve.mjs --production premium_cinema --limit 3
```

Load: style catalog, viral OS, mistakes library, platform specs.

**Optional longevity pull:** read `references/swipe-signals.md` (or `swipe-signals.json`) for high-longevity hook families, formats that survive, and common failure modes by niche/format — anonymized patterns only, never scraped creatives.

Pick: **primary pattern + challenger + dual-track twin**.

## 3) Pick creative stack

Use `references/creative-stack/pattern-to-pipeline.json`.  
Check `references/creative-stack/CHANGELOG.md` for last-verified Seedance / Higgsfield notes.

**Quality default for “make it Seedance/Higgsfield-level”:**

| Track | Stack |
| --- | --- |
| High-production | Product stills → **Seedance 2.5 omni_reference** (or Higgsfield generate_video seedance_*) → CapCut captions → aspect exports |
| Viral / UGC | Higgsfield `ugc-video` **or** creator brief → CapCut → Spark/Meta |
| Static | Higgsfield Ads Studio / product-photoshoot / Canva |
| Scale winner | Higgsfield **Ad Multiplier** (edit/recreate) |

If tools **not connected**: still emit Seedance prompt contract + Higgsfield execution brief + CapCut finishing checklist.

## 4) Asset kit + consistency sheets (before generate)

**Hard gate:** do not generate until product sheet is filled **or** missing stills are explicitly requested. Character sheet required when talent/avatar appears.

Minimum assets:

- [ ] Product hero still (true color)
- [ ] Detail / in-hand / label close-up still
- [ ] Logo (SVG/PNG) for endcard only
- [ ] 1–2 real proof items or `[PLACEHOLDER]`
- [ ] Brand palette + forbidden claims

Consistency sheets (agents must produce or request):

- [ ] `references/creative-stack/product-sheet-template.md` filled (multi-angle roles)
- [ ] `references/creative-stack/character-sheet-template.md` filled if talent — else `N/A`
- [ ] Style lock stated (grade + lens + motion bias)
- [ ] Lock language ready to paste into Seedance YAML / Higgsfield brief

Optional: packaging, UI screenshots, competitor swipe notes (private — never redistribute scraped creatives).

## 5) Generate

Emit timed script + **Seedance settings/prompt** (with product/character/style locks) + optional UGC script + static cards.

Generation order:

1. Hook tests (5–8s) ×3  
2. Full spot (15–30s) winner path  
3. Static/carousel twin  
4. Cinema twin if dual-track  

## 6) Self-critique & variants (mandatory — kill redo)

After the first package draft (still inside one pass):

1. Score every rubric dimension in `checklists/first-time-right.json` (`score_rubric`).
2. List the **2–3 most likely failure modes** for this niche + platform (use swipe-signals + mistakes library).
3. Emit concrete **A / B / C variants** that directly address those failure modes (one variable each).
4. Ship only if rubric ≥4 on all dims, or list risks the user must accept.

Fill the **Self-critique & variants** section in `references/output-template.md`. This is a hard gate in the checklist.

## 7) Finish

- Captions burned  
- One CTA  
- Safe margins  
- Original/licensed audio for paid  
- Vertical + required placements  
- AI disclosure / rights block when synthetic media or licensed talent is used  

## 8) QA (mandatory)

`checklists/first-time-right.json` + `references/mistakes-library.json`  
Tool-specific: Seedance quality bar in seedance-prompt-contract.md  
Confirm consistency sheets + self-critique gates PASS.

## 9) Distribute

Meta / TikTok / YouTube checklists from platform-specs.json (native format signals, caption style, synthetic-media disclosure, rights tree).  
Naming: `brand_pattern_posture_aspect_variant`  

## 10) Scale

- Whitelist/Spark winners  
- Ad Multiplier for cast/market/product swaps (new sheets when cast/SKU changes)  
- Weekly trend ops from viral OS  

## Agent self-check before saying “done”

- [ ] Pattern ids cited  
- [ ] Tool stack named (Seedance / Higgsfield / etc.)  
- [ ] Product sheet (+ character sheet if needed) produced or requested  
- [ ] Copy-paste prompts include product / Soul-ID / style locks  
- [ ] Self-critique scored + A/B/C variants against failure modes  
- [ ] Dual-track if quality+viral requested  
- [ ] AI disclosure & rights block filled  
- [ ] No invented proof  
- [ ] Output template filled  
- [ ] QA passed  
