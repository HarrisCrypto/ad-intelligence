# Materials quality rungs (honest ceiling)

State **`achieved_rung`** in every brief / compose plan. Free CC0 stock tops out below “we filmed your business.”

| Rung | Meaning | When |
| --- | --- | --- |
| `user_supplied_business` | Real footage of *this* business (desk phone, van livery, UI screen-record) | USER_SUPPLIED ledger rows pass motion+subject |
| `connected_i2v` | Seedance / Higgsfield (or peer MCP) available to fill thin buckets | Probe connected; use for identity-locked gaps |
| `open_i2v` | Wan 2.2 / LTX-2.5 / Grok / Kling i2v on **vetted stills** | No Seedance; video models exist |
| `competent_native_eligible` | All P0 buckets have eligible **moving** stock; ≥60% P0 picks are `ad_grade` | Best free Coverr/Mixkit/Pexels floor |
| `stock_motion_partial` | Some moving clips, P0 incomplete or not ad_grade | Disclose; prefer i2v / shoot |
| `designed_cards_on_void` | Stills-only or empty / rejected basket | **must_disclose_before_generate** |

## ad_grade clip (per pick)

A clip is `ad_grade` only if **all** hold:

1. `motion_confirmed: true` with continuous motion (not pan-of-still)  
2. Depicts the bucket subject (`niche_fit: high`, or `med` only for `product_screen` stock UI)  
3. Real person, hands, or real place when the bucket expects it (`people` / place buckets)  
4. No watermark/logo clutter, no diagram/illustration reject classes  
5. Modern era / region fit (no obvious wrong-era/region reject)

**P0 rollup:** `ad_grade_ok` requires every P0 bucket covered **and** ≥60% of covered P0 picks `ad_grade: true`.

## i2v rung (explicit)

When free stock is thin for a niche/bucket:

```text
1. select-footage → gap?
2. Prefer USER_SUPPLIED shoot
3. Else if Seedance/Higgsfield connected → connected_i2v (name tool)
4. Else if any i2v available → open_i2v on library/stills/ seed (vetted, not reject)
5. Else motion storyboard + disclose designed_cards_on_void / stock_motion_partial
```

Never put a still into a footage slot. Never claim `competent_native_eligible` if a diagram or still remains under `library/footage/`.

See: [`RULE.md`](./RULE.md) · `assert-assets.mjs` · `acquire-footage.mjs` · degradation-ladder.md
