# Pass fixture — Oply v2 synthetic

Proves render QA can **PASS** a 24s 1080×1920 hard-cut delivery with product-demo flagged — the inverse of [`../fail/oply-v1`](../fail/oply-v1/).

```bash
node pipeline/qa/synthesize-oply-v2.mjs
node pipeline/qa/run-qa.mjs regression/pass/oply-v2/fixture.mp4 --spec regression/pass/oply-v2/qa-spec.json
```

`fixture.mp4` is gitignored; synthesize in CI / locally. Real client delivery replaces grain panels with `library/ui-kits/voice-agent-flat` stills + licensed bed.
