# Generated UI authenticity — look real without rubber AI

For SaaS / apps / voice agents / dashboards when the user **did not** supply screenshots.

**Goal:** believable product chrome a stranger trusts.  
**Trap:** neon cockpit, fake charts, melted type, “AI brain” mascots — the thing that burned credits and still looked fake.

## Product sheet lock (before any gen)

Fill these on the sheet (ASSUMED OK if from site/brand):

| Field | Example |
| --- | --- |
| Surface | slate panel `#1a1f2e` or light gray `#F4F6F8` |
| Accent | one mint/blue for “answered / success” |
| Type | Inter / SF-like UI sans — labels short |
| Density | sparse; one primary action per screen |
| States | **Idle** · **Solved** · **Confirm** (exactly 3 for a 24s spot) |
| Never on screen | invented %, customer logos, PHI, fake EMR |

## Generate 3 stills (image gen)

Prompt pattern (repeat per state; change only the state block):

```text
Flat mobile UI screenshot, documentary product photography of a phone screen,
NOT a 3D mockup floating in space, NOT neon, NOT glassmorphism spam.
App: [[Brand]] front-desk / ops tool.
Chrome: [[palette from sheet]]. Rounded 12px cards, 1px borders, system sans.
STATE: [[IDLE: missed call row + red badge | ANSWERED: mint chip + transcript lines
| CONFIRM: calendar card “Routine visit booked”]].
No fake metrics. No stock photos inside the UI. No robot avatar as the product.
Hard light from screen only; dark desk optional in 10% of frame.
9:16 framing with phone UI filling ≥70% of frame.
NEGATIVES: holographic, cyberpunk, purple glow, 8k, cinematic, melted text,
dashboard spaghetti, stock handshake
```

Tag media: `ASSET_VERIFIED` only if from user/site capture; else `ASSUMED` generated.

## Motion without melting type

| Approach | When |
| --- | --- |
| **Hold still + CapCut hard cuts** between 3 states | Safest; type stays sharp |
| **Short i2v** (2–4s) on the phone body only | Subtle parallax; avoid regenerating text |
| **Cursor/tap overlay in CapCut** | Sells “real software” |
| Full T2V of UI | Last resort — usually melts labels |

## Voice / phone products (OPlyai-class)

Recommended 24s assembler:

| unit | Seconds | Source |
| --- | --- | --- |
| K1/C1 | 0–8s | Night desk + ringing phone (gen OK) — muted-first |
| U2a | 8–14s | Generated IDLE UI still |
| U2b | 14–20s | Generated ANSWERED UI still (+ optional TTS line) |
| U2c/E1 | 20–24s | CONFIRM still + CapCut endcard (logo gen or wordmark) |

Logo: generate a **simple wordmark** plate if no SVG — geometric sans, high contrast — or kinetic type of brand name. Don’t block the cut.

## Disclosure

If UI is fully generated: note in AI disclosure (“Product UI illustrated / generated — not a live screen record”). Prefer upgrading to real captures in v2 when user sends them.

## Quality bar

Pass if: looks like a calm fintech/ops app screenshot.  
Fail if: looks like a Midjourney “AI dashboard” poster.
