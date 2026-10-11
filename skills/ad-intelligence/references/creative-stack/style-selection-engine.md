# Style-selection engine

**Run before (or as the first step of) retrieve.** Niche → pattern → visual system → prompt contract. Retrieval without style selection produces generic “AI ad” look.

Wire: SKILL one-shot · `prompts/one-shot.md` · gold fixtures in `examples/`.

---

## Clarifying questions (ask ≤5, then ship)

Thin briefs are normal. Ask only what blocks craft; assume the rest via `brief-defaults.json` and list **Assumptions**.

1. **Brand tone** — documentary / premium / playful / clinical / native-UGC?  
2. **Proof available** — reviews, UI captures, facility footage, or PLACEHOLDER?  
3. **Platform** — TikTok/Reels, Meta feed, YouTube, LinkedIn, search?  
4. **Funnel stage** — TOF awareness, MOF consideration, BOF conversion?  
5. **Production tier** — hybrid_polished · premium_cinema · documentary_trust · clean_product · assembler_hybrid?

Then pick a row from the map below and retrieve studies/models that match.

---

## Niche → pattern → visual system → prompt contract

| Niche | Primary pattern | Visual system | Prompt contract (steal) | Gold / study |
| --- | --- | --- | --- | --- |
| **Beauty** | `beauty-macro-tabletop` / POV ritual | Macro tabletop, true SKU color, shallow DOF | Texture mid-action before brand; no clinical % without proof | `beauty-dtc-dual-track.md` · `am_macro_lust_loop` |
| **Local service** | `local-service-trust` | Documentary office / van / bay, geo in frame 0 | Real place light; phone CTA ≥3s; NAP match | `local-service-trust.md` · `am_local_geo_trust` |
| **SaaS** | `app-demo-ui` + PAS | Clean UI demo, flat documentary chrome | Pain object → real UI aha; no neon cockpit | `saas-demo-pas.md` · `am_ui_aha_saas` |
| **Physical product** | `hero-product-film` | Hero film, pack lock, motivated camera | Spectacle that is still product physics; endcard craft | `physical-product-hero.md` · `am_hero_spectacle` |
| **Entertainment / creator** | `ugc-talking-head-scroll-stop` / skit | Native UGC, imperfect phone cam | Mid-thought open; brand late; jump cuts | `entertainment-creator-series.md` · `am_muted_confession` |
| **Voice / front-desk** | `pas-pain-stack` + UI | Phone-call story, void → answer | Missed ring → calm UI; full cut not hook-only | `voice-agent-front-desk.md` · `am_voice_agent_missed` |
| **Fashion** | `fashion-editorial-film` | Editorial film, fabric motion, grade lock | Motivated camera; garment truth; no logo melt | `fashion-editorial.md` · `am_hero_spectacle` |
| **Food** | `unboxing-asmr` / macro tabletop | Appetite macro, supply steam/pour | Sensory open; loop-friendly; SKU-true | `food-appetite.md` · `am_food_crave_asmr` / `am_macro_lust_loop` |
| **Real estate** | `documentary-cutdown` (walkthrough) | Walkthrough, motivated gimbal/handheld, window light | Space as hero; one CTA (tour/book); no fake sqft | `real-estate-walkthrough.md` |
| **Fitness** | performance sports cine | Sports cine, exertion truthful, sweat OK | Effort before product; no fake before/after bodies | `fitness-performance.md` |

---

## How agents use this

```text
1. Answer clarifying questions (or assume + list Assumptions)
2. Select niche row → pattern id + visual system + prompt contract
3. retrieve.mjs --niche … --platform … --compact
4. Open gold fixture for DENSITY; emulate structure; original words
5. Pick degradation ladder rung (probe tools)
6. Build craft + render plan matching visual system + rung
```

## Anti-defaults (style engine refuses)

| Niche | Refuse |
| --- | --- |
| Beauty | Clinical disease claims; melted labels |
| Local | Stock skyline as “geo”; wrong phone |
| SaaS | Purple glow cockpit; fake ROI dashboards |
| Voice | Silent 8s hook as finished; invented call volume |
| Food | Grey plastic appetite; wrong SKU |
| Fitness | Impossible morph bodies; unproven “guaranteed” |

## Output fields (put on the package)

```yaml
style_selection:
  niche: …
  pattern_id: …
  visual_system: …
  production_tier: …
  virality_posture: …
  clarifying_answers: { tone, proof, platform, funnel, tier }
  gold_fixture: examples/….md
```
