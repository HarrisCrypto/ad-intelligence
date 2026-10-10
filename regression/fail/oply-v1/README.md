# Regression fail — Oply AI v1

Measured bad render from the owner teardown (Classroom plan §0 / PART C1).

## How to run

```bash
# synthesize CI fixture matching the measured defect profile
node pipeline/qa/synthesize-oply-v1.mjs

# inspect
node pipeline/qa/run-qa.mjs regression/fail/oply-v1/fixture.mp4 \
  --expect regression/fail/oply-v1/expected.json \
  --spec regression/fail/oply-v1/expected.json

# or all fail fixtures
node pipeline/qa/prove-qa.mjs
```

## Expected

`run-qa` must exit **nonzero**. Every id in `expected.json` → `must_fail` must appear in the QA hard-fail list.

If QA **passes** this fixture, QA is wrong — fix QA first (Gate 5).

## Media policy

`fixture.mp4` is **synthesized** (not the original Oply delivery). Competitor/customer media is never committed. See `classroom/README.md`.
