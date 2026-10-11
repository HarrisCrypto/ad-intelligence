# Harness equalization — make any LLM’s tools good enough

Different agents see different tools. **Equalize before you invent missing capabilities.**

Run (preferred):

```bash
node scripts/probe-harness.mjs
# Lock declarations (required before rung — cannot auto-detect MCP/gen):
node scripts/probe-harness.mjs --fill --mcp no --video-gen higgsfield --rung handoff
# Ask the user if --mcp / --video-gen are unknown. Never invent "no tools."
```

## Capability → pipeline rung

| You have | Rung | Do this |
| --- | --- | --- |
| Seedance / Higgsfield / peer **MCP live in session** | **connected** | Call tools per `connected-run-protocol.md`. Log real job ids. |
| Those tools exist for the **user** but not here | **handoff** | **Must** write `<package>/gen-pack.md` (`write-gen-pack.mjs`) — one paste-ready prompt per shot from `library/realism/gen-recipes.json`. User runs in Higgsfield/Seedance/Kling; drop clips back into finish-the-cut. |
| Image gen and/or short video + editor (CapCut etc.) **and user declared no hosted gen** | **assembler** | Keyframes → short clips → edit. Same sheets/lint. |
| Text-only / user declared **no** gen tools | **package-only** | Still ship lint-clean package + unit prompts. Say `NOT_RENDERED`. |
| Browser / web fetch | Use for URL briefs + public ad libraries | `brief-from-url.mjs` · `ad-libraries.md` |
| Shell + Node | Use mechanical loop | start → retrieve → lint until ok |
| No shell | Paste `prompts/context-pack-lite.md` (or full pack) · offline retrieve JSON · `no-shell-lint-checklist.md` — **never invent lint JSON** |

**Hard:** If the probe lists `mcp_seedance_or_higgsfield` under “declare in-session tools,” you **must ask the user** before picking assembler. Silent stock substitution when they have Higgsfield is `fm_skipped_handoff`.

## Equalization rules (non-negotiable)

1. **Name your tools** in the package Brief (`Tool access:`) — after asking the user when undeclared.  
2. **Pick one rung** — don’t pretend connected if you only have ChatGPT images; don’t pick assembler if the user has Higgsfield (that’s handoff).  
3. **Quality does not drop with rung** — density of Concept / beats / Craft stays gold-level.  
4. **Swap models, not standards** — Wan/LTX/Grok/Kling/Hailuo/stills per `alternative-model-routing.md`.  
5. **Never invent** Seedance/Higgsfield job ids, exports, or `"ok": true` lint.  
6. If a harness has a **native skill path**, load this skill from it (see INSTALL harness matrix).  
7. **Finish the cut** — if you can gen video/images **or** handoff, cover the full timed duration (`finish-the-cut.md`). Handoff → gen-pack first, not stock. Missing UI → generate authentic stills, don’t stall.  
8. **One agent owns the budget** — no parallel agents on the same package burning credits.  
9. **Handoff without `gen-pack.md` is incomplete** — `node scripts/write-gen-pack.mjs --out <pkg>/gen-pack.md --niche …`.

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
