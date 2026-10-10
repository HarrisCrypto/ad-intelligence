# Classroom — legal & sourcing rules (Phase 1 / Gate 1)

**Mission:** Learn from real professional ads (structure, pacing, technique) without stealing assets or inventing proof. Annotations live in git; competitor media does not.

This file is the legal floor for `classroom/`. Downstream phases (study cards, ingest, niche packs) must obey it.

---

## What may be committed

| Allowed in git | Forbidden in git |
| --- | --- |
| Annotations, shot lists, measured stats (loudness, cut rate, palette hex) | Downloaded competitor videos, frames, audio stems |
| Source URL or ad-library ID + platform + access date | Scraped creatives, brand logos you do not own |
| Our derived patterns / niche packs / steal lists | Verbatim competitor scripts, characters, music |
| Owned / user-supplied teaching frames (e.g. fictional storyboard JPGs we made) | Award-show or library media redistributed without rights |
| License records for fonts / SFX / music we ship in `library/` | Unverified music marked as cleared |

Local study copies (if the user has rights) go only in:

```text
classroom/private-cache/     # gitignored
```

Never commit that directory.

---

## Where to find references

Use public surfaces; check current platform terms before automating download:

- Meta Ad Library  
- Google Ads Transparency Center  
- TikTok Creative Center / Top Ads  
- YouTube / X ad examples  
- Award galleries (Cannes Lions, Clio, The One Show, Webby, Effie) when publicly viewable  

**Access honesty:** record `verified_via: human_browser | agent_runtime` on every access claim. A library marked login-free in docs may still render zero ads headless (Meta often does). Prefer Google Transparency when Meta/TikTok wall; expect many creatives to be `search_text` / static with **no timing**.

---

## Emulate, never copy

Every study card **must** include `what_not_to_copy` (assets, characters, wording, music).

Steal: structure, pacing, hook mechanism, caption style, lighting recipe, cut rhythm.  
Do not steal: pixels, logos, talent likeness, uncleared audio, competitor lines.

---

## Claims & regulated niches

- Never invent proof, testimonials, stats, or results.  
- Unverified claim → `[PLACEHOLDER: needs user proof]`.  
- Health, finance, legal, supplements → run `references/policy-precheck.json` and flag for human review.

---

## Music & SFX

- Only royalty-free or licensed sources.  
- Record license + source in the sound index.  
- If unsure → `license: UNVERIFIED` and **do not ship**.  
- A sine tone / generated drone is **not** a music bed (see `known-failure-modes.md`).

---

## Study-card media rejection (mechanical)

Ingest / validators must **reject** payloads containing data-URIs, base64 blobs, or media keys (`media`, `video`, `image`, `thumbnail`, `frame`, `asset_bytes`, `mp4`, `png`, `jpg`, …). Instruction-only bans are insufficient — enforce in code (already partly in `validate-study.mjs`; keep hard + tested).

---

## Format honesty

`format` and `timing_observable` are first-class. Static search/display cards must not invent `0–3s` video beats. Limits must survive every projection into packages and QA.

---

## Brand harvest (Phase 2.5 — preview)

Before designing for a live product URL: harvest real palette, logo/mascot, UI, approved copy, fonts, and published facts into the consistency system as `ASSET_VERIFIED` or `[PLACEHOLDER]`. Inventing a navy/mint system when the site is near-black/teal is a failure mode, not a creative choice.

---

## Teardown → fixture loop

Every human teardown of a bad render must produce:

1. a `regression/fail/` fixture with expected failures,  
2. at least one hard-fail QA rule + threshold,  
3. a study-card or niche-pack note of what “good” looks like in that niche.

Verify measurable claims with instruments (`ffprobe`, loudness, silence, scene detect, pixel sampling). Where a claim cannot be measured, say so.

---

## Gate 1

- [x] This rules file committed under `classroom/README.md`  
- [x] `classroom/private-cache/` gitignored  
- [x] Cross-linked from `AUDIT.md` / hub status  

Next after Gate 1 was Phase 5 early + Gate 2.5 + Gate 2 (study cards). Next: Phase 3 executable toolbox.
