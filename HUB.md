# Ad Classroom + Production Hub — status

**Source of truth:** `main`. All work lands here.

| Gate | Deliverable | Status |
| --- | --- | --- |
| **0–6 + E2E** | Classroom + QA + specs + critic | ✅ On main ([PR #21](https://github.com/HarrisCrypto/ad-intelligence/pull/21)) |
| **2.6 / 3.5** | Asset library + realism + **free acquire** | ✅ Audio + home-services stills seeded; tool routing for Pexels/Pixabay/Wikimedia/gen |

## Materials (the unlock)

Top FB/TikTok DR ads are **photographed moments**. Agents must **acquire or generate** materials — not invent cards on a void.

| Library | Job | Status |
| --- | --- | --- |
| **A. Study corpus** | Knowing + shot recipes | Observed cards (`ingest-ad.mjs`) + synthesis; format-general; retrieve floor |
| **B. Asset library** | Usable licensed media | Beds/SFX ✅ · `footage/home-services/` stills ✅ |
| **C. Realism layer** | Phone-native how | `library/realism/` ✅ |
| **Acquire** | Free-first fetch/gen | [`TOOL-ROUTING.md`](./library/assets/TOOL-ROUTING.md) · `fill-niche-gaps.mjs` |

```bash
node library/scripts/fill-niche-gaps.mjs --niche home-services   # Pexels if keyed, else Wikimedia
node library/scripts/asset-gap-report.mjs --niche home-services
# → full_native_eligible (stock stills) — still prefer real 30s phone shoot
```

Set `PEXELS_API_KEY` / `PIXABAY_API_KEY` for higher-quality free stock. Gen path: recipes + `alternative-model-routing.md`.

## Layout

| Path | Role |
| --- | --- |
| `skills/ad-intelligence/` | Skill entry |
| `classroom/` | Legal + niches/formats data + ingest + patterns + retrieve floor |
| `library/` | Craft + **assets** + realism |
| `pipeline/` | QA, critic, E2E |
| `specs/` | Ad-spec schema |
| `docs/` | Phase addenda |

## Prove

```bash
node library/scripts/assert-assets.mjs --niche home-services
node library/scripts/demo-compose-plan.mjs --brand Oply
node classroom/scripts/retrieve-cards.mjs --niche home-services --limit 5
node classroom/scripts/prove-corpus-ingest.mjs
node pipeline/scripts/e2e-brief-to-plan.mjs --render
```
