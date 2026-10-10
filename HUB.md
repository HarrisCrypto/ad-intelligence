# Ad Classroom + Production Hub — status

**Source of truth:** `main` @ `f92c4de` (merged [PR #21](https://github.com/HarrisCrypto/ad-intelligence/pull/21)).  
All Classroom + Production Hub work lives here — not on side branches.

| Gate | Deliverable | Status |
| --- | --- | --- |
| **0** | [`AUDIT.md`](./AUDIT.md) | ✅ On main |
| **1** | [`classroom/README.md`](./classroom/README.md) legal/sourcing | ✅ On main |
| **5 (early)** | [`pipeline/qa`](./pipeline/qa/) + [`regression/fail/oply-v1`](./regression/fail/oply-v1/) | ✅ On main |
| **2.5** | Brand harvest + typography/sound | ✅ On main |
| **2** | Study cards (home-services) | ✅ On main — 16 confirmed |
| **3** | Executable [`library/`](./library/) | ✅ On main |
| **4** | [`specs/ad-spec.schema.json`](./specs/ad-spec.schema.json) + 2 templates | ✅ On main |
| **6** | [`pipeline/critic`](./pipeline/critic/) | ✅ On main |
| **E2E** | Brief → plan → v2 PASS vs v1 FAIL | ✅ On main |

## Layout (one place for the agent)

| Path | Role |
| --- | --- |
| `skills/ad-intelligence/` | Skill entry (SKILL.md, scripts, studies, prompts) |
| `classroom/` | Legal floor, study cards, niche packs |
| `library/` | Executable craft presets (type, UI kit, templates) |
| `pipeline/` | QA, critic, brand-harvest, E2E |
| `specs/` | Ad-spec schema + examples |
| `regression/` | Fail/pass fixtures (media synthesized, not committed) |
| `HUB.md` / `AUDIT.md` | Status + inventory |

Harness symlinks (`.cursor/skills`, `.claude/skills`, …) all point at `skills/ad-intelligence`.

## Prove on main

```bash
node classroom/scripts/retrieve-cards.mjs --niche home-services --platform meta --limit 5
node library/scripts/demo-compose-plan.mjs --brand Oply
node specs/validate-ad-spec.mjs specs/examples/oply-missed-call.ad-spec.json
node pipeline/qa/prove-qa.mjs
node pipeline/scripts/e2e-brief-to-plan.mjs --render
```

## Ship rule

Document lint alone is not the ship gate. Ship requires render QA on the actual file (`pipeline/qa/run-qa.mjs`).
