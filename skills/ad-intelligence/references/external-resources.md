# External resources (curated — verified Oct 2026)

Use with [`creative-stack/degradation-ladder.md`](./creative-stack/degradation-ladder.md) and [`creative-stack/alternative-model-routing.md`](./creative-stack/alternative-model-routing.md). Always re-check live docs before commercial ship — models and licenses move.

---

## Video model routing

| Model | Role | Notes (Oct 2026) |
| --- | --- | --- |
| **Seedance 2.5** | Long single takes up to ~30s; strong cinematic prompt execution; up to ~30 reference images | API-only paths (BytePlus / platform peers). Prefer when connected (Rung 1). |
| **Veo 3.1** | Cinematic 4K shots with native audio; ~4–8s clips | Gemini API / Flow. Good Rung 2 body units. |
| **Kling 3.0** | Best value 1080p i2v; ~5–15s; daily free tier common; native audio | Strong Rung 2 when available. |
| **Wan 2.2** | **Best open-source default** — Apache 2.0, unrestricted commercial use on open weights | ~5B on ~8GB VRAM; ~14B needs ~24GB. ComfyUI native. **Prefer when Seedance unavailable.** |
| **LTX-2.5** | Native synced audio; fast self-host (~7s for a 10s clip); native 4K class | Free commercially under ~$10M revenue (confirm LICENSE). Strong open Rung 2. |
| **MiniMax H3** | Low-cost all-rounder; native stereo audio | **Community license excludes US / EU / UK / KR — flag region before use.** |
| **HunyuanVideo 1.5** | Solid motion | Check license for your region/entity. |
| **Grok Imagine 1.5** | I2V / T2V up to ~15s when xAI available | Name explicitly in render plan — not Seedance. |

**Agent default without Seedance/Higgsfield:** Wan 2.2 → LTX-2.5 → Grok Imagine → Kling/Veo/Runway peers → motion storyboard (Rung 3).

---

## Ad library resources

| Resource | Access | Use |
| --- | --- | --- |
| **Meta Ad Library** | Free; basic search often login-free | Structure only; note format (video vs static). Deep links in `ad-libraries.md`. |
| **TikTok Creative Center** | Free; trend / top ads | Hook velocity; partial free — login for more. |
| **Google Ads Transparency** | Free; login-free | Reliable when Meta/TikTok wall; often `search_text` (no invented 0–3s). |
| **Foreplay** | Paid | Best-in-class swipe file + AI tagging — structure steal only. |
| **Motion Array / Pexels** | Free tiers / stock | Footage + motion graphics — ledger licenses (`library/assets/`). |

Internal: `scripts/library-access.mjs` · `references/ad-libraries.md` · Attention Lab offline.

---

## Prompt craft resources

| Resource | Where |
| --- | --- |
| Seedance prompt contract | `creative-stack/seedance-prompt-contract.md` |
| Veo / Kling / Wan prompt styles | Extend Seedance contract habits: camera + light + physics; **no model-drawn CTA type**; I2V start-frame lock for product |
| Higgsfield Marketing Studio patterns | `creative-stack/higgsfield-playbook.md` |
| Style → prompt mapping | `creative-stack/style-selection-engine.md` |
| Gen recipes (phone-native) | `library/realism/gen-recipes.json` |
| Assembler prompts | `creative-stack/assembler-pipeline.md` · `prompt-recipes.md` |

### Prompt style cheat (non-Seedance)

| Model | Style tip |
| --- | --- |
| **Wan 2.2** | Prefer I2V; “no logo redraw / no new text”; 3–5s units |
| **LTX-2.5** | Shot size + lens + move + light; light SFX cues OK; captions in post |
| **Kling** | Start-frame lock; readable product; avoid regenerating endcard type |
| **Veo** | Cinematic brevity; native audio optional; still finish captions/CTA in post |
| **Grok Imagine** | Still as first frame; motion + light only |

---

## Safety

- Never invent CTR/ROAS from library browsing.  
- MiniMax H3 geo license exclusion must be stated when recommending it.  
- LTX revenue cliff — confirm LICENSE for the shipping entity.  
- Stock footage → `license-ledger.json` or do not ship.
