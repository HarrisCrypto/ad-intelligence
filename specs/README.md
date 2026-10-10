# Ad specs (Gate 4)

Machine-readable packages that bind brief → study cards → library presets → claim ledger.

| File | Role |
| --- | --- |
| [`ad-spec.schema.json`](./ad-spec.schema.json) | Schema (`format` + `timing_observable` required) |
| [`validate-ad-spec.mjs`](./validate-ad-spec.mjs) | Structural + format-honesty checks |
| [`examples/oply-missed-call.ad-spec.json`](./examples/oply-missed-call.ad-spec.json) | Template `tpl_home_services_missed_call` |
| [`examples/local-geo-phone.ad-spec.json`](./examples/local-geo-phone.ad-spec.json) | Template `tpl_home_services_local_geo` |

```bash
node specs/validate-ad-spec.mjs specs/examples/oply-missed-call.ad-spec.json
node library/scripts/demo-compose-plan.mjs --brand Oply
```
