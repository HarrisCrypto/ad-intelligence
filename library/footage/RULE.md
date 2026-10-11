# Footage rule — real moving clips only

**Every niche keeps a coverage set of real moving clips for its mandatory subject buckets.**

1. Acquire only from verified-free-with-motion sources (Coverr CC0, Mixkit free, Wikimedia video, Pexels/Pixabay Video when keyed).
2. Every clip must:
   - **(a)** contain motion (`motion_confirmed: true` via `qa/vet-motion.mjs`)
   - **(b)** pass subject check against the bucket’s `must_depict` (`qa/vet-asset.mjs`)
   - **(c)** carry full facet metadata (see `library/assets/manifest.schema.json`)
3. **Stills are never eligible for a footage slot.**
4. If no eligible clip exists: **report the gap and downgrade the ceiling** — never substitute a still or an off-subject image.

## Pipeline

```bash
# Harvest + vet + keep 3–5 best per bucket
node library/scripts/acquire-footage.mjs --niche home-services

# Select by bucket (composer)
node library/scripts/select-footage.mjs --niche home-services --bucket hook_vehicle

# Correctness gate → buckets / achieved_rung / ad_grade_ok
node library/scripts/assert-assets.mjs --niche home-services
node library/scripts/assert-assets.mjs --niche home-services --connected-i2v   # Seedance/Higgsfield
node library/scripts/assert-assets.mjs --niche home-services --i2v-available # Wan/LTX/Grok

# Acceptance proofs
node library/scripts/prove-footage-gates.mjs
```

Rung table + i2v wire: [`rungs.md`](./rungs.md).

## Eligible pick

`kind: video` · `reject: false` · `motion_confirmed: true` · `niche_fit` in `high|med`

Log chosen asset id + why, per shot. Gaps → **i2v rung** on a *vetted* still (`library/stills/`) or USER_SUPPLIED → or lower ceiling. **Never substitute.** State `achieved_rung` in every brief.