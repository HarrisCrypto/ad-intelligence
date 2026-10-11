# Materials tool routing — free first, best quality, safe

Agents **must acquire or generate materials** before designing cards on a void. Use the highest rung you can actually run.

## Decision ladder (materials)

| Priority | Route | When | How |
| --- | --- | --- | --- |
| **0** | Ledger hit (eligible video) | `kind:video` + `motion_confirmed` + `niche_fit` high/med | `select-footage.mjs --bucket …` — **by bucket, not filename** |
| **1** | USER_SUPPLIED shoot | User has phone clips / brand UI screen records | Copy into `library/footage/`, ledger + run `qa/vet-motion` + `qa/vet-asset` |
| **2** | Free motion stock | Always (no key) | **`acquire-footage.mjs`** — Coverr CC0 → Mixkit → Wikimedia video |
| **3** | Free stock video API | `PEXELS_API_KEY` / `PIXABAY_API_KEY` set | `acquire-footage.mjs` or `acquire-assets.mjs --source pexels --video` |
| **4** | **i2v rung (explicit)** | P0 gap or thin stock after harvest | `--connected-i2v` (Seedance/Higgsfield) or `--i2v-available` (Wan/LTX/Grok/Kling) on vetted `library/stills/` seeds — **never** raw still on timeline. See [`footage/rungs.md`](../footage/rungs.md) |
| **5** | Connected image gen | Flux / SD / Higgsfield image | `library/realism/gen-recipes.json`; ledger as generated |
| **6** | Connected long-form | Seedance / Higgsfield video | [`degradation-ladder.md`](../../skills/ad-intelligence/references/creative-stack/degradation-ladder.md) Rung 1 — still select B-roll buckets for truth |
| **7** | Disclose ceiling | Nothing usable | `assert-assets` → `achieved_rung` + `must_disclose_before_generate` — **state the rung in every brief** |

**Hard rule:** stills are never eligible for a footage slot. See [`library/footage/RULE.md`](../footage/RULE.md).

## Job → tool map

| Need | Best free | Best quality (if connected) |
| --- | --- | --- |
| Desk phone / missed-call still | Pexels → Wikimedia | Gen recipe `gen_after_hours_phone_desk` + de-shine |
| Trades hands / tools | Pexels/Pixabay | User shoot or gen `gen_trades_hands_tool` |
| Van / bay / facility | Pexels video or photo | User shoot |
| UI product screens | — | `uikit_voice_agent_flat` / Flux flat UI (not neon) |
| Music bed | Incompetech / Pixabay / FMA | Same — already seeded |
| SFX ring/whoosh/UI | Mixkit (seeded) | Same |
| Motion from still | — | i2v via Wan/Kling/Seedance per routing doc |
| Full spot | Assembler + CapCut | Seedance/Higgsfield if connected |

## Safety rules

1. **License allowlist** in `sources.json` — skip unknown / NC / ND for paid ads.  
2. **No competitor ad scrapes** into git (classroom legal floor).  
3. **Trademark caution** — avoid Amazon/FedEx/etc. liveries as “generic van.”  
4. **Every file gets a ledger row** or it does not ship.  
5. **Attribution** for CC-BY must appear in package credits.  
6. Never claim “photographed UGC” when the source was gen or old PD stock — say so in `how_this_shot_was_made`.

## One command to fill gaps

```bash
# Video-first bucket harvest + motion/subject gates
node library/scripts/fill-niche-gaps.mjs --niche home-services

# Explicit
node library/scripts/acquire-footage.mjs --niche home-services --bucket hook_vehicle

# Pexels video (keyed) — still goes through vet-motion
PEXELS_API_KEY=… node library/scripts/acquire-assets.mjs --source pexels \
  --query "work van street" --tag hook_vehicle --niche home-services --video
```

## Env keys (optional, free)

| Var | Get |
| --- | --- |
| `PEXELS_API_KEY` | https://www.pexels.com/api/ |
| `PIXABAY_API_KEY` | https://pixabay.com/api/docs/ |
| `UNSPLASH_ACCESS_KEY` | https://unsplash.com/developers |

No keys required for Wikimedia + already-seeded Mixkit/Incompetech assets.
