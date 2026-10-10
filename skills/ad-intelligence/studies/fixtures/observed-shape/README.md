# Observed study shape (fixture — not public corpus)

Public `studies/corpus.json` is **100% synthesis**. Observed / ad-library / named-campaign / owned-ad rows are **private** after a real watch:

```bash
# 1) Watch an ad in Meta Ad Library / TikTok Creative Center (browser)
# 2) Fill notes as AdBlueprint or study JSON with provenance.observed:true
# 3) Validate + write (gitignored):
node scripts/ingest-blueprint.mjs path/to/notes.json --write
```

`example-observed-ad-library.json` here is a **shape fixture** for tooling tests — not a claim that we watched a named campaign. Do not put it in the public corpus.
