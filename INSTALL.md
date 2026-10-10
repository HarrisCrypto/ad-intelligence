# Install Ad Intelligence (one-shot)

**Repo:** https://github.com/HarrisCrypto/ad-intelligence  
**Skill root:** `skills/ad-intelligence/`  
**Version:** **3.9.0** — see [CHANGELOG.md](./CHANGELOG.md)

---

## Why agents fail (and the fix)

Agents brainstorm. This skill forces: **copy skeleton → retrieve → fill → lint until green.**  
That is the one-shot path used by reliable Cursor skills (procedure + template + validation loop).

---

## Fastest paths

| Harness | Do this |
| --- | --- |
| **Cursor (plugin)** | Customize → From GitHub Repository → `https://github.com/HarrisCrypto/ad-intelligence` → install **ad-intelligence** → `/ad-intelligence` |
| **Cursor (repo open)** | `/ad-intelligence` or ask to make an ad — agent should follow `prompts/one-shot.md` |
| **Any other LLM** | Clone repo → run `node skills/ad-intelligence/scripts/build-context-pack.mjs` → paste output as system → give brief |
| **Cloud Agents** | Clone this repo as the workspace |

---

## Paste this to your agent (one-shot)

```text
Use Ad Intelligence v3.9 from https://github.com/HarrisCrypto/ad-intelligence
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
2) node scripts/retrieve.mjs --niche <niche> --platform <platform> --limit 5
3) Fill every [[BRACKET]] (Craft system must pass craft lint)
4) node scripts/lint-package.mjs packages/<brand>-ad.md until ok:true
5) Deliver the file + lint JSON — no chat-only brainstorm
```

---

## External LLM (no Cursor skills)

```bash
git clone https://github.com/HarrisCrypto/ad-intelligence.git
cd ad-intelligence
node skills/ad-intelligence/scripts/build-context-pack.mjs > /tmp/ad-pack.md
# Paste /tmp/ad-pack.md into the model system prompt, then send the brief.
```

---

## Verify the agent actually loaded the skill

- Writes `packages/*-ad.md` from the skeleton  
- Cites pattern ids from `retrieve.mjs`  
- Craft system has ≥2 HEX + named type + E1 endcard  
- Pastes `"ok": true` from lint  

If you only get a paragraph of “hook ideas,” the one-shot path was skipped — paste `prompts/one-shot.md` and insist.

## Proof

[PROOF.md](./PROOF.md) · [elite-creative-os.md](./skills/ad-intelligence/references/elite-creative-os.md) · gold fixtures in `skills/ad-intelligence/examples/`
