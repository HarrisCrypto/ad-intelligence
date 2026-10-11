# MASS AD INGESTION — build a real learning corpus
## Cursor task: ingest as many real ads as possible, measured, across niches and formats

> Drop this at `classroom/ingest/MASS-INGEST.md` and follow it. The corpus today has
> **0 genuinely ingested real ads** — the 4 "observed" cards measure `lufs:-70` (digital
> silence), i.e. they are synthesized placeholders wearing an `observed:true` flag.
> Fix that first, then scale.

---

## 0. Objective

Build the largest **legal, measured** corpus of real ads so the system can learn how
high-quality content is assembled — **across every niche and every format** (UGC video
through to no-video statics), with fonts, cuts, content, audio and pacing all captured.

---

## 1. HARD RULE — `observed:true` must mean measured

A card may set `provenance.observed:true` **only if** it was produced from real ad media
and every measured field is non-null. Enforce:

- **Video formats:** `audio.loudness_lufs` present and **> -60** (reject -70 / null / silence);
  `stats.shot_count >= 1` and `duration_s > 0`.
- **No-video formats:** timing nulls are OK; require measured OCR/text stats
  (`stats_source:"measured"`, non-empty OCR or headline fields) — never invent cuts/loudness.
- `measured_by.tooling` non-empty.
- Cards failing this are written with `status:"draft"` **and** `observed:false`, and are
  **excluded from retrieval** and from the corpus floor count.

Add a validator rule (`validate-card.mjs`) that **fails** any `observed:true` card with a
null/-70 loudness or a zero shot count **on video formats**. This alone removes the
current fake-observed cards.

---

## 2. SOURCES — verified access (probed this session)

| Source | Access method | Status | Notes |
| --- | --- | --- | --- |
| **Google Ads Transparency Center** | browser automation (Playwright/Puppeteer) | ✅ **VERIFIED** | `?region=US&domain=<domain>` → real advertisers (`AR…`) and creatives (`CR…`). Creative page: `/advertiser/<AR>/creative/<CR>?region=US`. Also "See all ads by this advertiser". |
| **TikTok Creative Center Top Ads** | browser + its radar API | ✅ reachable | Browse by region/objective/period; capture creative + metrics. |
| **Meta Ad Library** | browser with **user cookies** | ⚠️ needs session | Headless = 403. Use `--cookies` from the user. |
| **YouTube** | `yt-dlp --cookies-from-browser` | ⚠️ needs cookies | Datacenter IP is bot-gated without cookies. |
| **Award galleries** (Cannes, Clio, One Show, Webby, Effie) | HTTP/scrape public winners | ✅ | Strong craft references. |
| **Coverr / Mixkit** | direct CDN `.mp4` | ✅ | **Footage ingredients, NOT reference ads** — do not count as ads. |

**Access rule:** browser-automate what responds; for Meta/YouTube take user cookies or a
dropped file. Never block the whole run on one gated source.

---

## 3. ENUMERATION — how to get *volume*

You need **many ads**, so don't ingest one at a time by hand. Enumerate systematically:

**A. By domain (Ads Transparency) — the main engine.**
1. Keep a **seed list of domains per niche** (see `classroom/ingest/seeds.json`).
2. For each domain → list advertisers (`AR…`) → for each advertiser → "See all ads" → list creatives (`CR…`).
3. Apply **format filter** to pull video, image, carousel, text separately.
4. Some domains return 0 (verified: `servicefinance.com` → "No ads found") — that is fine, move on; keep the seeds that return ads.

**B. By keyword/advertiser name (Ads Transparency search).**
Search the advertiser box for niche terms (`hvac`, `plumber`, `dental`, `saas`, `skincare`)
and region; collect the advertisers that appear.

**C. By niche × format matrix.** For each (niche, format) cell, aim for ads from **≥2
platforms** so patterns aren't single-source.

**D. Feeds:** TikTok CC Top Ads list pages and award galleries give ready-made lists.

---

## 4. THE PIPELINE (per ad)

```
enumerate → fetch media to classroom/private-cache/ (gitignored) → ingest-ad.mjs →
measure → vision pass → write card (observed:true only if measured) →
derive-patterns.mjs → patterns/<niche>/<format>.json
```

