# Creative stack — last verified / tool status

**Agent rule:** If today is >90 days after a row’s date, warn in the package. When MCP is connected, **`models_explore` / `get_workflow_instructions` override this table.**

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
| Render plan contract | 2026-10-10 | skill | `render-plan.md` + `connected-run-protocol.md` |
| Meta / TikTok / YT policy flags | 2026-10-10 | editorial | See `policy-precheck.json` — not legal advice |

## Skill / signals freshness

| Item | Last verified | Notes |
| --- | --- | --- |
| Product / character sheets | 2026-10-10 | Provenance tags + identity modes |
| Swipe signals public JSON | 2026-10-10 | v1.1.0 — formats + niches + `failure_mode_index` |
| Private signals overlay | 2026-10-10 | `private-signals.example.json` → local `private-signals.json` |
| Lint package gate | 2026-10-10 | Beauty gold must stay `"ok": true` |
| Proof / demo adoption layer | 2026-10-10 | `PROOF.md` + `demo/` |
| Full-depth gold fixtures (4 niches) | 2026-10-10 | beauty, local, saas, physical — all lint-clean |

**Changelog (mini):**  
- 2026-10-10 — v3.2: removed invented `product_hero` file roles; multi-clip + cost/receipt.  
- 2026-10-10 — v3.3: adoption proof/install/contribute; swipe-signals.md + private overlay; tool-status table in README.  
- 2026-10-10 — v3.4: three more full-depth gold fixtures; multi-niche quality bar.
