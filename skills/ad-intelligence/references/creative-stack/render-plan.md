# Render plan (generation units — MCP-correct)

Replace vague “Seedance YAML with made-up roles” with this contract.  
Works connected (Higgsfield `generate_video`) **and** as paste-handoff.

## Rules

1. **One unit = one generation call.** Spots longer than the model max, or with >3 camera setups / product-critical beats, **split**.
2. **Conservative lengths when a face is on camera:** prefer ≤15s per unit. `seedance_2_5` may go longer; still prefer clips for lock strength.
3. **Real media roles only** (verified against Higgsfield MCP):
   - `start_image` — approved keyframe / continuity in
   - `end_image` — clean pack hero or end pose (CTA units)
   - `image_references` — ordered stills (see slot map)
   - `video_references` / `audio_references` — optional
4. **Values are media UUIDs** (`media_upload` → PUT → `media_confirm`, or `media_import_url`). Never raw URLs or local paths in `medias[].value`.
5. **Bind refs in the prompt by number:** “Image 1 = hero front; Image 2 = label; …” Same order every unit.
6. **Cost gate when connected:** `get_cost:true` before submit; prefer `draft:true` (480p) then finalize; **never resubmit after timeout** — poll existing job ids.
7. **No product pixels without product refs** (asset ladder S2+). At S0/S1 without stills: product-less units only, or photoshoot first.

## Slot map (fixed order)

| # | Role in prompt | Source |
| --- | --- | --- |
| 1 | Hero pack | product sheet |
| 2 | Label close-up | product sheet |
| 3 | ¾ / silhouette | product sheet |
| 4 | Face front (if talent) | character sheet |
| 5+ | Macro / use / place | as needed |

## Unit table (emit in every package)

| unit_id | beats | seconds | model | mode | start_image | end_image | image_references | prompt_file_or_inline | acceptance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U1 | 0–8s hook | 8 | seedance_2_5 | omni / i2v | keyframe | — | 1,2,3 | … | label ok, identity ok |
| U2 | 8–20s body | 12 | seedance_2_5 | … | U1 last frame | — | 1,2,3 | … | … |
| U3 | CTA | 6 | seedance_2_5 | … | U2 last | pack hero | 1,2 | … | endcard space |

## Handoff `mcp_params` shape (placeholders)

```json
{
  "model": "seedance_2_5",
  "prompt": "… Image 1 = hero … Image 2 = label … timed beats …",
  "duration": 12,
  "aspect_ratio": "9:16",
  "medias": [
    { "type": "image_input", "role": "start_image", "value": "<MEDIA_ID:start>" },
    { "type": "image_input", "role": "image_references", "value": "<MEDIA_ID:hero>" },
    { "type": "image_input", "role": "image_references", "value": "<MEDIA_ID:label>" }
  ],
  "get_cost": true,
  "draft": true
}
```

## Reject → repair (do not full-rewrite)

| Reject code | Meaning | Repair |
| --- | --- | --- |
| LABEL_DRIFT | Packaging/type wrong | Swap stronger label ref; shorten unit; move type to CapCut |
| IDENTITY_DRIFT | Face/product changed | Re-attach face/hero; `end_image` pack; one-variable retry |
| TEXT_MELT | On-gen typography garbage | Remove on-screen type from prompt; burn in CapCut |
| HANDS_FAIL | Extra fingers / melt | Cutaway or hands-only B-roll; regenerate that unit only |
| ASPECT_WRONG | Not requested ratio | Re-export / regenerate with explicit `aspect_ratio` |
| OVERLONG | Clamped or mushy long take | Split into ≤15s units |

Max **2 retries per unit**, then change approach and report.

## Audio path (pick exactly one speech path)

| Path | When |
| --- | --- |
| Native `generate_audio` bed + SFX | Product/cinema; no lipsync needed |
| Muted gen + ElevenLabs VO + captions | Talking-head without reliable lipsync |
| On-camera quoted dialogue only | Short lines; expect imperfection |
| Silent + caption-only | Muted-first stress test |

Never stack native speech + separate VO on the same unit.

## Assembly

CapCut/montage: U1→U2→U3 order, burned captions, one CTA endcard, paid-safe audio twin if needed.
