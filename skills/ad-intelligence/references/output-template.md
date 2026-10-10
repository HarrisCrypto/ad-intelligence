# Mandatory output template (perfect ad maker)

Copy this structure every time. Do not omit sections; use `N/A — reason` if needed.  
**Not done until:** Claim ledger filled · Render plan complete · Self-critique done · `node scripts/lint-package.mjs <file>` exits 0 (or same rules checked manually).

Use four-backtick outer fences in your reply if you nest code blocks, so Seedance/JSON stubs cannot close the template early.

````markdown
## Ad package
- Package version: 1
- Asset ladder state: S0 / S1 / S2 / S3
- Generation readiness: CONCEPT_READY / GENERATION_READY
- Connected tools?: yes / no
- Render status: NOT_RENDERED / UNVERIFIED / PASS (job ids required for PASS)

### Brief (locked or assumed)
- Brand / offer:
- Niche:
- Platforms:
- Funnel:
- Production tier:
- Virality posture:
- Proof available:
- Tool access: connected MCP / prompt-handoff only / live shoot
- Assumptions (from brief-defaults.json if any):

### Retrieval
- Primary pattern id:
- Challenger pattern id:
- Dual-track twin id:
- Flow id:
- Hook family ids:
- Trend class (if any):
- Niche pack:
- Pipeline route (from pattern-to-pipeline):
- Swipe-signal notes (only if niche matched; else "none"):
- Retrieve warnings:

### Job-to-be-done (one sentence)


### Consistency systems (required)
- Identity mode: pack / ui / place-service / multi-sku / n/a
- Product sheet: **inline filled sheet or [REQUEST FROM USER] rows** (not a 3-bullet summary)
- Character sheet: inline / n/a / requested
- Style lock / Soul-ID (1–3 lines):
- Refs to attach (ordered 1 hero, 2 label, 3 ¾, 4 face…):
- Provenance of sheet fields: USER_SUPPLIED / ASSET_VERIFIED / PLACEHOLDER / ASSUMED

### Claim & asset ledger (required)
| Claim or asset | Where used (beat/copy) | Tag | Source |
| --- | --- | --- | --- |
|  |  | USER_SUPPLIED / ASSET_VERIFIED / PLACEHOLDER / ASSUMED |  |

### Creative stack (required)
- Pipeline id / posture default:
- Primary generator:
- Supporting tools:
- Connected now?: yes → follow connected-run-protocol.md | no → handoff
- Creative-stack last verified date checked?: yes / stale warning
- Policy precheck (policy-precheck.json / claim-firewall): 

### Hooks (3–5)


### Timed script
| t | Visual | VO / text | Purpose | Claim tags |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### Shot list / visual system


### Render plan (required — see creative-stack/render-plan.md)
| unit_id | beats | seconds | model | start/end | refs | acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| U1 |  |  |  |  |  |  |

#### Unit U1 — paste-ready prompt
```text
COMMERCIAL — [pattern] — Image 1=hero, Image 2=label, Image 3=¾
PRODUCT SHEET LOCK: …
TIMELINE: …
AUDIO PATH: [native | muted+VO | dialogue | silent+captions]
NEGATIVES: melted type, wrong label, identity drift, extra fingers, watermark
```

#### Unit U1 — mcp_params (connected) or handoff JSON
```json
{
  "model": "seedance_2_5",
  "duration": 12,
  "aspect_ratio": "9:16",
  "prompt": "…",
  "medias": [],
  "get_cost": true,
  "draft": true
}
```

### Render log (connected only; else NOT_RENDERED)
| job_id | unit_id | status | vs_sheet | action |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### Caption track (muted-first) — timed lines or SRT


### Paid social copy
- Primary text (char count):
- Headline (char count):
- Description:

### Static / carousel twin (if any)


### CTA
- Primary (only one in-cut):
- Alternates (A/B matrix only — not in this cut):

### Dual-track twin
- Viral/native unit ids:
- High-production unit ids:
- Shared JTBD / claims / sheets locked?: yes
- Aspects delivered as separate generates (not center-crop): 

### Scale plan
- Ad Multiplier / Spark / whitelisting:

### AI disclosure & rights
- Synthetic talent/voice/footage?: yes/no — disclosure plan:
- Audio rights path: organic trend / original / licensed
- Face/release status:
- Policy category + prerequisites:
- Claims used (ledger only):
- Rights decision-tree outcomes:

### Landing / store / bio mirror


### Self-critique & variants (mandatory)
#### Rubric scores (1–5) — cite timecode or line for any 5; caps apply
| Dimension | Score | Evidence (timecode/line) |
| --- | --- | --- |
| thumbstop |  |  |
| clarity |  |  |
| native_fit |  |  |
| desire_or_proof |  |  |
| cta_hygiene |  |  |
| production_truth |  |  |
| consistency_lock |  |  |

Caps: any PLACEHOLDER proof → desire_or_proof ≤3; refs not attached → consistency_lock ≤2; failed render unit → production_truth ≤3.

#### Likely failure modes (2–3 for this niche/platform)
1.
2.
3.

#### Variants that attack those failures
| Variant | Changes (ONE variable) | Failure it fixes | Tool action |
| --- | --- | --- | --- |
| A |  |  |  |
| B |  |  |  |
| C |  |  |  |

### First-time-right QA
- lint-package.mjs: PASS / FAIL (paste output)
- Checklist gates: PASS / fails listed:
- Mistakes library + claim-firewall + policy-precheck: yes
- Self-critique completed: yes
````

## Revision protocol (after first package)

Classify feedback → minimal lever only:

| Class | Lever |
| --- | --- |
| Hook / pacing | Edit or replace one `unit_id` |
| Product drift | Add/replace reference still — do not only reword prompt |
| Talent drift | Re-attach face ref / regenerate that unit |
| Claim / compliance | Edit ledger + copy; sheets stay unless new user facts |
| Aspect / platform | New export or unit with explicit aspect |
| Tool failure | Receipt + retry policy in connected-run-protocol |

Bump package version; list changed unit ids; re-lint.
