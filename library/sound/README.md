# Sound — voice tiers + licensed beds/SFX

## Voice tier ladder

| Tier | Engine | When |
| --- | --- | --- |
| **V0** | Platform default TTS | Disclose low quality |
| **V1** | Kokoro-class open TTS | Default CPU |
| **V2** | Hosted TTS | Credits available |
| **V3** | Voice clone | GPU required |

## Music beds (`beds/`)

Real licensed files only. Ledger: [`../assets/license-ledger.json`](../assets/license-ledger.json).

| id | License | Notes |
| --- | --- | --- |
| `bed_carefree_km` | CC-BY-4.0 | Kevin MacLeod — Carefree |
| `bed_wallpaper_km` | CC-BY-4.0 | Kevin MacLeod — Wallpaper |
| `bed_enthusiast_tours` | CC-BY-3.0 | Tours — Enthusiast (FMA) |

**Fails:** sine tones / drones as beds (`fm_sine_bed`). Attribution must appear in package/endcard credits when license requires it.

## SFX (`sfx/`)

Mixkit free SFX — ring, whoosh, UI click, notification, typing, impact. See ledger for ids.

## Ambience (`ambience/`)

`amb_room_tone_owned` — owned pink-noise room tone under VO (not a music bed).

## Commands

```bash
node library/scripts/asset-gap-report.mjs --niche home-services
node library/scripts/assert-assets.mjs --niche home-services
```
