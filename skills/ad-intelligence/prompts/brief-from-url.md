# Brief from URL — any business, any niche

When the user says “make ads for **https://example.com**” (e.g. OPlyai.com), **gather first**, then one-shot.

## Gather (do not invent)

From the site / about / pricing / product pages, extract:

| Field | Rule |
| --- | --- |
| Brand name | As shown |
| One-line offer | What a stranger gets |
| Niche guess | Map via `retrieve --list-niches` + synonyms (hair→beauty, AI agent→saas) |
| JTBD | One job only |
| Proof available | Quotes, logos, metrics **only if on-page or user-supplied** → else `[PLACEHOLDER]` |
| Visual assets | Screenshots, product stills, logo URL — note provenance |
| CTA | Primary site CTA (Start free / Book demo / Shop / Call) |
| Platforms | Ask if missing; default TikTok + Meta + site’s native (LinkedIn if B2B) |
| Constraints | Regulated claims, competitors named, brand colors/fonts if present |

List **Assumptions** explicitly. Ask ≤3 questions only if blocked; **still ship** a lint-clean package.

## Map niche → models → gold density

1. `node scripts/retrieve.mjs --niche <id> --platform <p> --limit 5 --compact`
2. Read `attention_models` + `research` in the payload (or open [`references/ad-libraries.md`](../references/ad-libraries.md)).
3. Pick **1 primary + 1 challenger** attention model id.
4. Open closest gold fixture — **steal density**, not brand facts:
   - Beauty / hair / shampoo → `examples/beauty-dtc-dual-track.md`
   - Food / bev → macro + physical density (`physical-product-hero.md` + food models)
   - SaaS / AI / voice agent → `saas-demo-pas.md` + `voice-agent-front-desk.md`
   - Local → `local-service-trust.md`

## Then one-shot

Follow [`one-shot.md`](./one-shot.md): Concept → ≥6 exact-VO beats → Craft (HEX, fonts, motion, E1) → unit prompts → lint.

## Anti-slop for URL briefs

- Don’t screenshot-slap a homepage and add “Unlock the future.”
- Don’t invent “trusted by 10,000 teams” from vibes.
- Don’t neon-AI the UI if the product is a calm ops tool.
- Do show **one real workflow** (or honest placeholder UI path).
- Do match landing CTA and offer language.
