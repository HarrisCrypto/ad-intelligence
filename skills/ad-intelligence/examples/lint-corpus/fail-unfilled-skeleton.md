# Intentional FAIL — unfilled skeleton gaming

Has Craft HEX and headings but still contains [[BRACKETS]]. Must FAIL.

## Ad package
- Package version: 1
- Creative-stack last verified date checked?: yes — LAST-VERIFIED.md
- Pipeline rung: handoff
- Render status: NOT_RENDERED

### Brief
- Brand / offer: [[BRAND]]
- Niche: beauty
- Platforms: tiktok

### Retrieval
- Primary pattern id: `pov-day-in-life`

### Job-to-be-done (one sentence)
[[job]]

### Concept (chosen)
- Options: (1) smile-to-camera (2) better idea (3) alt
- **Chosen:** better idea
- Not the default because: no smile-to-camera

### Consistency systems
- Product sheet: [[bottle]]

### Claim & asset ledger
| Claim or asset | Where used | Tag | Source |
| --- | --- | --- | --- |
| pack | all | ASSUMED | [[…]] |

### Creative stack
- handoff

### Hooks
1. [[hook]]

### Timed script
| t | Visual | VO / text | Purpose | Claim tags |
| --- | --- | --- | --- | --- |
| 0–2s | face | “Hi.” | Hook | ASSUMED |
| 2–4s | bottle | “This.” | Bridge | ASSUMED |
| 4–7s | apply | “Use.” | Mech | ASSUMED |
| 7–10s | smile | “Nice.” | Payoff | ASSUMED |
| 10–14s | pack | “Shop.” | Bridge | ASSUMED |
| 14–18s | end | “Link.” | CTA | ASSUMED |

### Craft system (required)
- Style id: pov
- Palette: `#8FA89A` · `#F4F7F5` · `#C4A574`
- Grade name: clean daylight
- Typography: Anton 700 · Inter Tight 600
- Motion grammar: hold ≥1.2s → E1 3s
- Sound plan: muted-first
- Endcard module E1: logo · CTA · 3s
- Aspect matrix: 9:16 + 1:1

### Render plan
| unit_id | beats | seconds | model | start/end | refs | acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| U1 | 0–10s | 10 | seedance_2_5 | start / — | 1 | ok |

#### Unit U1 — paste-ready prompt
```text
CAMERA: phone
LIGHT: window
MOTION: push-in
GRADE: clean daylight
NEGATIVES: melted type
```

### Caption track
Hi.

### CTA
- Primary: Shop

### AI disclosure & rights
- Synthetic: no

### Self-critique & variants
#### Rubric scores
| Dimension | Score | Evidence |
| --- | --- | --- |
| thumbstop | 3 | 0–2s |
| clarity | 3 | one job |
| native_fit | 3 | tiktok |
| desire_or_proof | 2 | thin |
| cta_hygiene | 4 | one |
| production_truth | 3 | handoff |
| consistency_lock | 2 | [[sheet]] |

#### Likely failure modes
1. Unfilled brackets

#### Variants that attack those failures
| Variant | Changes | Failure it fixes | Tool action |
| --- | --- | --- | --- |
| A | fill brackets | unfilled | edit |
| B | — | — | — |
| C | — | — | — |

### First-time-right QA
- lint-package.mjs: expect FAIL (unfilled-placeholder)
