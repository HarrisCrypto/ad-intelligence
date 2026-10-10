# Swipe / longevity signals (living, anonymized)

Machine twin: [`swipe-signals.json`](./swipe-signals.json).  
**No scraped creatives. No brand names. No invented CTR/ROAS.**

## How agents use this

1. After `retrieve.mjs`, read `swipe_signals` in the JSON payload (niche-matched hints when available).
2. Prefer **high** longevity formats when the brief wants evergreen winners.
3. Feed `common_failures` / `fails_when` into **Self-critique & variants**.
4. Never cite this file as proof of a specific advertiser’s performance.

## Structure (JSON)

| Key | Meaning |
| --- | --- |
| `longevity_tiers` | high / medium / low definitions |
| `by_format[]` | format → longevity, hook families, survives_when, fails_when |
| `by_niche_hints[]` | niche → high_longevity formats + common_failures |
| `failure_mode_index[]` | stable ids (`fm_*`) for self-critique tables |
| `private_overlay` | how local `private-signals.json` merges (see below) |

## Longevity snapshot (human)

| Format | Tier | Survives when | Fails when |
| --- | --- | --- | --- |
| ugc_talking_head | high | Specific scene; imperfect native; one mechanism | Fake studio UGC; logo-first |
| before_after | high | Matched framing; honest light | Fake transformation |
| product_loop | high | Benefit visible in motion | Talk over a silent demo |
| hero_product_film | high | Product lock; one capability as experience | Pretty with no JTBD |
| local_service_trust | high | Real facility; phone 3s; NAP match | Stock city; wrong phone |
| app_demo_ui | high | Real UI; aha in first taps | Fantastical fake UI |
| listicle_text_overlay | high | Actionable; muted-legible | Vague tips; hard sell card 1 |
| pov_day_in_life | medium | Identity first; product as prop | Hard sell mid-ritual |
| meme_native | low | Punchline = product truth | Forced trend; uncleared paid audio |

## Niche hints (abbreviated)

- **beauty** — before/after, macro, UGC, GRWM · fails: clinical claims, shade mismatch  
- **saas** — PAS, UI demo, listicle · fails: feature laundry, fake dashboards  
- **local_services** — trust cutdown, proof stack · fails: stock, multi-CTA, NAP  
- **ecommerce** — loop, UGC demo, unbox · fails: wrong SKU, fake urgency  
- **entertainment / creator** — teaser, cliffhanger, save-bait · fails: spoiler, empty bait, multi-CTA  

Full lists: `swipe-signals.json`.

---

## How to add your own private winning notes

Keep advertiser-specific learnings **local**. They never need to be public.

1. Copy the example file:

```bash
cp skills/ad-intelligence/references/private-signals.example.json \
   skills/ad-intelligence/references/private-signals.json
```

2. Edit `private-signals.json` (gitignored). Keep the same shape as the example:
   - `by_niche_hints` — your niches’ durable formats + failures you’ve seen  
   - `by_format` — optional overrides / extras  
   - `notes` — freeform, anonymize client names  

3. Run retrieve as usual — if `private-signals.json` exists, `retrieve.mjs` merges it into `swipe_signals.private` and prefers private niche hints when present.

4. **Do not commit** `private-signals.json`. Do not paste PII or scraped creatives into PRs.

Optional env override:

```bash
AD_INTEL_PRIVATE_SIGNALS=/absolute/path/to/my-signals.json node scripts/retrieve.mjs --niche beauty --limit 3
```
