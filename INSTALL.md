# Install Ad Intelligence (low friction)

**Repo:** https://github.com/HarrisCrypto/ad-intelligence  
**Skill root:** `skills/ad-intelligence/`  
**Version:** **3.8.1** — see [CHANGELOG.md](./CHANGELOG.md)

---

## One-line paths

| Harness | Fastest install |
| --- | --- |
| **Cursor (plugin)** | Customize → From GitHub Repository → paste `https://github.com/HarrisCrypto/ad-intelligence` → install **ad-intelligence** |
| **Cursor (this repo open)** | Already available — ask `/ad-intelligence` or “use the ad-intelligence skill” |
| **Claude / Grok / Hermes / other** | **Clone the repo** → prepend [`harness-system-prompt.md`](./skills/ad-intelligence/prompts/harness-system-prompt.md) → follow [`bootstrap-from-github.md`](./skills/ad-intelligence/prompts/bootstrap-from-github.md) |
| **Cloud Agents** | Keep this repo as the workspace **or** copy `skills/ad-intelligence` into `.cursor/skills/` |

Plugin metadata lives at `.cursor-plugin/` (`plugin.json` + `marketplace.json`).

**Critical:** Pasting a thin “make me ads” prompt without cloning this repo will not hit the quality bar. The LLM needs `elite-creative-os.md`, gold fixtures, retrieve, and lint on disk.

---

## Quick start for agents

```text
You are using Ad Intelligence v3.8.1 from https://github.com/HarrisCrypto/ad-intelligence
Skill root: skills/ad-intelligence/

BOOTSTRAP (if repo not open):
  git clone https://github.com/HarrisCrypto/ad-intelligence.git
  cd ad-intelligence/skills/ad-intelligence
  Follow prompts/bootstrap-from-github.md

READ IN ORDER:
  SKILL.md → prompts/harness-system-prompt.md →
  references/elite-creative-os.md → references/production-finish-spec.md →
  pipelines/one-stop-ad-maker.md → references/output-template.md →
  closest examples/* gold fixture
  No Seedance/Higgsfield? → creative-stack/assembler-pipeline.md +
  alternative-model-routing.md

RUN TOOLS:
  node scripts/retrieve.mjs --niche <niche|alias> --platform <platform> --limit 5
  node scripts/lint-package.mjs path/to/package.md
  optional: node scripts/demo-quality-gates.mjs

DELIVER: full output-template including Craft system (palette, type, motion,
sound, endcard, aspects). Must feel like a custom motion template from a top
shop — not vibes. Never invent proof or Seedance jobs. One CTA. Muted-first.
```

One-shot user prompt:

```text
/ad-intelligence
Clone or use HarrisCrypto/ad-intelligence. Follow elite-creative-os.md.
Make first-shot dual-track ads for:
- Company / product:
- Niche:
- Platforms:
- Goal:
- Assets on hand (stills, URL, reviews):
- Tools: Higgsfield/Seedance connected | handoff | assembler (Wan/LTX/Grok/…):

Retrieve → sheets → Craft system → render plan → CapCut finish spec → lint + render-qa.
```

---

## Discoverable commands

From skill root (`skills/ad-intelligence/`):

```bash
node scripts/retrieve.mjs --niche beauty --platform tiktok --limit 5
node scripts/retrieve.mjs --list
node scripts/lint-package.mjs examples/beauty-dtc-dual-track.md
node scripts/demo-quality-gates.mjs
```

---

## Cursor details

1. **Plugin install:** Customize → From GitHub Repository → this URL → Skills list **ad-intelligence**.
2. **In-chat:** `/ad-intelligence` — then require retrieve + lint + Craft system.
3. **Sticky session:** Option/Alt+Enter on the skill → Custom Mode.
4. **Optional rule** (`.cursor/rules/ads.mdc`):

```markdown
---
description: Ads and creatives use Ad Intelligence
alwaysApply: false
---
When the user asks for ads, creatives, hooks, UGC, or launch films: follow
skills/ad-intelligence/SKILL.md and elite-creative-os.md, run retrieve.mjs,
fill Craft system + output template, and pass lint-package.mjs before done.
```

5. **Cloud:** Prefer cloning this repo so agents get the skill + scripts.

---

## Non-Cursor harnesses

```bash
git clone https://github.com/HarrisCrypto/ad-intelligence.git
cd ad-intelligence/skills/ad-intelligence
# Prepend prompts/harness-system-prompt.md
# Follow prompts/bootstrap-from-github.md
node scripts/retrieve.mjs --niche <niche> --limit 5
```

---

## Verify quality is actually loading

- Agent cites **pattern ids**, **Craft system** (palette/type/endcard), **claim ledger**, **render plan**, and **lint**.
- `lint-package.mjs` on gold fixtures returns `"ok": true`.
- Package looks like a **custom CapCut/Figma template**, not a brainstorm paragraph.
- If not: paste `bootstrap-from-github.md` and insist on clone + elite-creative-os.

## Proof & quality bar

- [PROOF.md](./PROOF.md) · [elite-creative-os.md](./skills/ad-intelligence/references/elite-creative-os.md)  
- [Visual gallery](./skills/ad-intelligence/examples/visual/index.html)  
- [demo/](./skills/ad-intelligence/demo/) · gold fixtures in `examples/`  
- Assembler + routing: `creative-stack/` · Render QA: `checklists/render-qa.json`  
