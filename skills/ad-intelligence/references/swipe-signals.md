# Swipe / longevity signals (anonymized)

Private-friendly performance patterns observed across long-running paid + organic ads.  
**No scraped creatives. No brand names. No invented metrics.** Use as optional retrieval flavor when picking hooks and failure-mode variants.

Machine-readable twin: `swipe-signals.json`.

## How agents should use this

1. After pattern retrieve, optionally skim the niche + format rows below.
2. Prefer **high-longevity** hook families when the brief wants durable winners (not one-week trends).
3. Feed “common failure modes” into the **Self-critique & variants** section.
4. Never cite this file as proof of performance for a specific advertiser.

## Longevity tiers

| Tier | Meaning |
| --- | --- |
| `high` | Often survives weeks–months with iterative hooks |
| `medium` | Works in flights; refresh creative every 1–3 weeks |
| `trend` | Format-dependent; couple to cleared paid twin or organic-only |

## Hook families that tend to last

| Hook family | Formats | Longevity | Notes |
| --- | --- | --- | --- |
| Confession / “I was doing X wrong” | talking-head, POV | high | Specific > dramatic; muted text must carry |
| Pattern interrupt spectacle (no logo) | hero film, macro, VFX | high | 0–1.5s visual; explain later |
| Before → after with honest lighting | beauty, fitness, home | high | Same angle/lighting; no fake timelines |
| Utility listicle / save-bait | SaaS, education, creator | high | Promise a stealable artifact |
| Local proof + phone held | local services | high | Geo + specialty in first 3s |
| Objection FAQ | courses, B2B, health | medium | One objection per cut |
| Unboxing / ASMR texture | ecommerce, beauty | medium | Product lock critical |
| Trend audio / meme format | TikTok/Reels | trend | Organic first; paid needs cleared audio |
| Skit punchline | fintech, apps, DTC | medium | Punchline = product job, not joke alone |
| Founder origin | brand, premium | medium | Short; one proof placeholder max |

## Formats that commonly survive (by niche)

| Niche | High-longevity formats | Usually short-lived |
| --- | --- | --- |
| beauty | POV day-in-life, GRWM soft sell, macro tabletop, before-after | Celebrity lookalike filters, fake clinical overlays |
| local-services | Trust cutdown, WIP footage, review quote + phone | Generic stock handshake, “#1 in city” without proof |
| saas | Save-bait checklist, kinetic explainer, objection FAQ | Feature-tour dumps, fake dashboards with invented metrics |
| ecommerce / physical | Product loop demo, unboxing ASMR, UGC hands, hero film | Logo-first cold opens, melting packshots |
| entertainment / creator | Series cliffhanger, BTS, stitch/duet bait, challenge | Teleprompter hard-sell, unclear IP rights on clips |
| fitness | Challenge participation, POV progress, performance cine | Unsafe challenges, invented transformation timelines |
| fintech | Skit fee confusion, comparison-vs (compliant) | Guaranteed returns, fake celebrity endorsement |

## Common failure modes (use in self-critique)

| Id | Failure | Typical fix variant |
| --- | --- | --- |
| `fm_logo_first` | Opens on logo / brand talk | Swap 0–3s to spectacle or confession |
| `fm_identity_drift` | Product/face changes mid-spot | Enforce sheets + omni_reference; regenerate body only |
| `fm_fake_proof` | Invented metrics/reviews on screen | `[PLACEHOLDER]` or omit; sensory desire instead |
| `fm_muted_fail` | Hook dies without sound | Bigger burned text; visual interrupt |
| `fm_wrong_tier` | Fake UGC too polished / cinema too soft | Match production_truth to brief |
| `fm_multi_cta` | Shop + follow + comment spam | One CTA; move secondary to caption |
| `fm_trend_audio_paid` | Trending sound in paid | Original bed / licensed; organic twin separate |
| `fm_geo_mismatch` | Local ad without city/specialty | On-screen geo in 0–3s |
| `fm_feature_laundry` | SaaS feature list, no job | One JTBD; utility artifact CTA |
| `fm_no_disclosure` | Synthetic talent unlabeled where required | AI disclosure block + platform label |

## Retrieval note

Optional CLI / agent step after pattern pick:

```text
Also load references/swipe-signals.md for niche=<niche> high-longevity hooks
and failure modes → feed Self-critique & variants.
```

Keep pattern/niche JSON structure intact; this layer is additive only.
