# Examples

Full-depth gold fixtures (lint-clean). Service / phone niche: **`voice-agent-front-desk.md`**.  
Style map: [`../references/creative-stack/style-selection-engine.md`](../references/creative-stack/style-selection-engine.md).  
Have Higgsfield/Seedance but MCP not live? → **handoff** + [`gen-packs/home-services-hvac.md`](./gen-packs/home-services-hvac.md) (`write-gen-pack.mjs`).  
No gen tools (user declared)? → [`../references/creative-stack/degradation-ladder.md`](../references/creative-stack/degradation-ladder.md) · [`assembler-pipeline.md`](../references/creative-stack/assembler-pipeline.md) · [`../references/external-resources.md`](../references/external-resources.md).

| Path | Depth | Notes |
| --- | --- | --- |
| `gen-packs/home-services-hvac.md` | **handoff** | Paste-ready Higgsfield prompts per shot |
| `beauty-dtc-dual-track.md` | **Full-depth** | lint `"ok": true` |
| `local-service-trust.md` | **Full-depth** | lint `"ok": true` |
| `saas-demo-pas.md` | **Full-depth** | lint `"ok": true` |
| `physical-product-hero.md` | **Full-depth** | lint `"ok": true` |
| `voice-agent-front-desk.md` | **Full-depth** | lint `"ok": true` · assembler-aware phone/front-desk |
| `fashion-editorial.md` | **Full-depth** | editorial film · Wan/LTX assembler path |
| `food-appetite.md` | **Full-depth** | appetite macro · pour/steam |
| `real-estate-walkthrough.md` | **Full-depth** | cinematic walkthrough · no fake sqft |
| `fitness-performance.md` | **Full-depth** | performance sports cine · no body morph |
| `visual/` | Design frames | Open `visual/index.html` |
| `stress-briefs/` | Drill prompts | Expected traps listed |
| `lint-corpus/` | Must **fail** lint | Used by demo-quality-gates |
| `entertainment-creator-series.md` | **shape-only** | Deepen before ship |
| `viral-plus-cinema-brief.json` | shape stub | n/a |

```bash
node ../scripts/demo-quality-gates.mjs
```

No Seedance/Higgsfield? See `../references/creative-stack/assembler-pipeline.md`.  
Post-export checks: `../checklists/render-qa.json`.
