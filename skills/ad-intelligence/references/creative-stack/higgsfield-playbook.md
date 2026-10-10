# Higgsfield playbook (connected OR handoff)

If **Higgsfield MCP** is available → follow `connected-run-protocol.md` and **call tools**.  
If not → emit the same **Render plan** as paste-handoff (`render-plan.md`).

## Do not

- Pass Seedance handoff YAML with fake roles (`product_hero`, local file paths) into `generate_video`
- Claim “rendered” without job ids
- Use UGC/testimonial workflows to invent fake customers
- Resubmit the same generate after a transport timeout

## Always start here

1. Unsure → `get_workflow_instructions` (no args) or named workflow.
2. Model choice → `models_explore(action:'recommend'| 'get')` — trust live envelope.
3. Build **Render plan** units before any spend.

## Route by ad job

| User wants | Tools | Notes |
| --- | --- | --- |
| Static Meta/IG | `ads_studio_quote` → `ads_studio_generate` | Brand from URL or prompt |
| UGC / unboxing / tutorial | workflow `ugc-video` / Marketing Studio | One format; sheets first |
| Multiply winner | `ad-multiplier` | Edit vs Recreate; 4–30s source |
| Packshots / stills | `product-photoshoot` | Then video units |
| Custom Seedance cinema | `generate_video` + `seedance_2_5` | Real roles + media ids |
| Product swap in winning ad | `hf_mult_replace_object` | After a winner exists |
| Testimonials | **Owned footage** + `video-montage` | `real_footage_only` |
| Captions / assemble | `video-montage` / CapCut | |
| Faceless explainer | `faceless-video` | Not product UGC |

## Seedance inside Higgsfield

- Prefer `seedance_2_5`; probe before assuming duration/resolution defaults
- Peers: `kling3_0` (multi-shot short), `marketing_studio_video` (explicit 9:16!), `grok_video_v15`, etc.
- Slot map + prompts: `seedance-prompt-contract.md` + `render-plan.md`

## Consistency

1. Product + character sheets with provenance  
2. Upload → media ids → `image_references` order 1…n  
3. Sheet wins over free text  
4. Ad Multiplier: lock same sheet; change one variable  

## Handoff block (no MCP)

```markdown
### Higgsfield / Seedance handoff
- Follow Render plan units in the package
- Upload: hero, label, ¾, face, logo
- Model: seedance_2_5 (or …)
- Aspect 9:16 (+ 16:9 twin as separate generate)
- After: CapCut captions → one CTA → rights/disclosure
```
