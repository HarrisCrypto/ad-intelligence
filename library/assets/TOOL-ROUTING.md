# Materials tool routing — free first, best quality, safe

Agents **must acquire or generate materials** before designing cards on a void. Use the highest rung you can actually run.

## Decision ladder (materials)

| Priority | Route | When | How |
| --- | --- | --- | --- |
| **0** | Ledger hit | Asset already in `license-ledger.json` | Reuse path — do not re-download |
| **1** | USER_SUPPLIED shoot | User has phone clips / brand assets | Copy into `library/footage/` or `private-cache/`, ledger `USER_SUPPLIED` |
| **2** | Free stock API | `PEXELS_API_KEY` / `PIXABAY_API_KEY` / `UNSPLASH_ACCESS_KEY` set | `acquire-assets.mjs --source pexels\|pixabay\|unsplash` |
| **3** | Wikimedia Commons | No keys — always available | `acquire-assets.mjs --source wikimedia` (PD / CC BY only by default) |
| **4** | Free GitHub packs | CC0/OFL repos | `acquire-assets.mjs --source github --repo …` |
| **5** | Connected image gen | Flux / SD / Higgsfield / etc. live | Use `library/realism/gen-recipes.json` prompts; ledger as generated |
| **6** | Connected / open video | Seedance → Wan → LTX → Grok → peers | [`alternative-model-routing.md`](../../skills/ad-intelligence/references/creative-stack/alternative-model-routing.md) |
| **7** | Disclose ceiling | Nothing usable | `assert-assets` → `designed_cards_on_void` — **tell the user before generate** |

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
# Uses Pexels if keyed, else Wikimedia
node library/scripts/fill-niche-gaps.mjs --niche home-services --limit 2

# Explicit free stills
node library/scripts/acquire-assets.mjs --source wikimedia \
  --query "HVAC technician working" --tag hvac-tech --niche home-services

# With Pexels (free API key)
PEXELS_API_KEY=… node library/scripts/acquire-assets.mjs --source pexels \
  --query "phone on desk night" --tag desk-phone --niche home-services --video
```

## Env keys (optional, free)

| Var | Get |
| --- | --- |
| `PEXELS_API_KEY` | https://www.pexels.com/api/ |
| `PIXABAY_API_KEY` | https://pixabay.com/api/docs/ |
| `UNSPLASH_ACCESS_KEY` | https://unsplash.com/developers |

No keys required for Wikimedia + already-seeded Mixkit/Incompetech assets.
