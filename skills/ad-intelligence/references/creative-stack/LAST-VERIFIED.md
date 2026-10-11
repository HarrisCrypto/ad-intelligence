# Creative stack — last verified / tool status

**Agent rule:** If today is >90 days after a row’s date, warn in the package. When MCP is connected, **`models_explore` / `get_workflow_instructions` override this table.**

**How to refresh:** probe connected MCP → update date + `verified_via` → note what changed in the mini-changelog below. See also CONTRIBUTING.md.

## Generators & workflows

| Item | Last verified | verified_via | Notes |
| --- | --- | --- | --- |
| Seedance 2.5 roles | 2026-10-10 | mcp+doc | Media roles: `start_image`, `end_image`, `image_references`, `video_references`, `audio_references`. Values = media/job ids. Prefer draft then finalize. Probe duration/defaults at runtime. |
| Seedance 2.0 | 2026-10-10 | doc | Shorter max than 2.5 in many hosts (~15s) — split units; do not assume 30s. |
| Higgsfield `generate_video` | 2026-10-10 | mcp | Explicit `aspect_ratio` (MS defaults can be 16:9). `get_cost:true`. Never resubmit on timeout. |
| Ads Studio | 2026-10-10 | mcp | `ads_studio_quote` → `ads_studio_generate` |
| UGC / Marketing Studio | 2026-10-10 | mcp | Use workflow instructions; testimonials need **owned** footage — do not fabricate. |
| Ad Multiplier | 2026-10-10 | doc | Source 4–30s; one variable; not for testimonials impersonation |
| CapCut finishing | 2026-10-10 | skill | Captions, endcard, safe margins, aspect exports — always after gen |
| Kling / Runway / peers | 2026-10-10 | doc | Image-to-video product moves; see `prompt-recipes.md` |
| Wan 2.2 | 2026-10-10 | public docs | Apache 2.0 open weights; T2V/I2V/TI2V; prefer I2V assembler units — see `alternative-model-routing.md` |
| LTX-2.5 | 2026-10-10 | public docs | Native A/V; Community License free under ~$10M revenue — confirm LICENSE |
| Grok Imagine video 1.5 | 2026-10-10 | xAI public docs | `grok-imagine-video-1.5` T2V/I2V; API/product handoff — never invent request ids |
| HunyuanVideo / CogVideoX / SkyReels | 2026-10-10 | public docs | Open-weight peers; confirm geo/license cards before commercial |
| Hailuo / Luma / Pika | 2026-10-10 | public product docs | Hosted peers — prompt/API handoff; name real tool |
| Render plan contract | 2026-10-10 | skill | `render-plan.md` + `connected-run-protocol.md` |
| Meta / TikTok / YT policy flags | 2026-10-10 | editorial | See `policy-precheck.json` v1.1 — not legal advice |

## Skill / signals / proof freshness

| Item | Last verified | Notes |
| --- | --- | --- |
| Product / character sheets | 2026-10-10 | Provenance tags + identity modes |
| Swipe signals public JSON | 2026-10-10 | v1.2.0 — more niches + failure modes |
| Private signals overlay | 2026-10-10 | `private-signals.example.json` → local file |
| Policy precheck | 2026-10-10 | v1.1.0 — housing/credit/health decision tree |
| Lint package gate | 2026-10-10 | Gold pass + lint-corpus must fail |
| Full-depth gold fixtures | 2026-10-11 | beauty, local, saas, physical, voice, fashion, food, real-estate, fitness |
| Visual design gallery | 2026-10-10 | `examples/visual/index.html` + 7 frames |
| Stress briefs | 2026-10-10 | `examples/stress-briefs/` messy prompts |
| Assembler pipeline | 2026-10-10 | Third rung when no single-pass video gen |
| Degradation ladder | 2026-10-11 | Rung 1 connected → Rung 2 i2v → Rung 3 motion storyboard |
| Style-selection engine | 2026-10-11 | Niche → pattern → visual → prompt; before retrieve |
| External resources | 2026-10-11 | Oct 2026 model routing + ad libraries |
| Alternative model routing | 2026-10-10 | Wan → LTX → Grok → peers → stills |
| Render QA checklist | 2026-10-10 | `checklists/render-qa.json` |
| Voice / front-desk gold | 2026-10-10 | `examples/voice-agent-front-desk.md` |

**Changelog (mini):**  
- 2026-10-10 — v3.2: removed invented `product_hero` file roles; multi-clip + cost/receipt.  
- 2026-10-10 — v3.3: adoption proof/install/contribute; private swipe overlay.  
- 2026-10-10 — v3.4: three more full-depth gold fixtures.  
- 2026-10-10 — v3.5: visual storyboard gallery; stress briefs; lint corpus demo; policy-precheck depth.  
- 2026-10-10 — v3.6: assembler path; render-QA; voice/front-desk gold fixture.  
- 2026-10-10 — v3.7: alternative-model-routing (Wan 2.2 / LTX-2.5 / Grok Imagine ladder).  
- 2026-10-10 — v3.7.1: expand routing — Hunyuan, CogVideoX, SkyReels, Hailuo, Luma, Pika.  


