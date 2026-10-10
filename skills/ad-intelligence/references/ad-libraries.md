# Public ad libraries — access paths when TikTok / Meta gate you

Agents need **real attention references** across platforms. Some portals **login-gate** full results. This file is the source of truth for **what opens without an account**, what deep links to use, and the **fallback ladder** so you still see styles when Creative Center / Facebook wall you.

Machine twin: [`attention-models.json`](./attention-models.json) · Plan printer: `node scripts/library-access.mjs --niche … --platform …`  
Emulate: [`../prompts/emulate-attention-model.md`](../prompts/emulate-attention-model.md) · Lab: [`../examples/visual/attention-lab.html`](../examples/visual/attention-lab.html)

---

## Access tiers (honest)

| Tier | Meaning |
| --- | --- |
| `login_free` | Works signed-out for the research ritual (search + view creatives) |
| `partial_free` | Signed-out shows a **slice**; full leaderboard / filters need free login |
| `often_walled` | Interstitial / region / cookie walls common — use deep links + fallbacks |
| `offline` | Always available in-repo (Attention Lab + studies + gold fixtures) |

---

## Libraries — open these (with access reality)

| Platform styles | Tool | Access | Best entry URL |
| --- | --- | --- | --- |
| Meta / FB / IG / Reels | **Meta Ad Library** | `login_free` for Active “All ads” (age-restricted creatives may hide when signed out) | [Deep link — US Active All ads](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&media_type=all) |
| TikTok | **TikTok Creative Center — Top Ads** | `partial_free` — ~4–5 cards signed-out; **View more** wants TikTok login | [Top Ads (EN)](https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en) |
| YouTube / Search / Demand Gen | **Google Ads Transparency** | `login_free` (proven when Meta/TikTok wall) | [Transparency Center](https://adstransparency.google.com/?region=US) |
| X | **Ads Repository** | `often_walled` | [ads.x.com/transparency](https://ads.x.com/transparency) |
| LinkedIn B2B | **Ad Library** | `often_walled` | [linkedin.com/ad-library](https://www.linkedin.com/ad-library) |
| Any (offline) | **Attention Lab + studies** | `offline` | `examples/visual/attention-lab.html` · `studies/corpus.json` |

### Meta deep-link recipe (skip the empty homepage)

```text
https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&media_type=video&q=KEYWORD&search_type=keyword_unordered
```

- Set `country=` to the market you care about (`US`, `GB`, …).  
- Use `media_type=video` for Reels/Feed motion; `all` for mixed.  
- Search **category keywords** or Page name — not only the user’s brand.  
- If the page still forces login: try a private/incognito window, or fall back to Google Transparency + Attention Lab (below).

### TikTok when login-gated (still see the *styles*)

1. Open Top Ads signed-out — take the **first cards** (enough for hook velocity / caption density notes).  
2. Free TikTok account unlocks the rest of Top Ads (recommended if you need breadth).  
3. **Style coverage without TikTok login** (same grammar, different host):
   - TikTok UGC / confession / skit → **Meta Ad Library** `media_type=video` + IG/FB placements  
   - TikTok food/macro loops → Meta video + **YouTube Shorts** via Google Transparency  
   - Timing sheets when no live play → Attention Lab models with `"tiktok"` in platforms  
4. Licensed swipe tools (Foreplay / MagicBrief, etc.) stay **private ingest** — see `../../ingest/README.md`.

---

## Fallback ladder (mandatory when a portal walls)

```text
1. Primary library deep link for the brief’s platform
2. If walled → Google Ads Transparency (login_free) for same advertiser / category
3. If still thin → Meta Ad Library video (login_free) for cross-platform motion styles
4. Always → Attention Lab models + retrieve studies (format-aware)
5. Never invent live CTR / “#1 ad” / paste competitor lines
```

Print the plan for a brief:

```bash
node scripts/library-access.mjs --niche saas --platform tiktok --keyword "virtual receptionist"
```

---

## Platform → where you can still *see* the style

| Style you need | Prefer live | If gated |
| --- | --- | --- |
| Confession UGC / talking head | TikTok Top Ads · Meta video | Meta Ad Library video + `am_muted_confession` |
| Macro / ASMR product | TikTok · IG Reels | Meta video + `am_macro_lust_loop` / `am_food_crave_asmr` |
| PAS / UI aha SaaS | Meta · LinkedIn · YouTube | Google Transparency + Meta + `am_pas_pain_stack` / `am_ui_aha_saas` |
| Search text / RSA | Google Transparency | Already login_free — use `format:search_text` studies |
| Local geo / phone CTA | Meta | Meta Ad Library + `am_local_geo_trust` |
| Text-first / hot take | X · LinkedIn | Attention model `am_text_first_x` if X walls |

---

## 10-minute research ritual (any niche)

1. `node scripts/library-access.mjs --niche … --platform … --keyword …` — open **entry** + **fallbacks**.  
2. Pick **3 live ads** you can actually play (or 3 Attention Lab models if fully offline). For each note:
   - Hook type · seconds-to-product (video only) · 0–3s word count · CTA count · **format** (`video_timed` vs `search_text`)
3. Map to attention model ids + studies (`retrieve.mjs --compact`).  
4. Emulate structure — never paste brand lines / reviews / claimed %.  
5. If Meta/TikTok were gated, **write that in Retrieval** (`library_access: partial_free / often_walled — used Google + Lab`).

---

## Niche quick map

| User says | Niche id | Start models | Gold density |
| --- | --- | --- | --- |
| Hair, shampoo, skincare, makeup | `beauty` | `am_hair_transform`, `am_macro_lust_loop`, `am_grwm_ritual` | `examples/beauty-dtc-dual-track.md` |
| Food, snack, coffee, restaurant | `food_bev` | `am_food_crave_asmr`, `am_skit_punchline` | physical / beauty macro density |
| AI agent, voice AI, SaaS | `saas` / `apps` | `am_voice_agent_missed`, `am_ui_aha_saas` | voice + saas gold |
| Plumber, clinic, local | `local_services` | `am_local_geo_trust` | `local-service-trust.md` |
| DTC / Shopify | `ecommerce` | `am_macro_lust_loop`, `am_hero_spectacle` | `physical-product-hero.md` |

---

## Hard rules

- **No scraped files in git** — links + structured notes only  
- **No invented CTR / ROAS / “#1 ad”**  
- **Login walls ≠ skip research** — run the fallback ladder  
- **search_text ≠ video** — set `structure.format` honestly (see studies README)  
- Private winning notes → gitignored `studies/private/` via `ingest-blueprint.mjs`  

If the harness can’t browse at all: Attention Lab + offline retrieve + gold fixtures; still list the library URLs for the human.
