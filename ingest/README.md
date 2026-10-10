# Ingesting live ads into your private index

This skill ships **patterns**, not scraped creatives. If you want a living
database of competitors’ ads for *your* agents, keep that data **private** and
store **structured breakdowns**, not media files you don’t own.

## Recommended pipeline (improved vs scrape-only)

```
Platform archive / licensed swipe API
        │
        ▼
Ingest adapter (API or manual CSV)
        │
        ▼
Multimodal breakdown (vision + transcript) → AdBlueprint JSON
        │
        ▼
Private vector DB  +  this skill’s pattern tags
        │
        ▼
Agent retrieves: patterns (public skill) ⊕ your private blueprints
```

### Level 0 — Manual (fastest)

1. Find 10 ads you admire (Meta Ad Library, TikTok Creative Center, etc.).
2. For each, fill `sample-ingest.json` fields yourself (or with a vision model).
3. Drop files into a private folder: `private-blueprints/*.json` (do not commit).
4. Point retrieve at both `database/patterns` and `private-blueprints`.

### Level 1 — Licensed swipe tools

Use Foreplay, MagicBrief, or similar **with a commercial license**, export
breakdowns, map into `AdBlueprint` schema (`schema/ad-blueprint.schema.json`).

### Level 2 — Automated (your infra)

- Cron: pull *your competitors’* active ads via allowed API/scraper.
- Whisper / platform captions → transcript.
- Vision model → hook/body/CTA/style fields.
- Embed `why_it_works` + script text into Chroma/Qdrant/pgvector.
- Agent query: niche + funnel + style → top-k blueprints + pattern skill rules.

## Legal / packaging rules

| OK to put in a public GitHub skill | Keep private |
| --- | --- |
| Pattern blueprints, schemas, hooks, flows | Competitor video/image files |
| Your own ads and owned UGC | Verbatim competitor copy |
| Aggregated “why it works” lessons | Anything barred by platform ToS |

## Mapping fields

Use the same keys as `schema/ad-blueprint.schema.json`. Minimum viable ingest:

- `id`, `name`, `platforms`, `style`, `funnel_stage`, `duration_seconds`
- `hook`, `body.beats`, `cta`, `why_it_works`, `output_contract`
- `source_notes` — where you saw it + date (for your records)
