# Proof — why Ad Intelligence exists

**Outcome:** first-shot ad packages that do not invent proof, drift product identity, or burn three redo cycles.

**Dual-path in one line:** if Higgsfield/Seedance (or peers) are connected → call them; if not → emit the same-quality MCP-correct handoffs, sheets, render plans, and CapCut finishing.

Read this in under a minute, then open the gold fixture:

| Depth | File |
| --- | --- |
| **Full-depth fixture (lint-clean quality bar)** | [`skills/ad-intelligence/examples/beauty-dtc-dual-track.md`](./skills/ad-intelligence/examples/beauty-dtc-dual-track.md) |
| **Canonical demo pointer** | [`skills/ad-intelligence/demo/`](./skills/ad-intelligence/demo/) |
| Shape-only skeletons (structure, not quality) | `examples/local-service-trust.md`, `saas-demo-pas.md`, `physical-product-hero.md`, `entertainment-creator-series.md` |

---

## What this prevents

| Failure | What generic LLMs often do | What this skill forces |
| --- | --- | --- |
| Invented reviews / metrics / celebs | “Trusted by 50,000 customers ★★★★★” | Claim ledger + `[PLACEHOLDER]` + lint |
| Identity drift | Pack/face morphs mid-spot | Product + character sheets + render-plan ref binds |
| Logo-first cold open | Brand mark in frame 0 | Hook gate + pattern interrupt |
| Multi-CTA spam | Shop + follow + comment + link | Exactly one primary CTA |
| Muted-fail hooks | Joke only works with sound | Muted-first captions / visual hook |
| Fake UGC / wrong tier | Over-polished “creator” cinema | Production-truth rubric + posture |
| Uncleared trend audio in paid | Paste trending sound into ads | Rights / AI disclosure block |
| “Looks good in chat” | Pretty prose, no shipable brief | Timed script + render plan + `lint-package.mjs` |

---

## Before → after (concrete)

Each pair: same brief. Left = typical generic LLM. Right = ad-intelligence discipline (excerpted; full packages live in `examples/`).

### 1) Beauty DTC — consistency + claim hygiene

**Brief:** “Make a TikTok for our barrier serum.”

**Generic slop (typical):**
> Create a glamorous 30s video of a model applying serum. Say “clinically proven to transform skin in 7 days — 94% agree!” End with Shop Now, Follow, and Comment SERUM. Use Seedance. Product looks like a nice glass bottle.

**Ad-intelligence package (signals):**
- Product sheet: frosted 30ml, sage label, matte cap — refs Image 1–3; **no clinical % without USER_SUPPLIED**
- Claim ledger: reviews = `[PLACEHOLDER]`; desire line tagged ASSUMED (not a study)
- Timed 0–2s POV hook (no logo); one soft CTA
- Render plan units U1–U3 with `start_image` / `image_references` — not invented file roles
- Self-critique: failure modes `fm_fake_proof`, `fm_identity_drift`, `fm_muted_fail` → A/B/C

→ Full lint-clean fixture: [`beauty-dtc-dual-track.md`](./skills/ad-intelligence/examples/beauty-dtc-dual-track.md)

### 2) Local service — geo truth + one CTA

**Brief:** “Facebook ad for our plumbing company.”

**Generic slop:**
> “Austin’s #1 plumbers! 10,000+ five-star reviews. Call, DM, or book online today!” Stock skyline B-roll; logo open.

**Ad-intelligence package (signals):**
- Pattern `local-service-trust`; NAP on screen; phone held ≥3s as **only** in-cut CTA
- Proof = `[PLACEHOLDER: Google review]` or user-supplied; never invent “#1”
- Facility/van refs preferred over AI city stock
- Shape skeleton: [`local-service-trust.md`](./skills/ad-intelligence/examples/local-service-trust.md) · deepen to beauty depth before ship

### 3) SaaS — one job, real UI, no feature laundry

**Brief:** “LinkedIn ad for our handoff tool.”

**Generic slop:**
> “Revolutionize your workflow with AI-powered seamless collaboration. 47% faster handoffs. Book a demo, start free, and follow us.” Fake neon dashboard.

**Ad-intelligence package (signals):**
- JTBD one sentence; PAS beats timed; UI from **real screenshots** (product sheet)
- Metrics only if USER_SUPPLIED — else omit
- One CTA: start free trial (demo = retarget, not cold multi-CTA)
- Shape: [`saas-demo-pas.md`](./skills/ad-intelligence/examples/saas-demo-pas.md)

### 4) Physical product — lock + muted hook

**Brief:** “Hero film for our earbuds launch.”

**Generic slop:**
> Cinematic 4K ad, logo first, “best ANC in the world (−45dB),” Shop + Learn More + Subscribe. Text-only gen with no pack refs.

**Ad-intelligence package (signals):**
- Multi-angle product sheet before pixels; Seedance omni refs; 0–3s macro spectacle (**no logo**)
- dB / awards = PLACEHOLDER or omit
- Dual-track: unboxing UGC + hero cinema, same JTBD
- Shape: [`physical-product-hero.md`](./skills/ad-intelligence/examples/physical-product-hero.md)

### 5) Entertainment / creator — one watch path

**Brief:** “Promote episode 4 on TikTok.”

**Generic slop:**
> “#1 show on the internet!!! Watch, buy merch, follow, like, and stitch!” Random AI faces; uncleared song title.

**Ad-intelligence package (signals):**
- Series cliffhanger; Soul-ID if talent; **one** in-cut CTA = Watch Ep.4 (merch in caption only)
- Cleared audio / disclosure; no fake view counts
- Shape: [`entertainment-creator-series.md`](./skills/ad-intelligence/examples/entertainment-creator-series.md)

### 6) Generic “make me ads” — structure vs vibes

**Brief:** “Just make high-converting ads for my brand.”

**Generic slop:**
> Three paragraphs of marketing advice, a vague “hook idea,” no timecodes, no pattern ids, no QA.

**Ad-intelligence package (signals):**
- Retrieve → pattern ids + routes → sheets → claim ledger → timed script → render plan → self-critique → **`node scripts/lint-package.mjs` exit 0**
- Thin briefs filled via `brief-defaults.json` with Assumptions listed

---

## How to verify a package yourself

```bash
cd skills/ad-intelligence
node scripts/lint-package.mjs examples/beauty-dtc-dual-track.md   # must be ok: true
node scripts/retrieve.mjs --niche skincare --platform tiktok --limit 5
```

If an agent’s package fails lint or invents proof, open an issue (see [CONTRIBUTING.md](./CONTRIBUTING.md)) — that failure mode becomes the next gate.
