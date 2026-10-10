# Intentional FAIL — compliance language in paid copy

Craft looks specific enough; consumer-facing primary text leaks ledger language. Must FAIL.

## Ad package
- Package version: 1
- Creative-stack last verified date checked?: yes — LAST-VERIFIED.md

### Brief
- Brand: LeakCo
- Niche: beauty
- Platforms: meta

### Retrieval
- Primary pattern id: `pov-day-in-life`

### Job-to-be-done
Sell serum without inventing proof.

### Consistency systems
- Product sheet: frosted bottle

### Claim & asset ledger
| Claim or asset | Where used | Tag | Source |
| --- | --- | --- | --- |
| Reviews | proof beat | PLACEHOLDER | [PLACEHOLDER: reviews] |

### Creative stack
- handoff

### Hooks
1. POV: base that lasts the shift

### Timed script
| t | Visual | VO / text | Purpose | Claim tags |
| --- | --- | --- | --- | --- |
| 0–3s | Mirror | POV line | Hook | ASSUMED |

### Craft system (required)
- Style id: `pov_day_in_life`
- Palette: sage `#8FA89A` · frost `#F4F7F5` · gold `#C4A574`
- Grade name: clean daylight
- Typography: Bebas-style condensed + neutral sans
- Motion grammar: locked front-cam hold ≥1.2s
- Sound plan: muted-first captions
- Endcard module E1: logo SVG · one CTA · 3s
- Aspect matrix: 9:16 + 1:1 not center-crop

### Render plan
| unit_id | beats | seconds | model | start/end | refs | acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| U1 | 0–10s | 10 | seedance_2_5 | start / — | 1 | ok |

#### Unit U1 — paste-ready prompt
```text
COMMERCIAL — pov — U1
CAMERA: front phone
LIGHT: AM window
MOTION: slow push-in
GRADE: clean daylight
```

### Caption track
Makeup that lasts.

### Paid social copy
- Primary text (120): Try LeakCo serum. Reviews shown only when supplied. Specs appear only when you supply them.
- Headline: Shop

### CTA
- Primary: Shop now

### AI disclosure & rights
- Synthetic: no

### Self-critique & variants
#### Rubric scores
| Dimension | Score | Evidence |
| --- | --- | --- |
| thumbstop | 3 | 0–2s mirror |
| clarity | 3 | one job |
| native_fit | 3 | POV |
| desire_or_proof | 2 | PLACEHOLDER reviews |
| cta_hygiene | 4 | one CTA |
| production_truth | 3 | handoff |
| consistency_lock | 3 | sheet |

#### Likely failure modes
1. Copy leak into paid

#### Variants that attack those failures
| Variant | Changes | Failure it fixes | Tool action |
| --- | --- | --- | --- |
| A | strip meta from primary | copy-leak | edit copy |
| B | — | — | — |
| C | — | — | — |

### First-time-right QA
- lint-package.mjs: expect FAIL (copy-leak)
