# Sound — voice tiers + music bed rules (B5.1 / B5.3)

## Voice tier ladder (quality vs hardware)

| Tier | Engine | Hardware | When to use |
| --- | --- | --- | --- |
| **V0** | Platform default TTS | any | Never ship silently — disclose “low-quality default” and upgrade if possible |
| **V1** | Kokoro-82M (or peer open TTS) | CPU OK (~4 cores) | Default on CPU-only hosts |
| **V2** | Higher-quality hosted TTS (ElevenLabs etc.) | network + credits | When connected and budget allows |
| **V3** | Voice clone (Chatterbox-class) | **GPU required** | Only if probe reports GPU; otherwise state ceiling |

Probe must report the selected tier. A V0 export without disclosure fails the honesty bar.

## VO layout (B5.3)

Generate **per beat**, anchored to the timed script start times. Pad the track to full duration. A single blob that ends early (e.g. 16.9s for a 24s ad) is a **layout defect**.

## Music beds

A music bed must be a **real licensed audio asset** with an id in this index (when assets are added).  

**Fails:** sine tones, empty tracks, generated drones passed off as beds (`fm_sine_bed`).

Until licensed beds are added under `beds/`, agents must:

1. Use a user-supplied / platform-cleared bed and record license, **or**  
2. Mark `Audio laid in post: SFX-only — no bed (license pending)` and do not claim a music bed.

## SFX (planned)

Whoosh, hit, riser, pop, UI click, notification, typing — each with license. Prefer diegetic SFX matching the beat sheet Audio column.
