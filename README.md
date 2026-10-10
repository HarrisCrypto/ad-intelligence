# Ad Intelligence — one-stop perfect ad maker

> **Install / point your agent:** [`INSTALL.md`](./INSTALL.md)  
> **Own GitHub repo (not Union Jack):** [`PUBLISH.md`](./PUBLISH.md)

Pattern database **plus** a full **creative-stack OS** so agents make
**Seedance / Higgsfield-quality** ads for **any company or niche** —

- when tools **are** connected → call Higgsfield MCP / generators  
- when tools **are not** connected → still ship copy-paste Seedance prompts, Higgsfield execution briefs, CapCut finishing, and media-buy checklists  

## Who this is for

Any brand, agency, app, local service, DTC, B2B, creator, entertainment, nonprofit — **not** tied to one client.

## What’s inside (v3)

| Layer | Contents |
| --- | --- |
| Patterns | **47** blueprints (viral, share, cinema, DR) |
| Creative stack | **Seedance 2.0/2.5**, **Higgsfield** workflows, Kling, Runway, Sora/Veo, CapCut, Symphony, Meta, ElevenLabs, Suno… |
| Pipelines | Pattern → tool route + one-stop master pipeline |
| Prompt contracts | Seedance YAML+prompt, cross-tool recipes |
| Viral OS | Trend classes + weekly ops |
| Niches | 23 vertical packs |
| QA | Mistakes library + first-time-right checklist/rubric |
| Retrieval | `retrieve.mjs` (`--tag viral`, `--production`, `--virality`, …) |

### Creative stack highlights

- **Seedance** — 15–30s single-pass spots, omni-reference product lock, native audio, region edits  
- **Higgsfield** — Ads Studio, UGC video, Marketing Studio, Ad Multiplier, Katana, product photoshoot, brand assets  
- **Peers** — Kling, Runway, Sora/Veo, Midjourney/FLUX, CapCut, TikTok Symphony, Meta Advantage+, ElevenLabs, Suno  

See `skills/ad-intelligence/references/creative-stack/` and  
`skills/ad-intelligence/pipelines/one-stop-ad-maker.md`.

## Quick start

```bash
cd skills/ad-intelligence
node scripts/retrieve.mjs --niche beauty --tag viral --limit 5
node scripts/retrieve.mjs --production premium_cinema --limit 5
```

Ask: *Using ad-intelligence, make Seedance/Higgsfield-quality dual-track ads for [brand].*

## Package & sell

Copy this `ad-intelligence/` folder to its **own** GitHub repo (see `PUBLISH.md`).  
Cursor: **Customize → From GitHub Repository →** that URL.

## Legal

See [`LICENSE`](./LICENSE). Do not redistribute scraped competitor creatives.
