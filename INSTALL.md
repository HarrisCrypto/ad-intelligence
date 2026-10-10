# Install Ad Intelligence (low friction)

**Repo:** https://github.com/HarrisCrypto/ad-intelligence  
**Skill root:** `skills/ad-intelligence/`  
**Version:** **3.5.0** — see [CHANGELOG.md](./CHANGELOG.md)

---

## One-line paths

| Harness | Fastest install |
| --- | --- |
| **Cursor (plugin)** | Customize → From GitHub Repository → paste `https://github.com/HarrisCrypto/ad-intelligence` → install **ad-intelligence** |
| **Cursor (this repo open)** | Already available — ask `/ad-intelligence` or “use the ad-intelligence skill” |
| **Claude / Grok / Hermes / other** | Clone repo → prepend [`skills/ad-intelligence/prompts/harness-system-prompt.md`](./skills/ad-intelligence/prompts/harness-system-prompt.md) → point the model at `SKILL.md` |
| **Cloud Agents** | Keep this repo as the workspace **or** copy `skills/ad-intelligence` into `.cursor/skills/` |

Plugin metadata lives at `.cursor-plugin/` (`plugin.json` + `marketplace.json`) so Cursor can install and version the skill as a plugin.

---

## Quick start for agents

Copy this block when you need the agent to self-orient with no extra explanation:

```text
You are using Ad Intelligence (skills/ad-intelligence/) v3.5.
1. Read SKILL.md and pipelines/one-stop-ad-maker.md
2. Quality bar: full-depth examples (beauty, local-service-trust, saas-demo-pas,
   physical-product-hero) + visual frames in examples/visual/
3. For messy/regulated briefs, read examples/stress-briefs/ expected traps + policy-precheck.json
4. Retrieve: node scripts/retrieve.mjs --niche <niche|alias> --platform <platform> --limit 5
5. Fill output-template.md: sheets, claim ledger, timed script, render plan + log,
   self-critique, AI disclosure (HUMAN_REVIEW_REQUIRED when policy says so)
6. If generators connected → call them (connected-run-protocol.md). Else → MCP-correct handoffs.
7. Ship only if: node scripts/lint-package.mjs <package.md> exits 0
   (optional sanity: node scripts/demo-quality-gates.mjs)
Never invent proof. Dual-track default for serious brands. One CTA. Muted-first.
```

One-shot user prompt:

```text
/ad-intelligence
Make first-shot dual-track ads for:
- Company / product:
- Niche:
- Platforms:
- Goal:
- Assets on hand (stills, URL, reviews):
- Tools connected (Higgsfield / Seedance / none — handoff OK):

Retrieve → sheets → render plan → full output template → lint before delivery.
```

---

## Discoverable commands

From skill root (`skills/ad-intelligence/`):

```bash
# Patterns for a niche / platform (aliases work: skincare, plumbing, …)
node scripts/retrieve.mjs --niche beauty --platform tiktok --limit 5
node scripts/retrieve.mjs --list
node scripts/retrieve.mjs --list-niches

# Mechanical ship gate (required)
node scripts/lint-package.mjs examples/beauty-dtc-dual-track.md
node scripts/lint-package.mjs path/to/your-package.md
```

---

## Cursor details

1. **Plugin install:** Customize → From GitHub Repository → this URL → Skills should list **ad-intelligence**.
2. **In-chat:** `/ad-intelligence` or “follow the ad-intelligence skill.”
3. **Sticky session:** Option/Alt+Enter on the skill → Custom Mode.
4. **Optional rule** (`.cursor/rules/ads.mdc`):

```markdown
---
description: Ads and creatives use Ad Intelligence
alwaysApply: false
---
When the user asks for ads, creatives, hooks, UGC, or launch films: follow
skills/ad-intelligence/SKILL.md, run retrieve.mjs, deliver the output template,
and pass lint-package.mjs before claiming done.
```

5. **Cloud:** Prefer cloning this repo so Cloud Agents get the skill; or sync `~/.cursor/skills/ad-intelligence`.

---

## Non-Cursor harnesses

```bash
git clone https://github.com/HarrisCrypto/ad-intelligence.git
cd ad-intelligence/skills/ad-intelligence
# Prepend prompts/harness-system-prompt.md to the system prompt
node scripts/retrieve.mjs --niche <niche> --limit 5
# Require references/output-template.md + lint-package.mjs exit 0
```

No hosted database required. Optional private longevity notes: see [CONTRIBUTING.md](./CONTRIBUTING.md) / `references/swipe-signals.md`.

---

## Verify

- Chat cites **pattern ids**, a **claim ledger**, a **render plan**, and **lint**.
- `lint-package.mjs` on any full-depth gold fixture returns `"ok": true`.
- If not: say explicitly *Follow ad-intelligence SKILL.md and lint before delivery.*

## Proof & quality bar

- [PROOF.md](./PROOF.md) — before/after vs generic slop  
- [Visual gallery](./skills/ad-intelligence/examples/visual/index.html) — actual storyboard design frames  
- [demo/](./skills/ad-intelligence/demo/) — canonical quality-target pointers  
- Full-depth lint-clean fixtures: beauty · local · SaaS · physical (`examples/`)  
- Stress briefs: `skills/ad-intelligence/examples/stress-briefs/`  
- Gate demo: `node skills/ad-intelligence/scripts/demo-quality-gates.mjs`
