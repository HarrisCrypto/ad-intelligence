# Ad Intelligence

**First-shot ads without the slop.**

Packages that do **not** invent proof, drift product identity, or burn three redo cycles — from any LLM harness (Cursor, Claude, Grok, OpenClaw, Hermes, …).

**Triple-path (pick one rung):** connected MCP → call tools; Seedance/Higgsfield exist for the user but not in-session → same-quality handoffs; only image gen + short clips + CapCut → **assembler** (same sheets, ledger, lint, render-QA). Index: [creative-stack/README.md](./skills/ad-intelligence/references/creative-stack/README.md).

| Start here | Link |
| --- | --- |
| **Why it exists (before/after)** | [PROOF.md](./PROOF.md) |
| **Pipeline rungs (connected / handoff / assembler)** | [creative-stack/README.md](./skills/ad-intelligence/references/creative-stack/README.md) |
| **Assembler (third rung)** | [assembler-pipeline.md](./skills/ad-intelligence/references/creative-stack/assembler-pipeline.md) |
| **No Seedance? Model routing** | [alternative-model-routing.md](./skills/ad-intelligence/references/creative-stack/alternative-model-routing.md) (Wan 2.2 → LTX-2.5 → Grok Imagine) |
| **Voice / front-desk gold fixture** | [voice-agent-front-desk.md](./skills/ad-intelligence/examples/voice-agent-front-desk.md) |
| **Visual design examples** | [examples/visual/index.html](./skills/ad-intelligence/examples/visual/index.html) |
| **Install in minutes** | [INSTALL.md](./INSTALL.md) |
| **Canonical quality targets** | [skills/ad-intelligence/demo/](./skills/ad-intelligence/demo/) |
| **Full-depth gold fixtures** | beauty · local · SaaS · physical · voice/front-desk — see [PROOF.md](./PROOF.md) |
| **Post-render QA** | [render-qa.json](./skills/ad-intelligence/checklists/render-qa.json) |
| **Stress briefs** | [examples/stress-briefs/](./skills/ad-intelligence/examples/stress-briefs/) |
| **Ship gate demo** | `node skills/ad-intelligence/scripts/demo-quality-gates.mjs` |
| **Contribute** | [CONTRIBUTING.md](./CONTRIBUTING.md) |

**Version 3.7.0** — [CHANGELOG.md](./CHANGELOG.md)

---

## What you get

1. Pattern retrieve (47 blueprints, niche aliases)  
2. Product + character sheets with provenance tags  
3. Claim ledger — user proof or `[PLACEHOLDER]`, never vibes  
4. Timed script (muted-first, one CTA) + dual-track default  
5. MCP-correct **render plan** — connected-run, handoff, or **assembler** units  
6. Self-critique + A/B/C against real failure modes  
7. **Mechanical lint** + **render-QA** + intentional fail corpus  
8. **Visual storyboard gallery** paired to gold fixtures  
9. Stress briefs for messy / regulated prompts  
10. Service-niche **voice / front-desk** phone-call gold fixture

---

## Quick start

```bash
git clone https://github.com/HarrisCrypto/ad-intelligence.git
cd ad-intelligence

# Visual examples (open in browser)
open skills/ad-intelligence/examples/visual/index.html   # or xdg-open

cd skills/ad-intelligence
node scripts/demo-quality-gates.mjs
node scripts/retrieve.mjs --niche skincare --platform tiktok --limit 5
```

Agent quick-start: [INSTALL.md](./INSTALL.md#quick-start-for-agents)

---

## What’s inside

| Layer | Role |
| --- | --- |
| Patterns + niches | Strategy memory |
| Creative stack | Three rungs: connected · handoff · **assembler** |
| Consistency sheets | Product + Soul-ID lock |
| Claim firewall + policy precheck | Anti-hallucination + regulated verticals |
| Render plan + connected-run / assembler | Production-shaped generation |
| Swipe signals (+ private overlay) | Longevity notes |
| Lint + corpus + stress briefs | Ship gate + drills |
| Visual gallery + gold fixtures | Design + markdown quality bar |

---

## Tool status (summary)

See [`LAST-VERIFIED.md`](./skills/ad-intelligence/references/creative-stack/LAST-VERIFIED.md).

| System | Last verified |
| --- | --- |
| Seedance 2.5 / 2.0 | 2026-10-10 |
| Higgsfield workflows | 2026-10-10 |
| Policy precheck v1.1 | 2026-10-10 |
| Visual gallery | 2026-10-10 |

---

## What still improves with usage

Real packages that slip lint → new gates; occasional tool-probe refreshes to LAST-VERIFIED; richer private swipe notes from your own flights. Regulated niches still need human review — the precheck flags them; it does not replace counsel.

---

## Legal

[LICENSE](./LICENSE). Do not redistribute scraped competitor creatives.
