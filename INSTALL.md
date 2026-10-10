# Install Ad Intelligence (one-shot)

**Repo:** https://github.com/HarrisCrypto/ad-intelligence  
**Skill root:** `skills/ad-intelligence/`  
**Version:** **3.16.0** — see [CHANGELOG.md](./CHANGELOG.md)  
**Verify any harness:** `git clone https://github.com/HarrisCrypto/ad-intelligence.git && node skills/ad-intelligence/scripts/fresh-clone-prove.mjs`

---

## Why agents fail (and the fix)

Agents miss the skill path, ignore their real tools, fill ledgers before ideas, or slap images + slogans. This skill forces: **probe harness → equalize rung → study → emulate → human_build → Concept → dense beats → craft → finish-the-cut → lint**.

---

## Harness matrix (Agent Skills–compatible)

| Harness | Discovery path |
| --- | --- |
| **Cursor** | `.cursor/skills/ad-intelligence` · or plugin from this GitHub repo |
| **Claude Code** | `.claude/skills/ad-intelligence` |
| **GitHub Copilot** | `.github/skills/ad-intelligence` |
| **Codex / OpenClaw / generic** | `.agents/skills/ad-intelligence` · root [`AGENTS.md`](./AGENTS.md) |
| **Any LLM (no skill loader)** | Paste `context-pack-lite.md` (small) or `context-pack.md` (full) |
| **No shell** | Offline retrieve JSON + `prompts/no-shell-lint-checklist.md` |
| **Cloud Agents** | Clone this repo as the workspace |

Ready check:

```bash
node skills/ad-intelligence/scripts/agent-ready.mjs
```

---

## Paste this to your agent (one-shot)

```text
Use Ad Intelligence v3.16 from https://github.com/HarrisCrypto/ad-intelligence
Follow skills/ad-intelligence/prompts/one-shot.md EXACTLY — studies provenance + human-build LOG + finish-the-cut.md.
First: node skills/ad-intelligence/scripts/probe-harness.mjs — fill the tool card and pick a rung.
If I give a website: node skills/ad-intelligence/scripts/brief-from-url.mjs <url>
Retrieve studies + attention models; open Attention Lab; emulate structure (never copy).
Build with real tools per human-build-os.md. If UI screenshots are missing: generate authentic flat UI — do not stall.

Brief:
- Company / product / URL:
- Niche (or guess):
- Platforms (TikTok / Meta / IG / X / YouTube / LinkedIn):
- Goal / offer:
- Assets (stills/URL/reviews):
- Tools you actually have:

Commands (from skills/ad-intelligence/):
1) node scripts/probe-harness.mjs
2) node scripts/start-package.mjs --out packages/<brand>-ad.md
3) node scripts/retrieve.mjs --niche <niche> --platform <platform> --limit 5 --compact
4) Study + attention model → emulate → human_build → Concept → ≥6 exact-VO rows → Craft → fill [[BRACKETS]]
5) node scripts/lint-package.mjs packages/<brand>-ad.md until ok:true
6) Finish the cut; deliver the file + lint JSON — never invent job ids or lint
```

---

## External LLM (no Cursor skills)

```bash
git clone https://github.com/HarrisCrypto/ad-intelligence.git
cd ad-intelligence
node skills/ad-intelligence/scripts/build-context-pack.mjs > /tmp/ad-pack.md
# Paste into the model system prompt, then send the brief.
```

---

## Verify the agent actually loaded the skill

- Ran probe / filled harness tool card + chose a rung  
- Writes `packages/*-ad.md` (no leftover `[[BRACKETS]]`)  
- Names an attention model id (`am_*`)  
- Concept with “Not the default because…”  
- Timed script ≥6 rows with exact quoted VO  
- Craft: ≥2 HEX + real fonts + E1  
- Pastes `"ok": true` from lint (or honest no-shell note)  

If you only get “hook ideas,” paste `prompts/one-shot.md` and insist.

## Proof

[PROOF.md](./PROOF.md) · [Attention Lab](./skills/ad-intelligence/examples/visual/attention-lab.html) · [multi-lens OS](./skills/ad-intelligence/references/multi-lens-os.md)
