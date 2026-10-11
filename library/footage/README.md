# Footage library — real moving clips only

See **[RULE.md](./RULE.md)**. Stills never fill a footage slot.

## Acquire

```bash
# Bucket harvest (Coverr CC0 → Mixkit → Wikimedia video → Pexels/Pixabay if keyed)
node library/scripts/acquire-footage.mjs --niche home-services

# One bucket
node library/scripts/acquire-footage.mjs --niche home-services --bucket hook_vehicle --keep 3

# Select by bucket (composer)
node library/scripts/select-footage.mjs --niche home-services --bucket hook_phone_ring
node library/scripts/select-footage.mjs --niche home-services --report
```

Hard gates (nothing enters `library/footage/` unvetted):

- `library/scripts/qa/vet-motion.mjs` — freezedetect + mean frame-diff
- `library/scripts/qa/vet-asset.mjs` — subject / reject classes

Bucket defs: [`buckets/home-services.json`](./buckets/home-services.json).

## Ceiling

```bash
node library/scripts/assert-assets.mjs --niche home-services --strict-footage
```

Gaps → disclose + i2v on a *vetted* still (`library/stills/`) or USER_SUPPLIED shoot — **never** substitute an off-subject still.
