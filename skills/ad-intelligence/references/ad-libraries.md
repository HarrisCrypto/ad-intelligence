# Public ad libraries — research, don’t scrape

Agents need **real attention references** (TikTok, Meta/Instagram, X, YouTube).  
Use **public transparency / creative centers**. Do **not** dump competitor creatives into the repo or invent their metrics.

Machine twin: [`attention-models.json`](./attention-models.json) · Emulate: [`../prompts/emulate-attention-model.md`](../prompts/emulate-attention-model.md)  
Viewable lab: [`../examples/visual/attention-lab.html`](../examples/visual/attention-lab.html)

---

## Libraries (open these)

| Platform | Tool | URL | What to steal |
| --- | --- | --- | --- |
| Meta / Facebook / Instagram | **Meta Ad Library** | https://www.facebook.com/ads/library/ | Active ads: 0–3s hook, primary text length, endcard CTA, dual placements |
| TikTok | **TikTok Creative Center** | https://ads.tiktok.com/business/creativecenter | Top ads / hooks: cut velocity, caption burn-in, loopability |
| YouTube / Google | **Ads Transparency Center** | https://adstransparency.google.com/ | Open/close structure on video |
| X | **Ads Repository** | https://ads.x.com/transparency | First-line punch + media ratio |
| LinkedIn (B2B) | **Ad Library** | https://www.linkedin.com/ad-library | Problem framing, single CTA |

---

## 10-minute research ritual (any niche)

1. **Name the niche + platforms** from the brief (or from the URL — see `brief-from-url.md`).
2. Open the matching library. Search **category keywords**, not only the user’s brand.
3. Pick **3 live ads** that stop *you*. For each, note only:
   - Hook type (confession / macro / pain object / spectacle / text-first)
   - Seconds until product or UI appears
   - On-screen word count in 0–3s
   - CTA count (must be one when you emulate for paid)
4. Map each to an **attention model id** in `attention-models.json` (or closest).
5. Emulate **timing + shot grammar + text density** — never paste their brand lines, reviews, or claimed %.
6. Run `retrieve.mjs --niche … --platform … --compact` and bind pattern ids.
7. Write the package (Concept → ≥6 beats → Craft → lint).

---

## Niche quick map

| User says | Niche id | Start models | Gold density |
| --- | --- | --- | --- |
| Hair, shampoo, skincare, makeup | `beauty` | `am_hair_transform`, `am_macro_lust_loop`, `am_grwm_ritual` | `examples/beauty-dtc-dual-track.md` |
| Food, snack, coffee, restaurant | `food_bev` | `am_food_crave_asmr`, `am_skit_punchline`, `am_macro_lust_loop` | physical / beauty macro density |
| AI agent, voice AI, SaaS, software | `saas` / `apps` | `am_voice_agent_missed`, `am_ui_aha_saas`, `am_pas_pain_stack` | `voice-agent-front-desk.md`, `saas-demo-pas.md` |
| Plumber, clinic, local | `local_services` | `am_local_geo_trust`, `am_before_after_matchcut` | `local-service-trust.md` |
| DTC product / Shopify | `ecommerce` | `am_macro_lust_loop`, `am_hero_spectacle`, `am_muted_confession` | `physical-product-hero.md` |

---

## Hard rules

- **No scraped files in git** — links + notes only  
- **No invented CTR / ROAS / “#1 ad”**  
- **Private winning notes** stay in gitignored `private-signals.json`  
- Teaching stills in `examples/visual/` are fictional brands — not proof  

If the harness can’t browse the web, still pick attention models from JSON + gold fixtures; tell the user which library URLs to open for a 10-minute sanity check.
