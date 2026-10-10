# Contributing to Ad Intelligence

Low-barrier ways to make first-shot ads better for everyone.  
**Do not** weaken lint, claim firewall, sheet templates, render plans, or dual-path logic.

## Ways to contribute

### 1) Add a niche pack or pattern
- Niche: `skills/ad-intelligence/database/niches/<id>.json` (follow an existing file’s shape).
- Pattern: `skills/ad-intelligence/database/patterns/<id>.json` + a row in `references/creative-stack/pattern-to-pipeline.json`.
- Rebuild index if needed: `node scripts/rebuild-index.mjs` (repo root `scripts/`).
- Add niche aliases in `scripts/retrieve.mjs` when natural-language synonyms help.

### 2) Add or deepen a gold example
- **Full-depth (lint-clean):** match `examples/beauty-dtc-dual-track.md` — all output-template sections, claim ledger, render plan, self-critique. Must pass:

```bash
node skills/ad-intelligence/scripts/lint-package.mjs skills/ad-intelligence/examples/<your-file>.md
```

- **Shape-only:** mark at the top: `shape-only — not a length or quality target` and **do not** claim Gates PASS.
- Update `PROOF.md` / `demo/README.md` if you add a new full-depth fixture.

### 3) Improve a tool handoff or prompt contract
- Edit files under `references/creative-stack/` (Seedance contract, Higgsfield playbook, render-plan, recipes).
- Bump the relevant row in `LAST-VERIFIED.md` with today’s date and `verified_via`.
- Prefer real MCP roles (`start_image`, `image_references`, …) — never invent API fields.

### 4) Report a real-world failure mode that slipped past lint
- Open a GitHub issue (template below). Include: niche, platform, what the agent emitted, why it was slop, and whether lint passed.
- Best PRs add either a new lint rule in `scripts/lint-package.mjs` **or** a mistakes-library / claim-firewall entry.

## Issue template suggestion — “package still produced X slop”

```markdown
### Title
Slop escaped lint: <short name e.g. invented ROAS on SaaS>

### Environment
- Harness: Cursor / Claude / other
- Skill version: (CHANGELOG / plugin.json)
- Niche / platform:
- Tools connected?: yes / handoff only

### What I asked
(paste brief)

### What I got
(paste offending lines or attach package.md)

### Why it’s slop
- [ ] Invented proof / metrics / celebs
- [ ] Identity drift / no sheets
- [ ] Logo-first / muted-fail / multi-CTA
- [ ] Missing render plan / claim ledger
- [ ] Other:

### Did lint pass?
`node scripts/lint-package.mjs …` → pass / fail / not run

### Suggested fix (optional)
New lint rule / firewall entry / example / docs note
```

Save as `.github/ISSUE_TEMPLATE/slop-report.md` in PRs that add the template (already present in-repo when published).

## How to share a result

First-shot packages help others trust the skill:

1. Redact brand secrets; keep `[PLACEHOLDER]` honesty.
2. Confirm `lint-package.mjs` exit 0.
3. Share: brief (sanitized) → pattern ids → one hook → note that sheets + ledger + render plan were present → link or gist of the markdown package.
4. Optional: PR a **shape-only** or **full-depth** example if rights allow.
5. Do **not** upload scraped competitor creatives or private customer PII.

## Private winning notes (local only)

See `skills/ad-intelligence/references/swipe-signals.md` → “Add your own private notes.”  
Copy `private-signals.example.json` → `private-signals.json` (gitignored). Never commit real advertiser data.

## Stress briefs & lint corpus

- Add messy prompts under `examples/stress-briefs/` with **Expected traps** + **Pass looks like**.  
- Add intentional fail packages under `examples/lint-corpus/fail-*.md` and ensure `demo-quality-gates.mjs` still reports CAUGHT.  
- Visual frames: keep fictional brands only; never commit scraped creatives.

## PR checklist

- [ ] Quality gates intact (lint still passes on beauty gold)
- [ ] CHANGELOG note under the current unreleased / version section if user-facing
- [ ] No parallel skill system; update existing paths
- [ ] No invented metrics in docs or examples
