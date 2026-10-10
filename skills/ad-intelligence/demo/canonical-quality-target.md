# Canonical quality target (pointer)

> **Agents:** Treat this file as the bookmark. The full lint-clean package is next door.

**Full-depth fixture:** [`../examples/beauty-dtc-dual-track.md`](../examples/beauty-dtc-dual-track.md)

## Must be present in every shipped package

1. Brief + assumptions (or `brief-defaults.json` fills with tags)
2. Retrieval with **pattern ids**
3. Product / character sheets (or explicit request for missing refs) + provenance tags
4. **Claim & asset ledger** — no invented reviews/metrics
5. Timed script (muted-first hook; **one** primary CTA)
6. **Render plan** with clip/unit ids and real MCP roles (`start_image`, `image_references`, …)
7. Self-critique: rubric with evidence, 2–3 failure modes, A/B/C variants
8. AI disclosure & rights
9. `node scripts/lint-package.mjs <package.md>` → exit 0

## Dual-path

Connected generators → call them per `connected-run-protocol.md`.  
Not connected → same-quality handoffs; never claim rendered without job ids.

## Verify

```bash
node ../scripts/lint-package.mjs ../examples/beauty-dtc-dual-track.md
```

Human-facing before/after: repo [`PROOF.md`](../../../PROOF.md).
