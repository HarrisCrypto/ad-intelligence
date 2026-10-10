# Known failure modes

Seeded from the Oply teardown (plan §0 + PART B). Every future bad output should add a row + a regression fixture + the QA rule that catches it.

## Render defects

| ID | Defect | Mechanical cause | Catch with |
| --- | --- | --- | --- |
| `fm_frame0_empty_pill` | Frame 0 empty black caption pill | Zero-alpha fill flattened to opaque black on RGB convert | Frame-0 artifact QA |
| `fm_duplicate_text` | Same words as headline + caption | Both layers written from same script line | Caption ≠ headline QA |
| `fm_contrast_fail` | Light-gray text on light-gray bubble | No contrast check on UI kit | Contrast ≥ 4.5:1 QA |
| `fm_stall` | Static scene ≥ ~5 s / static mascot ~9 s | No motion energy gate | Stall / frame-diff QA |
| `fm_slow_pacing` | ~6 scenes of 3–4 s, fades only, 0 hard cuts | “≥6 beats” rewards slow rows | Cut-rate / pacing curve QA |
| `fm_soft_encode` | 720×1280 @ ~0.7–0.8 Mbps | No resolution/bitrate gate | Res ≥ 1080×1920, bitrate floor |
| `fm_quiet_audio` | Mean ~−30 dB, silence gaps up to ~3 s | No loudness/silence gate | LUFS + silence map QA |
| `fm_no_product_demo` | Voice product never shows/plays a call | No “demo the product” rule | Product-demo QA |
| `fm_cta_jargon` | “Access call”, tiny number, 7pt fine print | No CTA clarity/size rules | CTA size / jargon / safe-zone QA |
| `fm_safe_zone` | Text under platform UI chrome | No safe-zone check | Platform safe-zone QA |
| `fm_font_mismatch` | Spec Anton → render Liberation | Fonts named but not provisioned | Declared-vs-rendered font QA |
| `fm_search_text_as_video` | Static observation projected as timed beats | Format/timing_observable dropped in projection | Format survival gates |
| `fm_hook_only_done` | 8 s silent hook declared finished | Finish gate trusts `NOT_RENDERED` header over receipts | Evidence-derived finish + contradict-log |
| `fm_sine_bed` | “Music bed” is inaudible sine | Any audio presence passes | Bed must be licensed asset id |
| `fm_aspect_crop` | 720 master cropped to 1:1 / 4:5 | Multi-aspect not re-rendered | Aspect fidelity QA |
| `fm_mystery_credits` | Unexplained credit spend | Shared account / no reconcile | Cost receipt per job |

## Process defects

| ID | Defect | Rule |
| --- | --- | --- |
| `fm_stale_git_claim` | Shallow/local fetch → false “not on main” | Verify remote via API / `git fetch` of authoritative ref before claiming |
| `fm_display_artifact` | Tool redaction (`***`, `...`) read as a real defect | Verify at byte/codepoint (`repr`) before reporting |
| `fm_shape_claims_fp` | Lint failed correct `structure only` + PASS | False-positive corpus; scope shape-claims to fixture markers (fixed v3.19) |
| `fm_dangling_pointer` | `gold_fixture` not surfaced by retrieve | Pointers must resolve or the corpus entry is a bug |
| `fm_design_not_source` | Invented palette/mascot while live brand existed | Brand harvest gate (Phase 2.5) before craft |
| `fm_mascot_wrong_category` | Real mascot reads as kids’ app on cold DR | Suitability judgement; demote playful brand to endcard when needed |

## Regression mapping

| Fixture (planned) | Expected fails |
| --- | --- |
| `regression/fail/oply-v1/` | resolution, bitrate, loudness, silence, cut-rate, frame-0, duplicate text, contrast, product demo, CTA, safe zones, font mismatch |
| `regression/false-positive/` | packages that correctly use sanctioned vocabulary (`structure only`) and must **PASS** shape-claims |

When Phase 5 QA lands, each row above must map to a hard-fail check id.
