# Product sheet template (consistency lock)

**Hard rule:** Before product pixels generate, fill this sheet or mark `[REQUEST FROM USER]`.  
**Identity modes:** `pack` | `ui` | `place-service` | `multi-sku`.  
**Provenance:** every field tagged `USER_SUPPLIED` | `ASSET_VERIFIED` | `PLACEHOLDER` | `ASSUMED`.  
**No product pixels without refs** (asset ladder S2+). S0 → product-less units only.

**Reference quality bar:** reject lifestyle-only, low-res, or label-illegible stills for lock roles.

Inline the filled sheet in the package (not a 3-bullet summary).

```markdown
## Product sheet — [PRODUCT NAME / SKU]
- Identity mode: pack / ui / place-service / multi-sku
- Asset ladder: S0–S3

### Identity
- Official name: (…) [TAG]
- SKU / variant / colorway: (…) [TAG]
- Category / niche: (…) [TAG]
- One-line mechanism: (…) [TAG]

### Visual lock (ordered refs → image_references 1…n)
| # | Role | File / media_id | Notes | Tag |
| --- | --- | --- | --- | --- |
| 1 | Hero |  | Straight-on, true color |  |
| 2 | Label close-up |  | Readable type |  |
| 3 | ¾ silhouette |  |  |  |
| 4 | Macro / texture |  |  |  |
| 5 | In-hand / UI screen / facility exterior |  | mode-specific |  |

### Mode extras
- **ui:** real screenshots only — never invent dashboards; chrome/font from shot
- **place-service:** exterior, vehicle, WIP, NAP line (phone/geo USER_SUPPLIED or PLACEHOLDER)
- **multi-sku:** one colorway per generation unit

### Non-negotiable visual truths
- Shape / silhouette: (…) [TAG]
- Exact colors: (…) [TAG]
- Materials / finish: (…) [TAG]
- Label text that must stay legible: (…) [TAG]
- Forbidden morphs: (…)

### Do-not-generate claims
- Banned on-pack / on-screen claims:
- Regulated status: see claim-firewall.json

### Style lock
- Lighting / grade / backgrounds allowed & forbidden:

### Soul-ID
- Always looks like: …
- Never looks like: …
```

## Inject into unit prompts

```text
PRODUCT SHEET LOCK — Image 1=hero, Image 2=label, Image 3=¾. Sheet wins over free text.
[paste truths]
```
