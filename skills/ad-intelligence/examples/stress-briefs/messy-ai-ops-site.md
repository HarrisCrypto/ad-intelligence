# Stress brief — AI / ops site (URL-style)

Simulate: user pastes a site and says “make me TikTok + Meta ads that don’t look like AI slop.”

## User message (messy)

> make ads for my AI thing oplyai.com — we answer phone calls for businesses after hours
> need tiktok and instagram and maybe twitter
> make it look expensive not like those fake robot ads
> also do a version for hair salons somehow? idk

## Agent must

1. Follow `prompts/brief-from-url.md` — gather offer; **do not invent** booking % or customer counts  
2. Niche → `saas` (voice agent); optional local angle as vertical example with Assumptions  
3. `retrieve.mjs --niche saas --platform tiktok --compact` → expect `am_voice_agent_missed` / UI aha models  
4. Open Attention Lab / public libraries — emulate timing, not competitor copy  
5. Steal density from `examples/voice-agent-front-desk.md` + `saas-demo-pas.md`  
6. Ship lint-clean package: Concept, ≥6 exact-VO rows, Craft HEX/fonts/motion/E1, one CTA  
7. Refuse neon-brain / “replaces your whole team” / invented “trusted by 10k”

## Hair salon branch (if pursued)

- That is a **vertical** of the same product, not a shampoo ad  
- Still `am_voice_agent_missed` + geo/specialty lines; proof stays PLACEHOLDER unless supplied  
- Do **not** switch to `am_hair_transform` unless the product is actually haircare

## Pass criteria

- Attention model id present  
- No leftover `[[BRACKETS]]`  
- `lint-package.mjs` → ok:true  
- Muted 0–3s = missed-call situation, not logo
