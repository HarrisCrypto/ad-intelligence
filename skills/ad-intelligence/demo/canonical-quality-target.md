# Canonical quality target (pointer)

> **Agents:** Treat this file as the bookmark. Full lint-clean packages are in `examples/`.

**Default full-depth fixture:** [`../examples/beauty-dtc-dual-track.md`](../examples/beauty-dtc-dual-track.md)

**Also full-depth (lint-clean):**  
[`local-service-trust.md`](../examples/local-service-trust.md) · [`saas-demo-pas.md`](../examples/saas-demo-pas.md) · [`physical-product-hero.md`](../examples/physical-product-hero.md) · [`voice-agent-front-desk.md`](../examples/voice-agent-front-desk.md)

## Must be present in every shipped package

1. Brief + assumptions (or `brief-defaults.json` fills with tags)
2. Retrieval with **pattern ids**
3. Product / character sheets (or explicit request for missing refs) + provenance tags
4. **Claim & asset ledger** — no invented reviews/metrics
5. Timed script (muted-first hook; **one** primary CTA)
6. **Render plan** with clip/unit ids and real MCP roles (`start_image`, `image_references`, …)
7. **Render log** (`NOT_RENDERED` if handoff-only)
8. Self-critique: rubric with evidence, 2–3 failure modes, A/B/C variants
9. AI disclosure & rights
10. `node scripts/lint-package.mjs <package.md>` → exit 0

Structure source of truth: [`../references/output-template.md`](../references/output-template.md)

## Dual-path

Connected generators → call them per `connected-run-protocol.md`.  
Not connected → same-quality handoffs; never claim rendered without job ids.

## Verify

```bash
node ../scripts/lint-package.mjs ../examples/beauty-dtc-dual-track.md
node ../scripts/lint-package.mjs ../examples/local-service-trust.md
node ../scripts/lint-package.mjs ../examples/saas-demo-pas.md
node ../scripts/lint-package.mjs ../examples/physical-product-hero.md
```

Human-facing before/after: repo [`PROOF.md`](../../../PROOF.md).
