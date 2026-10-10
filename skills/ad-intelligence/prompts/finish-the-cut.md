# Finish the cut — do not stop after the hook

**Failure mode this kills:** agent renders U1 (8s phone ring), then asks the human for screenshots/logo and leaves 16s unfinished — while parallel agents burn credits on rubber UI.

## When gen tools exist (Kling / Wan / Flux / Seedance / etc.)

You **owe a full-duration cut**, not a teaser.

| Must | Must not |
| --- | --- |
| Cover **every second** of the timed script with units | Stop after hook “waiting on your UI” |
| Generate missing UI/product stills via authenticity protocol | Invent dashboard metrics or neon cockpits |
| Log **real** job/export ids per unit (or honest NOT_RENDERED) | Invent Seedance jobs |
| Burn captions/logo/CTA in **post** (CapCut) | Ask models to paint tiny UI type as the product |
| One session / one agent owns the render budget | Parallel agents racing the same package |

## Completion contract (paste into Render log)

```text
FINISH-THE-CUT
- Timed duration: [[Ns]]
- Units planned: [[K1,C1,U2,…,E1,A1]]
- Units rendered this session: [[list + job ids]]
- Units generated as stills (awaiting i2v/assemble): [[list + media ids]]
- Post assemble: [[CapCut steps — captions, VO, logo, aspects]]
- Blocked only if: [[truly no gen tools AND no assets — else generate]]
- User assets requested?: [[optional upgrade — NOT a blocker]]
```

## Asset ladder — generate vs ask

| State | Do |
| --- | --- |
| User gave UI screenshots / logo SVG | Bind as Image-N; screen-record preferred for UI beats |
| URL / brand colors only (S0–S1) | **Generate** calm UI keyframes per `generated-ui-authenticity.md`; tag ASSUMED; disclose synthetic UI if platform requires |
| Pack product, no photos | Generate pack-locked stills from sheet; don’t ask and stall |
| Truly text-only + **no** image/video tools | Package-only + NOT_RENDERED + paste-ready prompts — still full beat sheet |

**Optional ask (≤1):** “If you have real product UI exports, send them for a v2 lock.”  
**Forbidden ask as delivery:** “Send screenshots so I can finish” when you already have Kling/Flux/etc.

## UI / SaaS / voice-agent products

The interface **is** the product. Rubber holographic UI is the trap (credits burned, looks fake).

1. Lock a **flat UI documentary** product sheet (palette, type, 3 screen states).  
2. Generate **3 stills**: idle / solved / confirm — see `references/generated-ui-authenticity.md`.  
3. Short i2v or hold + CapCut cuts between states (cursor/tap implied).  
4. Burn labels/CTA in post if type melts.  
5. Never invent “1,204 calls answered” on screen.

## Credit hygiene

- One harness owns renders for a package.  
- Cost-check before each gen; prefer turbo/short clips for B-roll.  
- Do not spawn a second agent on the same brief.  
- Hook-only render is **incomplete** unless the brief asked for a 6–8s cut.

## Done means

1. Lint `ok: true`  
2. Full timed script covered  
3. Either all units have real job/export ids **or** a complete generated asset kit + CapCut assemble steps the agent (or user) can run without new creative decisions  
4. Stranger mute-watches 0–3s and knows the situation  
