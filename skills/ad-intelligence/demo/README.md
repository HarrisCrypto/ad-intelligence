# Demo — canonical quality targets

**Point agents here** when you need the quality bar for a first-shot package.

## Full-depth fixtures (lint-clean)

Any of these is a valid depth target — pick the closest niche:

| Niche | Package |
| --- | --- |
| Beauty DTC | [`../examples/beauty-dtc-dual-track.md`](../examples/beauty-dtc-dual-track.md) |
| Local service | [`../examples/local-service-trust.md`](../examples/local-service-trust.md) |
| SaaS | [`../examples/saas-demo-pas.md`](../examples/saas-demo-pas.md) |
| Physical product | [`../examples/physical-product-hero.md`](../examples/physical-product-hero.md) |

Default bookmark if niche unknown: **beauty** (also [`canonical-quality-target.md`](./canonical-quality-target.md)).

Each includes: consistency sheets + provenance, claim ledger, timed script, MCP-correct render plan, self-critique with evidence, A/B/C variants, AI disclosure/rights.

```bash
cd ..   # skills/ad-intelligence
node scripts/lint-package.mjs examples/beauty-dtc-dual-track.md
node scripts/lint-package.mjs examples/local-service-trust.md
node scripts/lint-package.mjs examples/saas-demo-pas.md
node scripts/lint-package.mjs examples/physical-product-hero.md
# expect: "ok": true on each
```

## Agent one-liner

```text
Match the depth and honesty of the full-depth fixtures in skills/ad-intelligence/examples/
(beauty-dtc-dual-track, local-service-trust, saas-demo-pas, or physical-product-hero).
Pass lint-package.mjs before delivery. See also demo/.
```

## Shape-only (not the quality bar)

- [`../examples/entertainment-creator-series.md`](../examples/entertainment-creator-series.md) — structure reminder only; deepen before ship

## Human proof

See repo root [`PROOF.md`](../../../PROOF.md) for before/after vs generic LLM slop.
