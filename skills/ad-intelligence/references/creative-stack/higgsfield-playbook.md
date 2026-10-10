# Higgsfield playbook (when MCP connected OR as handoff)

Higgsfield is a full creative platform. If the **Higgsfield MCP** is available in the agent session, **call it**. If not, emit the same workflow steps as a handoff the user can run in the Higgsfield app.

## Always start here

1. `get_workflow_instructions` with **no args** if unsure which workflow.
2. For a named job, load the matching workflow skill **before** generating.
3. For raw model choice: `models_explore(action:'recommend', query:…, type:'video'|'image')`.

## Route by ad job

| User wants | Workflow / tools | Notes |
| --- | --- | --- |
| Static Meta/IG ads + copy | `ads-studio` → `ads_studio_*` | Brand from URL or prompt |
| UGC creator / unboxing / try-on / tutorial | `ugc-video` | Pick one format |
| Multiply / localize an existing 4–30s ad | `ad-multiplier` | Edit vs Recreate modes |
| Packshots / lifestyle stills / carousel | `product-photoshoot` | Then feed into video |
| TikTok/Reels one-click product video | Marketing Studio (`marketing_studio_video` + presets/hooks/settings) | Don’t default mode blindly |
| Cinema / Seedance-quality custom spot | `models_explore` → `seedance_2_5` / `seedance_2_0` via `generate_video` | Use seedance prompt contract |
| Remix like a reference edit | `katana` | Needs brief; attachments authorize inspection first |
| Logo / kit / mockups | `brand-asset-creation` | Preserve official assets |
| Thumbnails / covers | `thumbnail-generation` | Owns the pipeline |
| Faceless narrated explainer | `faceless-video` | Not product UGC |
| Captions / assemble clips | `video-montage` | |
| Motion graphics edit | `video-editing` | |

## Seedance inside Higgsfield

Prefer model ids:

- `seedance_2_5` — longer spots, omni_reference, edit/extend
- `seedance_2_0` — strong reference lock, multi-SKU, optional 4k/unlim flags when available

Peers for exploration: `grok_video_v15`, `gemini_omni_flash_1_1`, `minimax_h3_max`, `marketing_studio_video`, `ad_multiplier_v2`.

## Ad Multiplier (scale winners)

- Source must be **4–30 seconds**
- **Edit mode:** swap people/products/objects; keep motion/timing
- **Recreate mode:** new footage, same structure (market/language/cast/product)
- Not for: dubbing-only, idea-only referencing, sources outside duration

## Marketing Studio hooks/settings

- Supported presets include UGC, Tutorial, Unboxing, Product Review, Virtual Try On
- `hook_id` / `setting_id` compose building blocks
- `ad_reference_id` recreates scenario — **mutually exclusive** with hook/setting
- Always pass `avatar_ids` / `product_ids` explicitly when needed

## Handoff block (no MCP)

```markdown
### Higgsfield execution brief
- Workflow: [ads-studio | ugc-video | ad-multiplier | product-photoshoot | marketing-studio | seedance generate_video | …]
- Inputs to upload: [product stills, logo, script, reference ad]
- Preset / model: […]
- Aspect: 9:16 (+ 16:9 if hero)
- Duration: […]
- Prompt / script: (paste)
- Variants to generate: A/B/C
- After: export → CapCut captions → Meta/TikTok upload checklist
```
