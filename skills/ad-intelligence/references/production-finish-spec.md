# Production finish spec — custom template for CapCut / post

Emit this block (or equivalent detail) inside every package’s **Craft system** / finish section so a human or agent editor can assemble a **branded custom template** without guessing.

Copy into the package under `### Craft system` → Finish / CapCut.

---

## Timeline skeleton (default 24s — adjust to script)

| Track | 0–2s | 2–8s | 8–16s | 16–20s | 20–24s |
| --- | --- | --- | --- | --- | --- |
| **V1 video** | Hook clip C1 | Body C2 | Product/UI C3 | Proof or deepen | Freeze / cut to E1 |
| **V2 overlays** | Hook card | — | Sparse callouts | — | Endcard plate |
| **A1 VO** | — | optional | optional | optional | — |
| **A2 bed** | under | under | under | under | soft out |
| **A3 SFX** | hit | — | product SFX | — | CTA tick |

Import order: keyframes/clips named `K1`, `C1`, … then `E1_endcard`.

---

## Typography plate (fill with brand or ASSUMED)

```yaml
type:
  hook_display:
    family: "[Brand display or Inter-alternative — name a real face, not 'bold font']"
    weight: 700–800
    size_9x16: "assumed ~64–72pt equiv"
    max_words: 7
    fill: "#FFFFFF"
    shadow_or_plate: "soft dark plate 40% or clean knockout"
  captions:
    family: "[Neutral sans]"
    weight: 600
    max_lines: 2
    safe_bottom: "12–18% from bottom"
  cta:
    family: same as hook or brand UI
    treatment: "pill button OR bold end line — pick one"
    copy: "[ONE CTA]"
  legal:
    size: smallest readable
    window: last 1.5–2s
```

Never ask the video model to render the wordmark. Place **SVG/PNG** on V2.

---

## Color & grade lock

```yaml
palette:
  dominant: "#______"
  support: "#______"
  accent: "#______"
  background_notes: "practical light / location texture — not flat gray"
grade:
  name: "clean daylight | cool clinical | warm tungsten | editorial contrast | flat UI doc"
  product_priority: "label always readable"
  avoid: "default purple glow, melted logos, plastic skin"
```

---

## Endcard module (E1) — design like a template component

```yaml
endcard:
  duration_s: 3–5
  layout: "logo top/mid · CTA mid · legal bottom"
  logo: "brand SVG — clear space ≥ 0.5× logo height"
  cta_primary: "[one]"
  optional_nap_or_url: "[USER_SUPPLIED or omit]"
  background: "solid brand or blurred last frame 8% — no new product morph"
  aspects:
    - { ratio: "9:16", comp: "E1_9x16" }
    - { ratio: "1:1", comp: "E1_1x1" }
    - { ratio: "16:9", comp: "E1_16x9", when: "youtube/ctv" }
```

---

## Aspect export matrix

| Ratio | Platform bias | Rule |
| --- | --- | --- |
| 9:16 | TikTok / Reels / Shorts | Master social; redesign titles if needed |
| 1:1 / 4:5 | Meta feed | Separate type layout — do not center-crop 9:16 |
| 16:9 | YouTube / CTV / site | Wider headroom; endcard re-centered |

---

## Loudness & captions

- Captions: burned **and** SRT sidecar when possible  
- VO -6 to -3 LUFS relative intent over bed (finisher adjusts)  
- Paid: original/licensed bed only  

---

## Assembler handoff checklist

- [ ] All `unit_id`s listed with real tool names  
- [ ] K-stills graded to palette before I2V  
- [ ] E1 built in Figma/Canva/CapCut from SVG  
- [ ] One CTA only on endcard  
- [ ] `render-qa.json` run or emitted  
- [ ] Package `Render status` honest (`NOT_RENDERED` until exports exist)  
