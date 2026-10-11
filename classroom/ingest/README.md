# Study-card ingest — format-general, niche-agnostic

**Job:** any real ad (file or text) → card with **measured** stats and `provenance.observed:true`.  
Studying ≠ storing. Extract the assembly recipe; media never enters git.

## Legal floor

- Competitor **media never enters git** (`classroom/README.md`).
- Local media only in `classroom/private-cache/` (gitignored).
- Cards stay `status:"draft"` until `--confirm` with a real `why_it_works`.

## Formats (data: `classroom/formats.json`)

`ugc_video` · `polished_video` · `motion_graphics` · `static_image` · `carousel` · `text_search` · `screen_recording` · `talking_head`

Always include **≥1 no-video** format per niche (`static_image` / `carousel` / `text_search`). That is where offer, copy, composition and CTA craft live.

## Niches (data: `classroom/niches.json`)

Niches are **rows**, not code paths. Adding `dental` / `saas` / `skincare` = add a row (+ optional pack/buckets). No rebuild required.

## Pipeline

```bash
# Video / static image
node classroom/ingest/ingest-ad.mjs classroom/private-cache/ad.mp4 \
  --niche home-services --id obs-ugc-01 --format ugc_video \
  --platform owned --source-id owned:…

# Search / text (no video)
node classroom/ingest/ingest-ad.mjs --text-ad classroom/private-cache/rsa.json \
  --niche home-services --id obs-text-01 --format text_search

# Human confirm → retrieve-eligible
node classroom/ingest/ingest-ad.mjs --confirm classroom/study-cards/home-services/obs-ugc-01.json \
  --why "…" --steal "a|b|c"
```

### Measured signals

| Kind | Tools |
| --- | --- |
| Video | ffmpeg `scdet` cuts, `ebur128`, `silencedetect`, `tblend`+`signalstats` motion, `palettegen`, tesseract OCR frame |
| Static / carousel | tesseract OCR + zones, palette, contrast, 3-band layout |
| Text text | headline/description/CTA char counts (timing fields null, not absent) |

## Access matrix (honest)

| Source | Headless | Notes |
| --- | --- | --- |
| Coverr / Mixkit | ✅ | Footage **ingredients**, not reference ads |
| Google Ads Transparency | browser | Creative IDs `CR…` — annotate, don't commit media |
| Meta Ad Library | cookies | Support `--cookies` / user drop |
| YouTube | cookies | `yt-dlp --cookies-from-browser` |
| User-supplied | ✅ | Most reliable for owned teaching ads |

## Retrieve gate

```bash
node classroom/scripts/retrieve-cards.mjs --niche home-services
# refuses niches below floor (min observed cards + formats + ≥1 no-video)
# always prints ceiling + achieved_rung
```

## Patterns

```bash
node classroom/scripts/derive-patterns.mjs --niche home-services
# → classroom/patterns/<niche>/<format>.json citing card ids
```

## Prove

```bash
node classroom/scripts/prove-corpus-ingest.mjs
```

## Honest limit

A real-ad corpus teaches **how quality is assembled**. It cannot manufacture the brand's own material. The ladder still ends at **USER_SUPPLIED → i2v → vetted stock**.

Stub kept for probes only: `draft-from-probe.mjs`.
