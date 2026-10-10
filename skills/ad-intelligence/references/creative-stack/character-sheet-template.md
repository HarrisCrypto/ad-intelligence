# Character / talent sheet template (identity lock)

Fill when the ad uses a recurring person, avatar, founder, or AI talent. Required for multi-shot consistency and Ad Multiplier cast swaps.

Mark unknowns `[PLACEHOLDER]`. Never invent celebrity likenesses or real people without rights.

---

## Identity

| Field | Value |
| --- | --- |
| Character name / role | e.g. “Maya — night-shift nurse UGC” |
| Real talent / AI / hybrid | |
| Age range (approx) | |
| Gender presentation | |
| Ethnicity / features notes | only as needed for lock — keep respectful |
| Rights / release on file? | yes / no / `[PLACEHOLDER]` |
| FTC / paid partnership | yes / n/a |

## Reference stills (multi-angle — Soul-ID style)

| Role | File / URL | Notes |
| --- | --- | --- |
| `face_front` | neutral, even light | Primary identity |
| `face_three_quarter` | ¾ smile / talk | Expression lock |
| `face_profile` | side | Optional but strong |
| `full_body` | wardrobe on | Silhouette |
| `wardrobe_detail` | outfit / props | Continuity |
| `action_still` | in-context pose | Optional |

**Minimum:** `face_front` + `face_three_quarter` (or one strong video still + face crop).

## Soul-ID / identity lock phrasing (copy into prompts)

```text
CHARACTER / SOUL-ID LOCK — match attached face references exactly.
Same person every frame: bone structure, eye shape/color, skin tone, hairline,
hair color/length/style, age, and distinguishing marks from face_front + face_three_quarter.
Do not drift to a different model, beauty-filter morph, or celebrity lookalike.
Wardrobe continuity: [describe]. Keep hands anatomically correct.
If audio lip-sync: match VO cadence; no uncanny over-smile.
```

## Wardrobe & setting continuity

| Spec | Value |
| --- | --- |
| Outfit | |
| Makeup / grooming | |
| Props always present | |
| Location / set | |
| Forbidden looks | e.g. no glam when brief is “raw UGC” |

## Voice (if VO or talking-head)

| Spec | Value |
| --- | --- |
| Tone | warm / dry / hype / clinical |
| Pace | ~wpm |
| Accent / dialect notes | |
| ElevenLabs voice id / style | `[PLACEHOLDER]` or omit |

## Consistency across variants

When running A/B or Ad Multiplier:

- **Keep locked:** face identity, product sheet, grade family  
- **May change one:** wardrobe color, background, hook line, age-adjacent cast (only with new sheet)

## Agent checklist

- [ ] Sheet filled or talent refs requested
- [ ] Soul-ID lock language in Seedance / UGC / Marketing Studio brief
- [ ] Rights / disclosure noted for paid use
- [ ] No celebrity deepfake without explicit license
