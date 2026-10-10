# Intentional FAIL — full-duration claim with no audio path

## Ad package

### Brief
- Brand / offer: Deskline AI — after-hours front-desk voice agent
- Niche: local-services
- Platforms: meta
- Tool access: connected
- Assumptions: US English; one CTA = Book a demo

### Retrieval
- Primary pattern id: `local-service-trust`
- Challenger pattern id: `pas-pain-stack`
- Study id: `study_voice_agent_missed_call`
- Study provenance: observed:false · basis:synthesis — STRUCTURE_ONLY (emulate timing/shots; not proof metrics)
- Attention model id (primary): `am_voice_agent_missed`
- Niche pack: local-services
- Pipeline route: connected
- Retrieve warnings: none
- LAST-VERIFIED: creative-stack 2026-10-10

### Job-to-be-done (one sentence)
Make the after-hours missed-call feel expensive, show Deskline answering, then book a demo.

### Concept (chosen)
- Options: (1) robot face (2) empty clinic ring → calm UI (3) fake chart
- **Chosen:** Missed ring → Answered chip → book demo
- Not the default because: no deepfake receptionist; no invented call volume

### Consistency systems (required)
- Identity mode: ui
- Provenance of sheet fields: ASSUMED

#### Product sheet — Deskline
- Official name: Deskline AI [ASSUMED]
- SKU / UI lock: mint Answered chip [ASSUMED]
- Mechanism: answers missed calls [ASSUMED]
- Refs order: 1 idle · 2 answer · 3 book
- Forbidden morphs: neon hologram
- Banned claims: guaranteed ROI

### Creative stack / production truth
- Connected Kling + CapCut

### Hooks
1. Phone rings into void — then the agent answers

### Timed script
| t | Visual | VO / on-screen text (exact words) | Audio |
| --- | --- | --- | --- |
| 0–3s | Desk phone ringing | "After hours. No answer." | Ring |
| 3–8s | Missed banner | "Every hour. Nights and overflow." | Ring fade |
| 8–14s | Flat UI Answered chip | "Deskline picked up." | Soft UI |
| 14–18s | Calendar confirm | "Tuesday 3:00 is set." | Click |
| 18–21s | Owner glance | "You review later." | Soft bed |
| 21–24s | Endcard | "Book a demo." | Bed |

### Claim & asset ledger (required)
| Claim / asset | Tag | Notes |
| --- | --- | --- |
| Product name | ASSUMED | fixture |
| Booking lift | PLACEHOLDER | never invent |

### Craft system
- Palette: `#4A6FA5` `#E8EEF4` `#C45C5C`
- Typography: Inter Tight Bold hook · UI labels post · CTA Book a demo
- Motion grammar: U1→U2→E1 hard cuts
- Sound plan: silent — no VO/SFX/bed
- Endcard module E1: logo · Book a demo · 9:16 + 1:1
- Aspect matrix: 9:16 Meta + 1:1 LinkedIn
- Finish handoff: captions only, audio not added

### Render plan
| unit_id | beats | seconds | model / tool | acceptance |
| --- | --- | --- | --- | --- |
| U1 | 0–8s | 8 | kling3_0_turbo | ring |
| U2 | 8–18s | 10 | screen_record | UI |
| E1 | 18–24s | 6 | capcut_endcard | CTA |

### Render log
| job_id | unit_id | status | vs_sheet | action |
| --- | --- | --- | --- | --- |
| a50b03aa | U1 | done | ok | 8s plate |
| b61c14bb | U2 | done | ok | screen record |
| c72d25cc | E1 | done | ok | endcard still |

```text
FINISH-THE-CUT
- Timed duration: 24s
- Units planned: U1, U2, E1
- Units rendered this session: U1 a50b03aa · U2 b61c14bb · E1 c72d25cc
- Units generated as stills (awaiting i2v/assemble): none
- Audio laid in post: none — silent export
- Post assemble: captions only; no VO/SFX/bed
- Blocked only if: n/a
- User assets requested?: no
```

- Render status: RENDERED

### Caption track
```srt
1
00:00:00,000 --> 00:00:03,000
After hours. No answer.

2
00:00:08,000 --> 00:00:14,000
Deskline picks up

3
00:00:21,000 --> 00:00:24,000
Book a demo
```

### Paid social copy
- Primary text: After-hours callers shouldn’t hit a dead line. Book a demo.
- Headline: After-hours front desk

### CTA
- Primary: Book a demo

### AI disclosure & rights
- Synthetic talent/voice/footage?: plates yes; voice none
- Audio rights path: silent cut — incomplete
- Claims used: ledger only

### Self-critique & variants (mandatory)
#### Rubric scores (1–5)
| Dimension | Score | Evidence (timecode/line) |
| --- | --- | --- |
| thumbstop | 4 | 0–3s overlay |
| clarity | 4 | UI 8–14s |
| native_fit | 3 | silent export |
| desire_or_proof | 3 | PLACEHOLDER |
| cta_hygiene | 4 | one CTA |
| production_truth | 1 | no sound |
| consistency_lock | 4 | UI sheet |

#### Likely failure modes
1. fm_silent_cut — model export shipped without audio
2. fm_muted_fail — ring story needs SFX/VO

#### Variants that attack those failures
| Variant | Changes (ONE variable) | Failure it fixes | Tool action |
| --- | --- | --- | --- |
| A | Lay ring SFX + VO + bed | Silent cut | CapCut A1–A3 |
| B | Honest NOT_RENDERED until audio | Fake done | Relabel |
| C | Diegetic clicks on UI only | Thin audio | CapCut SFX |

### First-time-right QA
- lint-package.mjs: expect FAIL (silent-cut-incomplete)
- Checklist gates: must not PASS while silent
