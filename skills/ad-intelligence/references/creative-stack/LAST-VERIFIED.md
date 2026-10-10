# Creative stack — last verified

**Agent rule:** If today is >90 days after a row’s date, warn in the package. When MCP is connected, **`models_explore get` / `get_workflow_instructions` override this table.**

| Item | Last verified | verified_via | Notes |
| --- | --- | --- | --- |
| Seedance 2.5 roles | 2026-10-10 | mcp+doc | Media roles: `start_image`, `end_image`, `image_references`, `video_references`, `audio_references`. Values = media/job ids. Prefer draft then finalize. Probe duration/defaults at runtime. |
| Seedance 2.0 | 2026-10-10 | doc | Shorter max than 2.5 in many hosts (~15s) — split units; do not assume 30s. |
| Higgsfield `generate_video` | 2026-10-10 | mcp | Explicit `aspect_ratio` (MS defaults can be 16:9). `get_cost:true`. Never resubmit on timeout. |
| Ads Studio | 2026-10-10 | mcp | `ads_studio_quote` → `ads_studio_generate` |
| UGC / Marketing Studio | 2026-10-10 | mcp | Use workflow instructions; testimonials need **owned** footage — do not fabricate. |
| Ad Multiplier | 2026-10-10 | doc | Source 4–30s; one variable; not for testimonials impersonation |
| Render plan contract | 2026-10-10 | skill | `render-plan.md` + `connected-run-protocol.md` |
| Meta / TikTok / YT policy flags | 2026-10-10 | editorial | See `policy-precheck.json` — not legal advice |

**Changelog (mini):** 2026-10-10 — v3.2: removed invented `product_hero` file roles from API path; multi-clip + cost/receipt required.
