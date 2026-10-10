# Ad Classroom + Production Hub — status

**Single track:** branch `cursor/classroom-hub-audit-08cd` · PR consolidates v3.19 + Gate 0 + Gate 1.

| Gate | Deliverable | Status |
| --- | --- | --- |
| **0** | [`AUDIT.md`](./AUDIT.md) | ✅ Done — user ack |
| **1** | [`classroom/README.md`](./classroom/README.md) legal/sourcing | ✅ Done |
| **5 (early)** | [`pipeline/qa`](./pipeline/qa/) + [`regression/fail/oply-v1`](./regression/fail/oply-v1/) | ✅ Done — prove-qa catches measured fails; B7.3 lint fixed |
| **2.5** | Brand harvest + typography/sound provision | ✅ Done — `brand-harvest.mjs`, `library/typography`, `library/sound`, probe hardware |
| **2** | Study cards (home-services / AI phone first) | ✅ Done — 16 confirmed; `retrieve-cards.mjs --niche home-services` ≥5 |
| **3** | Executable `library/` + demos | ✅ Done — catalogs, voice UI kit, missed-call template, resolve/demo scripts |
| **4** | `specs/ad-spec.schema.json` + 2 templates | ⏳ Next |
| **6** | Vision critic loop | Pending |
| **E2E** | One-paragraph brief → finished ad; Oply rebuild | Pending |

## Also in this track

- **v3.19** — `shape-claims-pass` scoped; `incomplete-hook-only` / `silent-cut-incomplete` lint; finish-the-cut audio bar  
- [`classroom/known-failure-modes.md`](./classroom/known-failure-modes.md) — Oply + process seeds  

## Do not use as the ship gate

Document lint alone. Ship requires render QA on the actual file (Phase 5).

## Related PR

Earlier draft **#20** (v3.19 alone) is superseded by this unified branch — same v3.19 commits plus classroom hub work.
