# Human-build log — Home-services void→answer (motion assembly)

**How a practitioner puts the cut together** once real moving footage exists.  
Companion to `references/human-assembly-playbook.md` and study card `hvac-missed-call-void-01`.

| Field | Value |
| --- | --- |
| Date | 2026-10-11 |
| Brief / URL | After-hours / overflow voice AI for HVAC (home-services) |
| Niche / platform | home-services / meta |
| Study id | `study_voice_agent_missed_call` |
| Study provenance | observed:**false** · basis:**synthesis** |
| Attention model | `am_voice_agent_missed` |
| Study card | `hvac-missed-call-void-01` |
| Pattern primary / twin | `pas-pain-stack` / UI demo twin |
| Pipeline rung | assembler (bucket B-roll + UI kit + CapCut; Seedance optional for UI hero) |
| Harness | Cursor / agent session |

## Decisions

1. Stole void→answer timing + hard-cut setup changes — not a slogan collage.  
2. **Materials first:** `assemble-plan.mjs` / `select-footage` by bucket before any gen.  
3. Product UI = flat documentary kit (or USER_SUPPLIED screen-record) — refused neon cockpit.  
4. Audio on the timeline before captions (ring → silence → click → bed under CTA).

## Assembly plan (shot job → asset)

Run:

```bash
node library/scripts/assemble-plan.mjs --card hvac-missed-call-void-01 --niche home-services
```

| t | Bucket / post | Picture (example shape) | Audio |
| --- | --- | --- | --- |
| 0–3s | `hook_phone_ring` | moving phone/call clip from ledger | `sfx_phone_ring` + room tone |
| 3–8s | `hook_vehicle` | van/truck clip — **hard cut** | whoosh / silence |
| 8–14s | `product_screen` / UI kit | answered UI | `sfx_ui_click` + VO |
| 14–20s | `result_booking` / UI kit | confirm | VO |
| 20–24s | CapCut E1 | endcard | `bed_wallpaper_km` |

Stills in `library/stills/` are i2v seeds only — never dropped into V1 as “footage.”

## Tool calls / job ids (shape)

| Unit | Tool | Job id / receipt | Notes |
| --- | --- | --- | --- |
| B-roll pulls | select-footage / ledger | asset ids from assemble-plan | no gen credits |
| UI states | UI kit / Flux flat | local stills or screen-record | regenerate if rubber-chrome |
| Optional bridge i2v | Wan / LTX / Kling | real id or skip | only if a beat has a hole |
| Edit + VO | CapCut + TTS | local | post owns type/logo/CTA |
| Connected (optional) | Seedance / Higgsfield | only if MCP called | never invent |

## Cost reconciliation

| Path | Credits | Outcome |
| --- | --- | --- |
| Bucket B-roll + CapCut | ~0 model | Full timed cut possible |
| UI still gen | low | Three states |
| Abandoned neon parallel | avoid | Classic trap |

## Claim firewall

- Study is **synthesis** — structure only; no invented call volume.  
- Proof on screen: ledger / `[PLACEHOLDER…]` only.

## Done checklist

- [x] Full 24s covered with hard cuts between setups  
- [x] Audio laid (ring + UI + bed)  
- [x] One CTA ≥3s · muted-first  
- [x] Footage selected by bucket (motion_confirmed)  
- [x] Log kept as transferable artifact  

See: `human-assembly-playbook.md` · `library/footage/RULE.md` · `finish-the-cut.md`
