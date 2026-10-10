# Ad Intelligence

**First-shot ads without the slop.**

Packages that do **not** invent proof, drift product identity, or burn three redo cycles — from any LLM harness (Cursor, Claude, Grok, OpenClaw, Hermes, …).

**Dual-path:** generators connected → call them; not connected → emit the same-quality Seedance/Higgsfield handoffs, sheets, render plans, and CapCut finishing.

| Start here | Link |
| --- | --- |
| **Why it exists (before/after)** | [PROOF.md](./PROOF.md) |
| **Install in minutes** | [INSTALL.md](./INSTALL.md) |
| **Canonical quality target** | [skills/ad-intelligence/demo/](./skills/ad-intelligence/demo/) |
| **Full-depth gold fixture** | [beauty-dtc-dual-track.md](./skills/ad-intelligence/examples/beauty-dtc-dual-track.md) |
| **Ship gate** | `node skills/ad-intelligence/scripts/lint-package.mjs <package.md>` |
| **Contribute** | [CONTRIBUTING.md](./CONTRIBUTING.md) |

**Version 3.3.0** — [CHANGELOG.md](./CHANGELOG.md)

---

## What you get

1. Pattern retrieve (47 blueprints, niche aliases)  
2. Product + character sheets with provenance tags  
3. Claim ledger — user proof or `[PLACEHOLDER]`, never vibes  
4. Timed script (muted-first, one CTA) + dual-track default  
5. MCP-correct **render plan** (or connected-run when tools are live)  
6. Self-critique + A/B/C against real failure modes  
7. **Mechanical lint** before anyone calls it “done”

Leverage is patterns + QA + consistency + lint — not the model alone.

---

## Quick start

```bash
git clone https://github.com/HarrisCrypto/ad-intelligence.git
cd ad-intelligence

# Cursor: Customize → From GitHub Repository → this URL → install plugin
# Or open the repo and ask: /ad-intelligence

cd skills/ad-intelligence
node scripts/retrieve.mjs --niche skincare --platform tiktok --limit 5
node scripts/lint-package.mjs examples/beauty-dtc-dual-track.md
```

Agent quick-start block: [INSTALL.md](./INSTALL.md#quick-start-for-agents)

---

## What’s inside

| Layer | Role |
| --- | --- |
| Patterns + niches | Strategy memory |
| Creative stack | Seedance / Higgsfield / peers — call or handoff |
| Consistency sheets | Product + Soul-ID lock |
| Claim firewall + policy precheck | Anti-hallucination |
| Render plan + connected-run | Production-shaped generation |
| Swipe signals | Anonymized longevity (+ optional private notes) |
| Lint + first-time-right | Ship gate |
| Proof + demo | Adoption / quality bar |

Skill root: `skills/ad-intelligence/SKILL.md`

---

## Tool status (summary)

See [`skills/ad-intelligence/references/creative-stack/LAST-VERIFIED.md`](./skills/ad-intelligence/references/creative-stack/LAST-VERIFIED.md) for dates and MCP probe rules.

| System | Role | Last verified |
| --- | --- | --- |
| Seedance 2.5 | Cinema / ad units, omni refs | 2026-10-10 |
| Seedance 2.0 | Shorter / multi-SKU fallback | 2026-10-10 |
| Higgsfield generate_video / Ads Studio / UGC / Ad Multiplier | Connected generation | 2026-10-10 |
| CapCut finishing | Captions, endcard, aspects | always |
| Meta / TikTok / YouTube flags | Disclosure + rights tree | 2026-10-10 |

---

## Legal

[LICENSE](./LICENSE). Do not redistribute scraped competitor creatives.
