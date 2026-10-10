# Install Ad Intelligence (one-shot)

**Repo:** https://github.com/HarrisCrypto/ad-intelligence  
**Skill root:** `skills/ad-intelligence/`  
**Version:** **3.10.0** — see [CHANGELOG.md](./CHANGELOG.md)

---

## Why agents fail (and the fix)

Agents fill ledgers before having an idea — or never load the skill. This skill forces: **Concept → dense beat sheet → craft → lint until green**, and Cursor finds it via `.cursor/skills/ad-intelligence`.

---

## Fastest paths

| Harness | Do this |
| --- | --- |
| **Cursor (plugin)** | Customize → From GitHub Repository → `https://github.com/HarrisCrypto/ad-intelligence` → install **ad-intelligence** → `/ad-intelligence` |
| **Cursor (repo open)** | Skill auto-discovered at `.cursor/skills/ad-intelligence` — ask to make an ad; agent follows `prompts/one-shot.md` |
| **Any other LLM** | Clone → paste committed `skills/ad-intelligence/prompts/context-pack.md` (or rebuild with `build-context-pack.mjs`) → give brief |
| **Cloud Agents** | Clone this repo as the workspace |

---

## Paste this to your agent (one-shot)

```text
Use Ad Intelligence v3.10 from https://github.com/HarrisCrypto/ad-intelligence
Follow skills/ad-intelligence/prompts/one-shot.md EXACTLY.

Brief:
- Company / product:
- Niche:
- Platforms:
- Goal / offer:
- Assets (stills/URL/reviews):
- Tools: Higgsfield/Seedance connected | handoff | assembler:

Commands (from skills/ad-intelligence/):
1) node scripts/start-package.mjs --out packages/<brand>-ad.md
2) node scripts/retrieve.mjs --niche <niche> --platform <platform> --limit 5 --compact
3) Concept (3→1 + “Not the default because…”) → timed script ≥6 rows with EXACT VO quotes → Craft system → fill remaining [[BRACKETS]]
4) node scripts/lint-package.mjs packages/<brand>-ad.md until ok:true
5) Deliver the file + lint JSON — no chat-only brainstorm
```

---

## External LLM (no Cursor skills)

```bash
git clone https://github.com/HarrisCrypto/ad-intelligence.git
cd ad-intelligence
# Prefer committed pack (or rebuild):
# cat skills/ad-intelligence/prompts/context-pack.md
node skills/ad-intelligence/scripts/build-context-pack.mjs > /tmp/ad-pack.md
# Paste into the model system prompt, then send the brief.
```

---

## Verify the agent actually loaded the skill

- Writes `packages/*-ad.md` from the skeleton (no leftover `[[BRACKETS]]`)  
- Concept section with “Not the default because…”  
- Timed script ≥6 rows with exact quoted VO/on-screen words  
- Cites pattern ids from `retrieve.mjs --compact`  
- Craft system has ≥2 HEX + real font names + E1 endcard  
- Pastes `"ok": true` from lint  

If you only get a paragraph of “hook ideas,” the one-shot path was skipped — paste `prompts/one-shot.md` and insist.

## Proof

[PROOF.md](./PROOF.md) · [elite-creative-os.md](./skills/ad-intelligence/references/elite-creative-os.md) · gold fixtures in `skills/ad-intelligence/examples/`
