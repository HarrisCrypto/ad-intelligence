# Finish the cut — do not stop after the hook

**Failure mode this kills:** agent renders U1 (8s phone ring), then asks the human for screenshots/logo and leaves 16s unfinished — while parallel agents burn credits on rubber UI.  
**Also kills:** delivering that silent 8s clip as “the ad.” A hook export with no sound and no assemble is not done.

## When gen tools exist (Kling / Wan / Flux / Seedance / etc.)

You **owe a full-duration cut with audio**, not a teaser.

| Must | Must not |
| --- | --- |
| Cover **every second** of the timed script with units | Stop after hook “waiting on your UI” |
| Generate missing UI/product stills via authenticity protocol | Invent dashboard metrics or neon cockpits |
| Log **real** job/export ids per unit (or honest NOT_RENDERED) | Invent Seedance jobs |
| Burn captions/logo/CTA **and audio** in **post** (CapCut) | Ship silent model exports as the final ad |
| Lay VO and/or SFX and/or paid-safe bed on the timeline | Ask models to paint tiny UI type as the product |
| One session / one agent owns the render budget | Parallel agents racing the same package |

## Completion contract (paste into Render log)

```text
FINISH-THE-CUT
- Timed duration: [[Ns — must match timed script end]]
- Units planned: [[K1,C1,U2,…,E1,A1]]
- Units rendered this session: [[list + job ids — every planned video/UI unit, not U1 alone]]
- Units generated as stills (awaiting i2v/assemble): [[list + media ids]]
- Audio laid in post: [[VO and/or SFX and/or paid-safe bed — NOT "none" / silent export]]
- Post assemble: [[CapCut steps — captions, VO, SFX/bed, logo, aspects]]
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
6. Screen-record / stills + CapCut for UI beats is **zero model credits** — prefer that over burning gens on fake chrome.

## Audio (non-negotiable for RENDERED)

Model video is often silent. **That is not the finished ad.**

| Path | When |
| --- | --- |
| Diegetic SFX (ring, click, pour) | Matches beat sheet Audio column |
| VO / TTS | Laid on A1 in CapCut; paid-safe voice |
| Paid-safe bed | Under body/CTA; never uncleared trend audio for paid |

Log the path in `Audio laid in post`. `Sound plan: silent` on a RENDERED package fails lint (`silent-cut-incomplete`).

## Credit hygiene

- One harness owns renders for a package.  
- Cost-check before each gen; prefer turbo/short clips for B-roll.  
- Do not spawn a second agent on the same brief.  
- Hook-only render is **incomplete** unless the brief asked for a 6–8s cut.  
- Prefer screen-record + CapCut for UI half — save credits for motion that needs a model.

## Quality bar (agency-grade)

- Identity locked to product/character sheets (no morph)  
- Flat documentary UI — not neon cockpit  
- One CTA endcard; muted-first 0–3s still reads  
- With sound on: stranger follows ring → agitate → solve → book → CTA  
- Lint `incomplete-hook-only` / `silent-cut-incomplete` catch fake “done”

## Done means

1. Lint `ok: true`  
2. Full timed script covered — every beat has a unit (video, still+hold, or screen record). **An 8s hook clip alone is incomplete** unless the brief asked for a 6–8s cut.  
3. **Audio is in the cut** — VO and/or SFX and/or paid-safe bed burned in CapCut/post. Silent model exports are not finished ads.  
4. Either all units have real job/export ids **or** a complete generated asset kit + CapCut assemble steps the agent (or user) can run without new creative decisions  
5. Stranger mute-watches 0–3s and knows the situation; stranger with sound hears the story beat by beat  
6. Quality bar above held — no rubber UI, no text-melt as product type, one CTA  
