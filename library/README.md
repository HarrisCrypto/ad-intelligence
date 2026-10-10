# Library — executable craft toolbox

Prose in `skills/.../references` teaches; **this tree ships files agents can execute**.

| Path | Status |
| --- | --- |
| [`typography/`](./typography/) | ✅ OFL Anton / Poppins / Inter Tight + fallback map (Gate 2.5) |
| [`sound/`](./sound/) | ✅ Voice tier ladder + bed rules (beds/SFX assets TBD) |
| [`transitions/`](./transitions/) | ✅ `catalog.json` — hard cut default for DR |
| [`camera/`](./camera/) | ✅ `catalog.json` |
| [`captions/`](./captions/) | ✅ presets + Meta/TikTok safe zones |
| [`lighting/`](./lighting/) | ✅ recipes |
| [`grades/`](./grades/) | ✅ locks (flat UI doc default for voice) |
| [`ui-kits/voice-agent-flat/`](./ui-kits/voice-agent-flat/) | ✅ 3-state kit + `preview.html` |
| [`templates/home-services-missed-call/`](./templates/home-services-missed-call/) | ✅ binds study cards → library ids |
| [`scripts/`](./scripts/) | ✅ `resolve-toolbox.mjs` · `demo-compose-plan.mjs` |

## Prove (Gate 3)

```bash
node library/scripts/resolve-toolbox.mjs --list
node library/scripts/resolve-toolbox.mjs tr_hard_cut cam_screen_ortho grade_flat_ui_doc
node library/scripts/demo-compose-plan.mjs --brand Oply
```

Open `library/ui-kits/voice-agent-flat/preview.html` for the three UI states.
