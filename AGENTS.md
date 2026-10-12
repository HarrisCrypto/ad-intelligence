# Ad example library

Use this repo to study how real ads are built. Then make a new ad in the user's own storyboard and render tools.

1. Pick platform, niche, and goal.
2. `node scripts/search.mjs --platform tiktok --niche home-services --goal conversion --keyword missed`
3. Open 3–5 matching files in `breakdowns/`.
4. Copy the structure (hook, beats, shot order, pacing, safe zones). Hand the result to the user's storyboard or render tool.

`rebuild_recipe` is tool-agnostic. Do not copy a brand's art, logos, characters, or exact copy. Do not download or rehost the videos. `official_url` is the page to read.

Platform sizes and safe zones are in `platforms/`. Specs were checked on the date in each file.

Schema: `schema/ad-breakdown.schema.json`. Refresh the catalog with `node scripts/build-index.mjs`. Lint with `node scripts/validate-breakdowns.mjs`.

Card lint, claim checks, and render QA still live here for fixtures only: `classroom/scripts/validate-card.mjs`, `classroom/scripts/observed-honesty.mjs`, `pipeline/qa/run-qa.mjs`. The previous tree is on branch `archive/v0`.
