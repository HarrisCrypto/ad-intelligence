# Product sheet template (consistency lock)

Fill **before** Seedance / Higgsfield / peer generation. Attach real photos when available. Mark unknowns `[PLACEHOLDER]` — never invent pack art, claims, or SKUs.

Agents must either (a) produce a filled sheet from user assets, or (b) request the missing stills before generating.

---

## Product identity

| Field | Value |
| --- | --- |
| Brand / SKU name | |
| Category / niche | |
| Variant / shade / size / flavor | |
| Primary benefit (one sentence) | |
| Forbidden claims | |
| Packaging type | bottle / tube / box / device / softpack / other |

## Reference stills (multi-angle — required for ecommerce)

Upload or path each file. Prefer true-color, label-legible, no heavy filters.

| Role | File / URL | Notes |
| --- | --- | --- |
| `product_hero` | front ¾ hero, true color | Primary identity lock |
| `product_front` | straight-on face | Label lock |
| `product_back` | back / ingredients panel | Optional if label matters |
| `product_side` | profile / thickness | Form factor lock |
| `product_detail` | macro of logo/texture/cap | Label close-up |
| `product_in_hand` | scale vs hand | Size truth |
| `product_open` | pour / open / UI on | Mechanism still |
| `packaging_context` | shelf / unbox | Optional lifestyle |

**Minimum for generate:** `product_hero` + `product_detail` (+ `product_in_hand` for size-sensitive SKUs).

## Visual lock language (copy into Seedance / Higgsfield)

```text
PRODUCT SHEET LOCK — use attached references as ground truth.
Keep exact silhouette, proportions, colorway, cap/lid, label layout, logo placement,
and material finish from product_hero + product_detail every frame.
Do not invent alternate packaging, fake badges, or extra SKUs.
Label text may soft-focus mid-motion but must not melt, gibberish, or rearrange.
No competitor lookalikes. No morphing between variants unless brief says so.
```

## Color & materials

| Spec | Value |
| --- | --- |
| Primary pack color(s) | hex or description |
| Accent / label color | |
| Material finish | matte / gloss / glass / metal / soft-touch |
| Lighting preference | daylight / soft beauty / hard product / cinematic |
| Do-not-grade | e.g. no teal-orange crush that shifts brand color |

## On-pack / UI text policy

- Render fine legal / nutrition / tiny UI in **post** (CapCut/endcard), not inside gen.
- Model may show **impression** of label; identity = shape + color + logo zone from refs.
- Endcard uses official logo SVG/PNG only.

## Proof & claims (honest)

| Item | Source | On-screen? |
| --- | --- | --- |
| Review / result | user-supplied or `[PLACEHOLDER]` | yes/no |
| Metric | user-supplied or `[PLACEHOLDER]` | yes/no |
| Certification | user-supplied or omit | yes/no |

## Agent checklist

- [ ] Sheet filled or gaps requested
- [ ] Multi-angle refs listed with roles matching Seedance YAML `references:`
- [ ] Lock language pasted into prompt / Higgsfield brief
- [ ] No invented proof or packaging
