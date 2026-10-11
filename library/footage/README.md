# Footage library

**Status:** Gap — this is the materials unlock. Audio is seeded; photographed moments are not.

## Required for home-services (asset-gap-report)

| Tag | Have | Notes |
| --- | --- | --- |
| After-hours phone on desk | ❌ | Highest leverage for voice-agent ads |
| Tradesperson hands / tools | ❌ | Work proof |
| Work van or bay | ❌ | Geo trust |
| Real facility exterior | ❌ | Local |
| Owner / talking-head UGC | ❌ | Confession / objection |

## How to seed (legal)

1. Download from Pexels / Pixabay Video / Mixkit / Coverr — **read license**.  
2. Place under `library/footage/<niche>/`.  
3. Add a row to `library/assets/license-ledger.json` (`kind: footage`).  
4. Re-run `node library/scripts/asset-gap-report.mjs --niche home-services`.

**Better:** shoot 30s on a phone (ringing phone + van + hands). User-supplied clips go in `classroom/private-cache/` or ledgered here with `license: USER_SUPPLIED`.

## Rule

If footage buckets are empty, `assert-assets.mjs` lowers the quality ceiling and compose must disclose **designed_cards_on_void** before generating.
