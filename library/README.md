# Library — executable craft toolbox

Prose in `skills/.../references` teaches; **this tree ships files agents can execute**.

| Path | Status |
| --- | --- |
| [`typography/`](./typography/) | ✅ OFL Anton / Poppins / Inter Tight + fallback map (Gate 2.5) |
| [`sound/`](./sound/) | ✅ Licensed beds + Mixkit SFX + room tone (ledgered) |
| [`assets/`](./assets/) | ✅ License ledger — no row, no ship |
| [`footage/`](./footage/) | ⚠ Gap — photographed moments not seeded yet |
| [`realism/`](./realism/) | ✅ Phone-native motion/grade/gen recipes |
| [`transitions/`](./transitions/) | ✅ `catalog.json` — hard cut default for DR |
| [`camera/`](./camera/) | ✅ `catalog.json` |
| [`captions/`](./captions/) | ✅ presets + Meta/TikTok safe zones |
| [`lighting/`](./lighting/) | ✅ recipes |
| [`grades/`](./grades/) | ✅ locks (flat UI doc default for voice) |
| [`ui-kits/voice-agent-flat/`](./ui-kits/voice-agent-flat/) | ✅ 3-state kit + `preview.html` |
| [`templates/home-services-missed-call/`](./templates/home-services-missed-call/) | ✅ binds study cards → library ids |
| [`templates/home-services-local-geo/`](./templates/home-services-local-geo/) | ✅ geo → phone CTA template |
| [`scripts/`](./scripts/) | ✅ `resolve-toolbox.mjs` · `demo-compose-plan.mjs` |

## Prove (Gate 3 + 2.6)

```bash
node library/scripts/resolve-toolbox.mjs --list
node library/scripts/demo-compose-plan.mjs --brand Oply
node library/scripts/asset-gap-report.mjs --niche home-services
node library/scripts/assert-assets.mjs --niche home-services
```

Open `library/ui-kits/voice-agent-flat/preview.html` for the three UI states.

**Materials rule:** if `assert-assets` lowers the ceiling, disclose it before generate. Studying more ads will not fill `footage/` gaps — see [`docs/PHASE-2.6-ASSET-REALISM.md`](../docs/PHASE-2.6-ASSET-REALISM.md).
