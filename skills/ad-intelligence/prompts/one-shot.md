# ONE-SHOT playbook — study → emulate → build like a human → finish the cut

Agents fail when they fill ledgers before having an idea — or render a hook and stall asking for screenshots. **Retrieve studies → emulate structure → human_build with real tools → Concept → dense beats → craft → lint → finish the full cut.**

## Hard sequence

```text
0. PROBE + EQUALIZE + DEGRADATION RUNG
   node scripts/probe-harness.mjs
   Fill tool card (prompts/harness-equalization.md)
   Read references/creative-stack/degradation-ladder.md → pick rung:
     Rung 1 connected (Seedance/Higgsfield MCP live — name the tool)
     Rung 2 i2v (Kling/Wan/Grok/LTX/Veo/Runway…) → keyframes → short clips → post
     Rung 3 motion storyboard (NO video tool — director pre-viz, NOT a slideshow)
     handoff | package-only as needed
   HARD: never default to stills/storyboard if any video tool is available.
   Model notes: references/external-resources.md (prefer Wan 2.2 → LTX-2.5 → Grok without Seedance)
   Optional: read references/brand-context.md or .agents/brand-context.md if present

1. BRIEF + STYLE SELECTION
   - URL/site: node scripts/brief-from-url.mjs <url> (or prompts/brief-from-url.md)
   - Run references/creative-stack/style-selection-engine.md FIRST:
     ask ≤5 clarifying Qs (tone / proof / platform / funnel / tier) → niche row →
     pattern + visual system + prompt contract
   - OPEN closest gold fixture — steal DENSITY, not brand facts
     (fashion/food/real-estate/fitness/voice/… in examples/)

2. START FILE:
   node scripts/start-package.mjs --out packages/<brand>-ad.md

3. RETRIEVE (prefer compact) — always after style selection:
   node scripts/retrieve.mjs --niche <niche> --platform <platform> --limit 5 --compact
   Paste studies.primary (+ human_build steps) — viral / performance / award archetypes.
   Paste primary / challenger / dual_track_twin (twin ≠ primary).
   Paste attention_models.primary + challenger (timing included).
   Research access plan:
   node scripts/library-access.mjs --niche <niche> --platform <platform> --keyword <kw>
   Open entry_url / deep_link. If TikTok/Meta login-wall → fallbacks (Google Transparency is login_free).
   Attention Lab always works offline. Note STRUCTURE only (+ format: video_timed vs search_text).
   Curated libs / models: references/external-resources.md

4. EMULATE + HUMAN BUILD + WRITE CREATIVE FIRST:
   a) Study id + provenance (observed/basis) + attention model + angle axis
      Steal study.steal; obey study.never_copy; follow when_to_emulate.
      NEVER cite basis:synthesis as observed proof or metrics.
   b) HUMAN ASSEMBLY (before gen fluff):
      node library/scripts/assemble-plan.mjs --card <closest-study-card> --niche …
      Read references/human-assembly-playbook.md — select footage by bucket,
      hard-cut between setups, lay audio, CapCut owns type.
      Map study.human_build + human-build-os.md to YOUR rung.
   c) Concept: 3 one-liners → pick ONE → "Not the default because…"
      (ban: smiling hold-to-camera, floating product+particles, drone #1, neon SaaS cockpit, invented %)
   d) Timed script: ≥6 rows matching study/model timing (±). EXACT quoted VO/text.
   e) Captions cover the cut. One CTA. Muted-first 0–3s (no logo).
   f) Craft: ≥2 #HEX, real fonts, motion, E1, 9:16+1:1 — cut/shots/animation named
   g) One paste-ready prompt PER unit (CAMERA/LIGHT/MOTION/GRADE/NEGATIVES)
   h) Start human-build LOG artifact (references/human-build-log.template.md)
      Seed shape: examples/human-build-logs/home-services-motion-assembly.md

5. FILL remaining [[BRACKETS]]. Never invent proof.

6. LINT LOOP:
   node scripts/lint-package.mjs packages/<brand>-ad.md
   Fix until ok:true. Paste real lint JSON (never invent it).
   No shell → prompts/no-shell-lint-checklist.md; offline retrieve JSON;
   never invent ok:true JSON.

7. FINISH THE CUT (if image/video tools exist):
   Follow prompts/finish-the-cut.md — cover EVERY second of the timed script.
   Missing UI/screenshots? → references/generated-ui-authenticity.md (generate 3 states).
   Post owns captions/logo/CTA type. Log real job ids into the human-build LOG. No parallel agents.
   Do NOT deliver “send me screenshots to finish” when you can generate.
   Deliver package + lint JSON + build log (seed shape: examples/human-build-logs/).
```

