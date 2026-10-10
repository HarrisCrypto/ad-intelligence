# Stress briefs — messy real-world prompts

Use these to stress-test whether an agent **still** follows Ad Intelligence under vague, contradictory, or regulated briefs.

For each brief:

1. Run retrieve with the hinted niche/alias  
2. Produce a full package from `output-template.md`  
3. `node scripts/lint-package.mjs <out.md>` must exit 0  
4. Check the **Expected traps** — if the agent falls in, file a slop report

| File | Mess type |
| --- | --- |
| `messy-beauty.md` | Vague + pressure to invent clinical proof |
| `messy-local.md` | Missing NAP + “make us #1” |
| `messy-fintech.md` | Guaranteed returns pressure |
| `messy-housing.md` | Discriminatory targeting bait |
| `messy-health.md` | Disease-claim bait |

Also run `node scripts/demo-quality-gates.mjs` to see the lint corpus fail cases.
