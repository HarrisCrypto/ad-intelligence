# One-stop perfect ad maker — master pipeline

This is the default end-to-end path for **any company / any niche**.

```
BRIEF → RETRIEVE PATTERN → PICK STACK → ASSETS → GENERATE → FINISH → QA → DISTRIBUTE → SCALE
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

Pick: **primary pattern + challenger + dual-track twin**.

## 3) Pick creative stack

Use `references/creative-stack/pattern-to-pipeline.json`.

**Quality default for “make it Seedance/Higgsfield-level”:**

| Track | Stack |
| --- | --- |
| High-production | Product stills → **Seedance 2.5 omni_reference** (or Higgsfield generate_video seedance_*) → CapCut captions → aspect exports |
| Viral / UGC | Higgsfield `ugc-video` **or** creator brief → CapCut → Spark/Meta |
| Static | Higgsfield Ads Studio / product-photoshoot / Canva |
| Scale winner | Higgsfield **Ad Multiplier** (edit/recreate) |

If tools **not connected**: still emit Seedance prompt contract + Higgsfield execution brief + CapCut finishing checklist.

## 4) Asset kit (before generate)

Minimum:

- [ ] Product hero still (true color)
- [ ] Detail / in-hand still
- [ ] Logo (SVG/PNG) for endcard only
- [ ] 1–2 real proof items or `[PLACEHOLDER]`
- [ ] Brand palette + forbidden claims

Optional: talent ref, packaging, UI screenshots, competitor swipe notes (private).

## 5) Generate

Emit timed script + **Seedance settings/prompt** + optional UGC script + static cards.

Generation order:

1. Hook tests (5–8s) ×3  
2. Full spot (15–30s) winner path  
3. Static/carousel twin  
4. Cinema twin if dual-track  

## 6) Finish

- Captions burned  
- One CTA  
- Safe margins  
- Original/licensed audio for paid  
- Vertical + required placements  

## 7) QA (mandatory)

`checklists/first-time-right.json` + `references/mistakes-library.json`  
Tool-specific: Seedance quality bar in seedance-prompt-contract.md  

## 8) Distribute

Meta / TikTok / YouTube checklists from platform-specs.json  
Naming: `brand_pattern_posture_aspect_variant`  

## 9) Scale

- Whitelist/Spark winners  
- Ad Multiplier for cast/market/product swaps  
- Weekly trend ops from viral OS  

## Agent self-check before saying “done”

- [ ] Pattern ids cited  
- [ ] Tool stack named (Seedance / Higgsfield / etc.)  
- [ ] Copy-paste prompts included  
- [ ] Dual-track if quality+viral requested  
- [ ] No invented proof  
- [ ] Output template filled  
- [ ] QA passed  
