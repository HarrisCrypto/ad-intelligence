# Creative-stack — last verified / mini-changelog

Keep Seedance / Higgsfield / peer notes from going stale. Update this file when models, workflows, or prompt contracts change.

## Last verified

| Item | Status | Verified |
| --- | --- | --- |
| Seedance 2.5 omni_reference + region/timestamp edit | Primary cinema/ad route | 2026-10-10 |
| Seedance 2.0 multi-ref product lock | Fallback / multi-SKU | 2026-10-10 |
| Higgsfield MCP workflows (ads-studio, ugc-video, ad-multiplier, marketing-studio, product-photoshoot, katana) | Prefer call-when-connected | 2026-10-10 |
| Product sheet + character / Soul-ID templates | Mandatory consistency pre-gen | 2026-10-10 |
| CapCut finishing (captions, endcard, aspects) | Always after gen | 2026-10-10 |

## Changelog

### 2026-10-10 — consistency + freshness pass

- Added `product-sheet-template.md` and `character-sheet-template.md`.
- Expanded Seedance prompt contract with product-sheet / Soul-ID / style-lock language.
- Expanded Higgsfield playbook with consistency locks and sheet → `product_ids` / `avatar_ids` mapping.
- Agents must produce or request sheets before generation (see one-stop pipeline asset kit).

### How to refresh

1. Re-check Seedance model ids in Higgsfield `models_explore` and BytePlus/CapCut docs.
2. Re-check Higgsfield workflow names via `get_workflow_instructions`.
3. Bump **Last verified** dates above; add a dated changelog entry.
4. Do not invent new model capabilities — if unsure, say “verify in tool UI” in handoff briefs.
