# Lint corpus — packages that **must fail**

These markdown snippets are intentionally sloppy.  
`node scripts/lint-package.mjs <file>` should exit **nonzero**.

Used by `scripts/demo-quality-gates.mjs` to prove the mechanical gate catches common escapes:

| Fixture | What it proves |
| --- | --- |
| `fail-unfilled-skeleton.md` | Leftover `[[BRACKETS]]` never pass |
| `fail-vague-craft.md` | Adjective-only craft fails |
| `fail-copy-leak.md` | Ledger language in consumer copy fails |
| `fail-logo-multi-cta.md` | Thin scripts / logo-first / multi-CTA fail |
| `fail-invented-metrics.md` | Fake proof / missing freshness fail |
| `fail-study-synthesis-as-proof.md` | Citing `basis:synthesis` study as observed/ad-library proof |

Do **not** treat these as templates to copy.
