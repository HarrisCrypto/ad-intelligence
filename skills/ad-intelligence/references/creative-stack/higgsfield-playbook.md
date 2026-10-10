# Higgsfield playbook (when MCP connected OR as handoff)

Higgsfield is a full creative platform. If the **Higgsfield MCP** is available in the agent session, **call it**. If not, emit the same workflow steps as a handoff the user can run in the Higgsfield app.

**Consistency prerequisite:** complete `product-sheet-template.md` and (if talent) `character-sheet-template.md` before calling generate tools. Map sheet roles → `product_ids` / `avatar_ids` / media uploads.

## Always start here

1. `get_workflow_instructions` with **no args** if unsure which workflow.
2. For a named job, load the matching workflow skill **before** generating.
3. For raw model choice: `models_explore(action:'recommend', query:…, type:'video'|'image')`.
4. Confirm product sheet + character sheet (or request missing refs) before generate.

## Route by ad job

| User wants | Workflow / tools | Notes |
| --- | --- | --- |
| Static Meta/IG ads + copy | `ads-studio` → `ads_studio_*` | Brand from URL or prompt; lock pack from product sheet |
| UGC creator / unboxing / try-on / tutorial | `ugc-video` | Soul-ID / avatar from character sheet |
| Multiply / localize an existing 4–30s ad | `ad-multiplier` | Edit vs Recreate; keep product + style lock |
| Packshots / lifestyle stills / carousel | `product-photoshoot` | Feed multi-angle refs into video |
| TikTok/Reels one-click product video | Marketing Studio (`marketing_studio_video` + presets/hooks/settings) | Don’t default mode blindly |
| Cinema / Seedance-quality custom spot | `models_explore` → `seedance_2_5` / `seedance_2_0` via `generate_video` | Use seedance prompt contract + sheets |
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

Always pass product sheet lock + (if talent) Soul-ID lock in the prompt body.

## Ad Multiplier (scale winners)

- Source must be **4–30 seconds**
- **Edit mode:** swap people/products/objects; keep motion/timing — new cast needs a new character sheet
- **Recreate mode:** new footage, same structure (market/language/cast/product)
- Not for: dubbing-only, idea-only referencing, sources outside duration
- Preserve style lock (grade/lens family) unless the variant hypothesis requires a change

## Marketing Studio hooks/settings

- Supported presets include UGC, Tutorial, Unboxing, Product Review, Virtual Try On
- `hook_id` / `setting_id` compose building blocks
- `ad_reference_id` recreates scenario — **mutually exclusive** with hook/setting
- Always pass `avatar_ids` / `product_ids` explicitly when needed (map from character/product sheets)

## Consistency block (required in every brief)

```markdown
### Consistency locks
- Product sheet: [filled / requested gaps]
- Character sheet / Soul-ID: [filled / N/A]
- Style lock: grade […] · lens […] · motion […]
- Refs uploaded: product_hero, product_detail, [face_front…]
```

## Handoff block (no MCP)

```markdown
### Higgsfield execution brief
- Workflow: [ads-studio | ugc-video | ad-multiplier | product-photoshoot | marketing-studio | seedance generate_video | …]
- Inputs to upload: [product sheet stills, character sheet stills, logo, script, reference ad]
- Product sheet lock: (paste lock language)
- Character / Soul-ID lock: (paste or N/A)
- Style lock: grade / lens / motion
- Preset / model: […]
- Aspect: 9:16 (+ 16:9 if hero)
- Duration: […]
- Prompt / script: (paste)
- Variants to generate: A/B/C (from self-critique section)
- After: export → CapCut captions → Meta/TikTok upload checklist + AI disclosure if required
```
