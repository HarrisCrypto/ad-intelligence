# Regression false-positive corpus

Packages / cards that are **correct and must PASS** the named rule — catches over-aggressive gates (B7.2).

| Fixture | Must not emit |
| --- | --- |
| (backtest) synthesis `structure only` + checklist PASS | `shape-claims-pass` |
| Gold examples under `skills/ad-intelligence/examples/*-*.md` | any hard lint fail |

Add markdown packages here when a new rule needs a permanent “correct usage near the trigger” case.