## Niche cheat sheet

| Ask | Niche | Study / model / gold |
| --- | --- | --- |
| Hair, shampoo, skincare | beauty | `study_beauty_macro_transform` · `am_hair_transform` · `beauty-dtc-dual-track.md` |
| Food, coffee, snacks | food_bev | `study_food_crave_loop` · `am_food_crave_asmr` · **`food-appetite.md`** |
| AI agent / voice / SaaS site | saas | `study_voice_agent_missed_call` · voice + saas gold |
| Local service | local_services | `study_local_geo_phone` · `am_local_geo_trust` |
| Fashion / apparel | fashion | `am_hero_spectacle` · **`fashion-editorial.md`** |
| Real estate | real_estate | walkthrough · **`real-estate-walkthrough.md`** |
| Fitness / athletic | fitness | effort-first · **`fitness-performance.md`** |
| Any DTC product | ecommerce | `study_award_hero_spectacle` / macro · dual-track |
| Cold UGC trust | many | `study_viral_confession_ugc` |

Style map: `references/creative-stack/style-selection-engine.md`.  
Full map: `studies/corpus.json` · `references/ad-libraries.md`. Emulate: `prompts/emulate-attention-model.md`. Build: `references/human-build-os.md`.

## Refusal / rewrite

Do **not** deliver if:

- Any `[[BRACKET]]` left  
- No study id + provenance + attention model id + no Concept with “Not the default because…”  
- Cited a `basis:synthesis` study as observed performance proof  
- Timed script &lt; 6 rows or VO cells say “sparse” / “≤N words”  
- Craft is adjectives only or fonts hedged (-style/-like)  
- Invented metrics without `[PLACEHOLDER…]`  
- Multi-CTA or logo-first 0–3s  
- Chat-only brainstorm with no package file  
- Image collage + crappy slogan (no cut/timing/shots)  
- Copied competitor lines from a study or live library ad  
- **Hook-only render + “send screenshots”** while gen tools were available  
- Neon/rubber AI dashboard as the product UI  

Thin brief → assume via brief-defaults, list Assumptions, ask ≤3 questions, **still ship** (and still finish the cut if tools exist).

## No Seedance / Higgsfield

**Rung 2** (if any i2v/T2V exists): name **Wan 2.2 / LTX-2.5 / Grok Imagine / Kling / Veo / Runway** in the render plan — see `external-resources.md`.  
**Rung 3** only when **no** video tool exists: motion storyboard (camera moves, lighting shifts, timing, continuity) — not a slideshow.  
Same skeleton. Same sheets, claim ledger, one CTA, lint. Same finish-the-cut duty. Same `human_build` mapping.

## Done means

1. Lint `"ok": true`  
2. Study + model named; structure emulated, words original  
3. Full timed duration covered (finish-the-cut contract) — **not** an 8s silent hook  
4. Audio laid in post (VO and/or SFX and/or paid-safe bed) — silent model exports are incomplete  
5. Stranger can mute-watch 0–3s and know the situation; with sound, hears the full story  
6. UI/product looks authentic — generated flat documentary chrome OK; rubber AI UI not OK  

