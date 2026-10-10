# Ad Classroom + Production Hub — status

**Single track:** branch `cursor/classroom-hub-audit-08cd` · PR consolidates v3.19 + Gates 0–6 + E2E package path.

| Gate | Deliverable | Status |
| --- | --- | --- |
| **0** | [`AUDIT.md`](./AUDIT.md) | ✅ Done — user ack |
| **1** | [`classroom/README.md`](./classroom/README.md) legal/sourcing | ✅ Done |
| **5 (early)** | [`pipeline/qa`](./pipeline/qa/) + [`regression/fail/oply-v1`](./regression/fail/oply-v1/) | ✅ Done — prove-qa catches measured fails; B7.3 lint fixed |
| **2.5** | Brand harvest + typography/sound provision | ✅ Done — `brand-harvest.mjs`, `library/typography`, `library/sound`, probe hardware |
| **2** | Study cards (home-services / AI phone first) | ✅ Done — 16 confirmed; retrieve ≥5 |
| **3** | Executable `library/` + demos | ✅ Done — catalogs, voice UI kit, templates, resolve/demo |
| **4** | `specs/ad-spec.schema.json` + 2 templates | ✅ Done — missed-call + local-geo specs/templates |
| **6** | Vision critic loop | ✅ Done — offline critic + QA handoff |
| **E2E** | One-paragraph brief → finished ad; Oply rebuild | ✅ Package path + synthetic v2 PASS vs v1 FAIL |

## Prove locally

```bash
node classroom/scripts/retrieve-cards.mjs --niche home-services --platform meta --limit 5
node library/scripts/demo-compose-plan.mjs --brand Oply
node specs/validate-ad-spec.mjs specs/examples/oply-missed-call.ad-spec.json
node pipeline/qa/prove-qa.mjs
node pipeline/scripts/e2e-brief-to-plan.mjs --render
```

## Also in this track

- **v3.19** — `shape-claims-pass` scoped; `incomplete-hook-only` / `silent-cut-incomplete` lint; finish-the-cut audio bar  
- [`classroom/known-failure-modes.md`](./classroom/known-failure-modes.md) — Oply + process seeds  

## Do not use as the ship gate

Document lint alone. Ship requires render QA on the actual file (Phase 5).

## Related PR

Earlier draft **#20** (v3.19 alone) is superseded by this unified branch — same v3.19 commits plus classroom hub work.
