# Footage library

Usable stills/video for timelines — **not** competitor ads. Every file must appear in [`../assets/license-ledger.json`](../assets/license-ledger.json).

## Acquire (free first)

```bash
# Auto-fill niche gaps (Pexels if PEXELS_API_KEY set, else Wikimedia)
node library/scripts/fill-niche-gaps.mjs --niche home-services --limit 2

# Explicit
node library/scripts/acquire-assets.mjs --source wikimedia \
  --query "HVAC technician working" --tag hvac-tech --niche home-services

PEXELS_API_KEY=… node library/scripts/acquire-assets.mjs --source pexels \
  --query "phone on desk night" --tag desk-phone --niche home-services --video
```

Routing ladder + API key links: [`../assets/TOOL-ROUTING.md`](../assets/TOOL-ROUTING.md).

## home-services (seeded)

Stills from Wikimedia (Public domain / CC BY / CC BY-SA). Prefer PD/CC-BY for paid ads; BY-SA requires share-alike compliance — check before ship or replace with Pexels.

| Tag | Role |
| --- | --- |
| `desk-phone` | Missed-call / after-hours object |
| `trades-hands` | Work proof |
| `work-van` | Geo trust |
| `hvac-tech` / `hvac-bay` | Facility / tech |
| `owner-ugc` | Talking-head energy |

Turn stills into motion with i2v per [`../realism/gen-recipes.json`](../realism/gen-recipes.json) + [`alternative-model-routing.md`](../../skills/ad-intelligence/references/creative-stack/alternative-model-routing.md).

## Ceiling

```bash
node library/scripts/asset-gap-report.mjs --niche home-services
```

Empty buckets → compose discloses `designed_cards_on_void`. Full buckets → still prefer a real 30s phone shoot for elite native look.
