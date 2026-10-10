# Visual design examples + Attention Lab

## Open in a browser

| Page | What |
| --- | --- |
| [`attention-lab.html`](./attention-lab.html) | **Start here** — public ad library links + filterable attention models (timing/shots/words) for TikTok, Meta/IG, X, YouTube, LinkedIn |
| [`index.html`](./index.html) | Storyboard stills for gold fixtures (beauty, local, SaaS, physical) |

Regenerate embedded model data after editing `references/attention-models.json`:

```bash
node scripts/build-attention-lab.mjs
```

## Storyboard frames

| Frame | Niche | Beat |
| --- | --- | --- |
| `frames/beauty-hook-frame.jpg` | Beauty | 0–2s POV hook |
| `frames/beauty-macro-lock-frame.jpg` | Beauty | Macro product lock |
| `frames/local-geo-hook-frame.jpg` | Local | Geo + facility |
| `frames/local-cta-endcard-frame.jpg` | Local | One CTA endcard |
| `frames/saas-ui-aha-frame.jpg` | SaaS | UI aha |
| `frames/kettle-spectacle-frame.jpg` | Physical | Spectacle open |
| `frames/kettle-pour-loop-frame.jpg` | Physical | Pour / loop |

## Rules

- Fictional brands only in frames (AuraBarrier, Northside, RelayHQ, NestBrew)
- Attention models are **teachable structures**, not scraped ads
- Public library links are for live research — do not commit competitor creatives
- **Not** performance proof
- Agents: emulate timing/shot grammar; fill sheets + claim ledger from user assets

## Pair with

- Full-depth packages in `../`
- `../../references/ad-libraries.md`
- `../../prompts/brief-from-url.md`
- `../../prompts/emulate-attention-model.md`
- Stress briefs in `../stress-briefs/` (includes `messy-ai-ops-site.md`)
