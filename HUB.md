# Ad Classroom + Production Hub — status

**Source of truth:** `main`. All work lands here.

| Gate | Deliverable | Status |
| --- | --- | --- |
| **0–6 + E2E** | Classroom + QA + specs + critic | ✅ On main ([PR #21](https://github.com/HarrisCrypto/ad-intelligence/pull/21)) |
| **2.6 / 3.5** | Asset library + realism layer | ⏳ In progress — audio seeded; **footage gap is the ceiling** |

## The real gap (named)

Top FB/TikTok DR ads are **photographed moments**. Our path still produces **designed cards on a void**. Studying more ads will not fix that — the unlock is materials.

| Library | Job | Status |
| --- | --- | --- |
| **A. Study corpus** | Knowing + shot recipes | 16 cards; recipes on key home-services cards |
| **B. Asset library** | Usable licensed media | Beds + SFX + ambience ✅ · **footage ❌** |
| **C. Realism layer** | Phone-native how | `library/realism/` presets ✅ |

See [`docs/PHASE-2.6-ASSET-REALISM.md`](./docs/PHASE-2.6-ASSET-REALISM.md).

```bash
node library/scripts/asset-gap-report.mjs --niche home-services
# → quality_ceiling: designed_cards_on_void … footage_gaps: 5
```

**Highest leverage:** 30s of real phone footage (ringing phone + van/bay + hands) ledgered under `library/footage/`.

## Layout

| Path | Role |
| --- | --- |
| `skills/ad-intelligence/` | Skill entry |
| `classroom/` | Legal + study cards + ingest stub |
| `library/` | Craft + **assets** + realism |
| `pipeline/` | QA, critic, E2E |
| `specs/` | Ad-spec schema |
| `docs/` | Phase addenda |

## Prove

```bash
node library/scripts/assert-assets.mjs --niche home-services
node library/scripts/demo-compose-plan.mjs --brand Oply
node classroom/scripts/retrieve-cards.mjs --niche home-services --limit 5
node pipeline/scripts/e2e-brief-to-plan.mjs --render
```
