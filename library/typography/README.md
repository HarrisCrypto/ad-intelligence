# Typography — provisioned faces (Phase 2.5 / B5.1)

Craft specs that name a font **must** resolve to a file here (or a recorded licensed substitute). Never silently fall back to Liberation without logging it.

## Shipped (OFL)

| Family | Files | License |
| --- | --- | --- |
| **Anton** | `fonts/anton/Anton-Regular.ttf` | `fonts/anton/OFL.txt` |
| **Poppins** | Regular / SemiBold / Bold | `fonts/poppins/OFL.txt` |
| **Inter Tight** | variable `InterTight[wght].ttf` | `fonts/inter-tight/OFL.txt` |

## Fallback map

See `fallback-map.json`. Rule: if the named face is missing on the host, install from this library into `~/.fonts` (or the compose font path) **before** render. Do not ship a frame that claims Anton while rendering Liberation.

```bash
# provision into user fontconfig
mkdir -p ~/.fonts
cp library/typography/fonts/anton/*.ttf ~/.fonts/
cp library/typography/fonts/poppins/*.ttf ~/.fonts/
cp library/typography/fonts/inter-tight/*.ttf ~/.fonts/
fc-cache -f
```

## Adding a face

1. Confirm license (OFL / SIL / explicit commercial grant).  
2. Drop files under `fonts/<slug>/` + `OFL.txt` or `LICENSE`.  
3. Update `fallback-map.json`.  
4. Never commit a face without a license file.
