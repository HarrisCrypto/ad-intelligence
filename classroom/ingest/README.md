# Study-card ingest (Phase 2.6)

**Goal:** ad-library URL → draft card (shots, transcript, OCR, loudness, palette) → human confirms `why_it_works` → `confirmed`.

## Legal floor

- Competitor **media never enters git** (`classroom/README.md`).  
- Drafts may reference public library URLs + measured stats.  
- Local media only in `classroom/private-cache/` (gitignored).

## Planned pipeline

```text
URL / library id
  → download to private-cache (optional, rights-checked)
  → PySceneDetect (cuts) + Whisper (transcript) + OCR + loudness + palette
  → draft JSON under study-cards/<niche>/ with status:draft
  → human fills why_it_works + confirms recipe / how_this_shot_was_made
  → status:confirmed
```

Stub: `draft-from-probe.mjs` writes a draft skeleton from duration/probe only (no scrape). Full auto-ingest lands when scene-detect + whisper are provisioned in the environment.
