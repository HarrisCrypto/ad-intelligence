# Phase 2.6 / 3.5 — Asset Library + Realism Layer

**Diagnosis (owner, 2026-10-11):** Top Meta/TikTok DR ads are photographed moments — real people, places, light, ambient + music, multi-camera cuts. Our package path still produces designed cards on a void. Studying more ads alone cannot fix that: the ceiling is **materials**, not knowledge.

## The three libraries

| Library | Job | Status on main before this phase |
| --- | --- | --- |
| **A. Study corpus** | Knowing — shot-level recipes + measured stats | Sliver: 16 cards, timing-heavy |
| **B. Asset library** | Materials — usable media with licenses | Near-empty: sound rules, zero audio files |
| **C. Realism layer** | How — phone motion, room tone, de-shine grades | Missing as executable presets |

**Highest-leverage unit:** 30 seconds of real footage (tradesperson, van, ringing phone) beats every annotation card.

## A — Study corpus upgrades

Each card must carry, per shot:

- `recipe` — handheld / phone / window light / real hands / no logo  
- `how_this_shot_was_made` — gen recipe, stock id, or USER_SUPPLIED shoot notes  
- Measured `stats` when observed (cut rate, loudness, palette); else `stats_source: synthesis-estimate`

**Scale target:** 60–100 cards/niche. Ingest path: ad-library URL → auto draft (shots, transcript, OCR, loudness, palette) → human confirms `why_it_works` → `status: confirmed`. Competitor **media stays out of git** (Gate 1).

## B — Asset library

| Bucket | Path | Rule |
| --- | --- | --- |
| Music beds | `library/sound/beds/` | Real licensed/CC files + ledger row; never sine drones |
| SFX | `library/sound/sfx/` | Whoosh, hit, ring, UI, typing, … |
| Ambience | `library/sound/ambience/` | Room tone under VO |
| Footage | `library/footage/` | Trades, vans, phones, hands, bays — license per file |
| UGC templates | `library/templates/` | Beat structures (already started) |
| Gen recipes | `library/realism/gen-recipes.json` | i2v prompts for believable phone footage |

**License ledger:** `library/assets/license-ledger.json` — every shippable asset has `id`, `path`, `license`, `attribution`, `source_url`, `allowed_use`. No ledger row → does not ship.

## C — Realism layer

Executable presets in `library/realism/`:

- Phone-camera motion / micro-shake  
- Imperfect framing safe zones  
- Room tone under VO  
- Platform caption styles (already partly in `library/captions/`)  
- Grade recipes that de-shine synthetic footage  

## Gates with teeth

1. **`asset-gap-report.mjs --niche X`** — lists missing footage/audio for that niche.  
2. **`assert-assets.mjs --niche X`** — hard-fails or **lowers quality ceiling** when required buckets are empty; probe/compose must surface the ceiling before generate.  
3. **Self-improve loop** — shipped ad → study card; human teardown → `regression/fail/` + QA rule + “good” card.

## Free/legal seed sources (this week)

- Music: Incompetech (CC BY), Free Music Archive, Pixabay, YouTube Audio Library, Uppbeat  
- SFX: Mixkit, Freesound (CC0), Pixabay SFX  
- Footage: Pexels, Pixabay Video, Mixkit, Coverr — **check each license**  
- Real UGC: phone shoot or creator marketplace  

## Out of scope for git

Competitor creatives, scraped ad pixels, uncleared music. Annotations only for study; media only when licensed and ledgered.
