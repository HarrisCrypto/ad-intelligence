# Connected generator runtime (Higgsfield MCP)

Use when tools are actually available. **Do not pass the Seedance handoff YAML as tool args** — map it through this protocol.

## State machine

```
PREFLIGHT → UPLOAD → INVOKE (cost) → WAIT → FRAME AUDIT → REPAIR? → RECEIPT → ASSEMBLE
```

### 1) Preflight
1. `models_explore(action:'get', model:<id>)` — trust returned duration/roles/defaults over stale docs.
2. `get_workflow_instructions` for the named workflow when using Ads Studio / UGC / Ad Multiplier / etc.
3. Confirm spend cap with user if >3 generates or any non-draft final.
4. Build **Render plan** units (`render-plan.md`).

### 2) Upload sheets
- Readable local files → `media_upload` → PUT bytes → `media_confirm`
- Public URLs → `media_import_url`
- Store `media_id`s; map to `start_image` / `end_image` / `image_references` in fixed order

### 3) Invoke
- Custom Seedance/Kling/etc. → `generate_video` with integer `duration`, explicit `aspect_ratio` (never rely on 16:9 defaults)
- Static → `ads_studio_quote` then `ads_studio_generate`
- Marketing Studio product/UGC defaults → `show_marketing_studio_v2` / studio tools — **not** a substitute for Seedance cinema
- Always `get_cost:true` on first call for that param shape
- Prefer `draft:true` for hook tests; finalize winner with `draft_job_id` when supported
- A/B/C = **separate** requests (one variable each), not `count` spam

### 4) Wait
- `jobs_wait` in ≤15s loops; never duplicate submit on timeout
- Capture job ids in the package **Render log**

### 5) Frame audit (required before “rendered”)
Extract/compare at t≈0, hook end, mid, CTA:
- Product vs hero+label refs
- Talent vs face ref
- No melted type / wrong SKU
- Aspect + duration match plan
- Captions planned inside safe zones

Fail → reject codes in `render-plan.md` → repair that `unit_id` only (≤2 retries).

### 6) Receipt (must log)

| job_id | model | unit_id | status | credits | vs_sheet | action |
| --- | --- | --- | --- | --- | --- | --- |
| … | seedance_2_5 | U1 | completed | … | PASS/FAIL | keep / edit / drop |

**“Rendered” may only be claimed with completed job ids.** Handoff-only packages mark `NOT_RENDERED`.

### 7) Optional
- `virality_predictor` on assembled hooks — report as tool output, **never** as a performance claim.

## Fallbacks
| Failure | Action |
| --- | --- |
| Auth / MCP missing | Switch to handoff; same Render plan paste text |
| Quota / cost refuse | Stop; show quote; do not invent completion |
| Model clamp | Shorten unit; split plan; note clamp in receipt |
| `use_unlim` prompt | Ask user; never guess |

See `LAST-VERIFIED.md` and re-probe models at runtime.
