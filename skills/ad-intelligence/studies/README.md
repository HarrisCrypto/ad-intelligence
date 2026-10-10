# Studies — observe → emulate structure → build like a human

**Mission:** Any LLM, any harness, one-shot ads for any company — grounded in how viral TikTok, high-performing paid, and top-tier brand films **actually work**, without copying brands or scraping media.

| Layer | What | Where |
| --- | --- | --- |
| **Grammar** | 47 patterns, hooks, niches | `database/` |
| **Studies (public)** | Archetypal teardowns + when to emulate + human build steps | `studies/corpus.json` |
| **Live research** | Meta / TikTok / X / YouTube public libraries | `references/ad-libraries.md` |
| **Private corpus** | Your real-ad breakdowns (never commit media) | `studies/private/` (gitignored) |
| **Method** | How a practitioner assembles the cut | `references/human-build-os.md` |

## Rules

- **Steal structure** (timing, shot job, text density, cut rhythm).  
- **Never** paste competitor lines, logos, or claimed CTR/ROAS.  
- Public studies are **archetypal distillations** — not named campaigns, not scrapes.  
- For named competitors: browse libraries → fill private blueprints via `ingest/README.md`.

## Agent loop

```text
retrieve → pick study + attention model
→ research_where (optional 10 min in public libraries)
→ emulate structure for THIS brand
→ human_build steps with real tools
→ finish-the-cut → lint
```

## Add a private study

```bash
cp studies/private.example.json studies/private/my-competitor-01.json
# edit breakdown; do not commit creatives
node scripts/retrieve.mjs --niche saas --platform tiktok --compact
# payload.studies includes private when present
```
