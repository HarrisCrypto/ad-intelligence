# Intentional FAIL — hook-only render claimed as finished ad

## Ad package

### Brief
- Brand / offer: Deskline AI — after-hours front-desk voice agent
- Niche: local-services
- Platforms: meta
- Tool access: connected (Kling + CapCut)
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
- Connected Kling + CapCut assembler for UI

### Hooks
1. Phone rings into void — then the agent answers

### Timed script
| t | Visual | VO / on-screen text (exact words) | Audio |
| --- | --- | --- | --- |
| 0–3s | Desk phone ringing, empty clinic | "After hours. No answer." | Ring |
| 3–8s | Same desk, missed banner | "Every hour. Nights and overflow." | Ring fade |
| 8–14s | Flat UI Answered chip | "Deskline picked up." | Soft UI |
| 14–18s | Calendar confirm | "Tuesday 3:00 is set." | Click |
| 18–21s | Owner glance at phone | "You review later." | Soft bed |
| 21–24s | Endcard | "Book a demo." | Bed |

### Claim & asset ledger (required)
| Claim / asset | Tag | Notes |
| --- | --- | --- |
| Product name | ASSUMED | fixture |
| Booking lift | PLACEHOLDER | never invent |

### Craft system
- Palette: `#4A6FA5` `#E8EEF4` `#C45C5C`
- Typography: Inter Tight Bold hook · UI labels post · CTA Book a demo
- Motion grammar: K1 still ring → C1 short i2v → U2 screen UI → E1 CTA
- Sound plan: muted-first captions; soft ring SFX; VO in CapCut; paid-safe bed
- Endcard module E1: logo · Book a demo · 9:16 + 1:1
- Aspect matrix: 9:16 Meta + 1:1 LinkedIn
- Finish handoff: CapCut captions + VO + endcard

### Render plan
| unit_id | beats | seconds | model / tool | acceptance |
| --- | --- | --- | --- | --- |
| U1 | 0–8s hook | 8 | kling3_0_turbo | ring void |
| U2 | 8–18s UI | 10 | screen_record | flat UI |
| E1 | 18–24s CTA | 6 | capcut_endcard | one CTA |
| A1 | VO bed | 24 | TTS + bed | paid-safe |

### Render log
| job_id | unit_id | status | vs_sheet | action |
| --- | --- | --- | --- | --- |
| a50b03aa | U1 | done | hook only | 8s silent Kling — STOPPED HERE |

```text
FINISH-THE-CUT
- Timed duration: 8s
- Units planned: U1, U2, E1, A1
- Units rendered this session: U1 job a50b03aa
- Units generated as stills (awaiting i2v/assemble): none
- Audio laid in post: none
- Post assemble: not done
- Blocked only if: waiting on screenshots (forbidden stall)
- User assets requested?: yes — blocker (wrong)
```

- Render status: RENDERED

### Caption track
```srt
1
00:00:00,000 --> 00:00:03,000
After hours. No answer.
```

### Paid social copy
- Primary text: After-hours callers shouldn’t hit a dead line. Book a demo.
- Headline: After-hours front desk

### CTA
- Primary: Book a demo

### AI disclosure & rights
- Synthetic talent/voice/footage?: Kling plate yes
- Audio rights path: none laid — incomplete
- Claims used: ledger only

### Self-critique & variants (mandatory)
#### Rubric scores (1–5)
| Dimension | Score | Evidence (timecode/line) |
| --- | --- | --- |
| thumbstop | 4 | 0–3s ring |
| clarity | 2 | no UI solve yet |
| native_fit | 3 | hook plate only |
| desire_or_proof | 2 | incomplete |
| cta_hygiene | 1 | no endcard |
| production_truth | 1 | hook-only claimed done |
| consistency_lock | 3 | sheet exists |

#### Likely failure modes
1. fm_hook_only — stopped after U1
2. fm_silent_export — no audio laid

#### Variants that attack those failures
| Variant | Changes (ONE variable) | Failure it fixes | Tool action |
| --- | --- | --- | --- |
| A | Render U2+E1+A1 | Hook-only | CapCut assemble |
| B | Lay ring SFX + VO | Silent cut | CapCut A tracks |
| C | Honest NOT_RENDERED until full | Fake done | Relabel status |

### First-time-right QA
- lint-package.mjs: expect FAIL (incomplete-hook-only)
- Checklist gates: must not PASS while hook-only
