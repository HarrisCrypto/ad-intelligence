# Vision critic loop (Gate 6)

After a render exists, critique frames against the ad-spec + study-card steal list. Prefer **instruments** (Phase 5 QA) first; vision is for taste/layout the meters miss.

## Loop

1. `pipeline/qa/run-qa.mjs` — hard fails  
2. `pipeline/critic/critique-frames.mjs` — frame notes vs spec  
3. Apply ≤3 concrete fixes; re-QA  
4. Stop when QA green or budget exhausted (log remaining issues)

## Modes

| Mode | When |
| --- | --- |
| `offline` | No vision model — structural checks from QA + spec fields only |
| `vision` | Optional: pass `--frames-dir` + connected vision tool (not required for Gate 6 offline pass) |
