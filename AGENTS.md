# AGENTS — Ad Intelligence

Any coding agent (Cursor, Claude Code, Codex, Gemini CLI, OpenClaw, Copilot, …): when the user wants **ads / creatives / UGC / TikTok / Meta / Reels / Shorts / launch film**, use this skill.

## Load

| Harness | Path |
| --- | --- |
| Cursor | `.cursor/skills/ad-intelligence` |
| Claude Code | `.claude/skills/ad-intelligence` |
| Copilot | `.github/skills/ad-intelligence` |
| Generic / OpenClaw | `.agents/skills/ad-intelligence` or `skills/ad-intelligence/` |
| No skill loader | Paste `skills/ad-intelligence/prompts/context-pack.md` |

## Mandatory

1. `node skills/ad-intelligence/scripts/probe-harness.mjs` — equalize tools → rung  
2. Follow `skills/ad-intelligence/prompts/one-shot.md` — retrieve **studies** + attention models, emulate structure, map `human_build`  
3. `lint-package.mjs` until `"ok": true` — never invent lint or job ids  
4. Finish the cut when gen tools exist (`prompts/finish-the-cut.md`)  

## Ready check

```bash
node skills/ad-intelligence/scripts/agent-ready.mjs
```

Docs: [INSTALL.md](./INSTALL.md) · [skills/ad-intelligence/SKILL.md](./skills/ad-intelligence/SKILL.md)
