# Harness equalization — make any LLM’s tools good enough

Different agents see different tools. **Equalize before you invent missing capabilities.**

Run (preferred):

```bash
node scripts/probe-harness.mjs
# or: node scripts/probe-harness.mjs --fill   # interactive checklist → JSON
```

## Capability → pipeline rung

| You have | Rung | Do this |
| --- | --- | --- |
| Seedance / Higgsfield / peer **MCP live in session** | **connected** | Call tools per `connected-run-protocol.md`. Log real job ids. |
| Those tools exist for the **user** but not here | **handoff** | Write paste-ready prompts + refs; user runs elsewhere. |
| Image gen and/or short video + editor (CapCut etc.) | **assembler** | Keyframes → short clips → edit. Same sheets/lint. |
| Text-only / no gen tools | **package-only** | Still ship lint-clean package + unit prompts. Say `NOT_RENDERED`. |
| Browser / web fetch | Use for URL briefs + public ad libraries | `brief-from-url.mjs` · `ad-libraries.md` |
| Shell + Node | Use mechanical loop | start → retrieve → lint until ok |
| No shell | Paste `prompts/context-pack-lite.md` (or full pack) · offline retrieve JSON · `no-shell-lint-checklist.md` — **never invent lint JSON** |

## Equalization rules (non-negotiable)

1. **Name your tools** in the package Brief (`Tool access:`).  
2. **Pick one rung** — don’t pretend connected if you only have ChatGPT images.  
3. **Quality does not drop with rung** — density of Concept / beats / Craft stays gold-level.  
4. **Swap models, not standards** — Wan/LTX/Grok/Kling/Hailuo/stills per `alternative-model-routing.md`.  
5. **Never invent** Seedance/Higgsfield job ids, exports, or `"ok": true` lint.  
6. If a harness has a **native skill path**, load this skill from it (see INSTALL harness matrix).  
7. **Finish the cut** — if you can gen video/images, cover the full timed duration (`finish-the-cut.md`). Missing UI → generate authentic stills, don’t stall.  
8. **One agent owns the budget** — no parallel agents on the same package burning credits.

## Tool card (paste into package or chat)

```text
HARNESS TOOL CARD
- Harness: [[Cursor|Claude Code|Codex|Gemini|OpenClaw|ChatGPT|other]]
- Shell/node: [[yes|no]]
- Network/fetch: [[yes|no]]
- Image gen: [[tool names or none]]
- Video gen: [[tool names or none]]
- MCP ads/video: [[Seedance|Higgsfield|none]]
- Browser: [[yes|no]]
- Chosen rung: [[connected|handoff|assembler|package-only]]
- Equalization note: [[what you substituted]]
```

## Done means

Rung chosen + tool card filled + lint-clean package (or honest no-shell self-check).