Measure (all mechanical):
- **video** — `scdet` cuts · Whisper transcript (word timings) · tesseract OCR (on-screen
  text + zone) · `ebur128` LUFS + true peak · `silencedetect` gaps · `tblend+signalstats`
  motion curve · palette.
- **static/carousel/text** — OCR all text + zones · k-means palette · text/background
  **contrast** · 9-box layout of logo/headline/offer/CTA · offer parsed from copy.
- **fonts** — on a keyframe, crop text regions, classify typeface → `look.font_guess` +
  `look.font_class` (e.g. `grotesk-bold-condensed`, `rounded-sans`, `serif-display`).
- **content** — vision pass records per-shot `subject`, `shot_type`, `framing`,
  `camera_move`, `transition`, `caption_style`, `purpose`, and the **beat role**
  (hook / tension / proof / cta).

Scripts:
- `classroom/ingest/enumerate-ads.mjs` — domain → AR → CR walker
- `classroom/ingest/mass-ingest.mjs` — batch fetch + ingest + run log
- `classroom/ingest/ingest-ad.mjs` — single-ad measure

---

## 5. VOLUME TARGETS

- **Start:** 25–50 real ads ingested in week one, spread over ≥3 niches and ≥4 formats
  (must include at least one **no-video** format per niche).
- **Ramp:** toward **60–100 observed cards per niche** over time; add niches as data.
- **Coverage matrix:** report ads per (niche × format); flag empty cells.
- **Throughput:** batch (e.g. 40–60 ads/run), checkpoint progress, resume; be polite —
  throttle requests, cache media, dedupe by perceptual hash and by creative ID.

---

## 6. LEGAL (non-negotiable)

Commit **annotations, platform IDs (`AR…`/`CR…`), URLs, access date, rights, and our own
derived/measured data only.** Never commit the downloaded ad media or frames — those live
in `classroom/private-cache/` (gitignored). Every card carries `what_not_to_copy`.
Respect each platform's terms; use the public ad libraries and user-supplied files.

---

## 7. FONTS + CONTENT + CUTS — the three things to learn

Make the derived patterns explicitly answer:
- **Cuts** — cuts/10s, avg shot length, first-cut timing, longest hold (per niche × format).
- **Content** — hook mechanism frequency, beat order, proof placement, CTA wording/timing.
- **Fonts/craft** — caption style + typeface class frequency, palette, grade, SFX density.

Each pattern file must **cite the ad IDs** it was derived from.

---

## 8. HONESTY

- `retrieve` refuses a niche below the floor (`min_observed_cards`, `min_formats`,
  `require_no_video_format`) and the agent states the learning ceiling: *"learning from N
  real ads across M formats"* vs *"no real references."*
- The corpus teaches **how** quality is assembled; it does not supply the brand's own
  material. The ceiling ladder still ends at real brand footage → i2v → best vetted stock.

---

## 9. REFERENCE SUBSTANCE (not just "is video")

`video_coverage` counts a card only when **all** hold:

1. `observed:true` with measured stats (lufs > -60, shot_count ≥ 1)
2. `source.platform` is a real **ad library** — meta, tiktok, google_ads_transparency,
   youtube_ads, award galleries — **not** archive.org / Coverr / owned footage dumps
3. Duration in the short-form band **5–90s**
4. Niche derived from content (OCR / advertiser / domain) with `niche_confidence` ≥ 0.55

A green floor filled with Chevrolet/Folgers/US Steel vintage films is a **failure**.
Niches without valid reference video are marked `uncovered`.

## 10. ACCEPTANCE (prove it, don't claim it)

1. ≥3 real ads ingested with **measured** values (video: loudness > -60, shot_count ≥ 1;
   no-video: measured OCR/text) and `observed:true` — including **≥1 no-video format**.
2. The validator **rejects** a video card with `lufs:-70` or `shot_count:0` (test it).
3. `look.font_guess` populated on reference-valid video cards (when any exist).
4. `patterns/<niche>/<format>.json` cites only substance-valid ads (never archive.org).
5. `retrieve --niche <x>` returns observed cards; gate refuses a niche with none.
6. A run log showing volume attempted vs accepted, per source + `video_coverage`.
7. An archive.org-only video batch exits non-zero with `video coverage: 0`.
