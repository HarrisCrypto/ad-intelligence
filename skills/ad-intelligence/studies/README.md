# Studies — observe → emulate structure → build like a human

**Mission:** Any LLM, any harness, one-shot ads for any company — grounded in how viral TikTok, high-performing paid, and top-tier brand films **actually work**, without copying brands or scraping media.

| Layer | What | Where |
| --- | --- | --- |
| **Grammar** | 47 patterns, hooks, niches | `database/` |
| **Studies (public)** | Archetypal teardowns + when to emulate + human build steps | `studies/corpus.json` |
| **Live research** | Meta / TikTok / X / YouTube public libraries | `references/ad-libraries.md` |
| **Private corpus** | Your real-ad breakdowns (never commit media) | `studies/private/` (gitignored) |
| **Method** | Playbooks + **build-log artifact** | `human-build-os.md` · `human-build-log.template.md` |
| **Ingest** | Validate → normalize → write private | `scripts/ingest-blueprint.mjs` |

## Provenance (hard rule)

Every study **must** carry:

```json
"provenance": {
  "observed": false,
  "basis": "synthesis",
  "claim_firewall": "STRUCTURE_ONLY — …"
}
```

| `basis` | Meaning | May cite as proof? |
| --- | --- | --- |
| `synthesis` | Distilled archetype (public corpus) | **No** — structure only |
| `ad-library` | Human watched a public-library ad | Structure yes; never invent CTR |
| `named-campaign` | Named teardown (private) | Structure yes; never paste lines |
| `owned-ad` | Your brand’s ad | Yes for your metrics if true |

**Public corpus is intentionally 100% `synthesis` / `observed:false`.** Observed / named-campaign / owned-ad studies are **private** via `ingest-blueprint.mjs` → `studies/private/` after a real library watch. Do not invent public “observed” rows.

### `structure.format` (required)

| format | timing_observable | Meaning |
| --- | --- | --- |
| `video_timed` | `true` | Seconds / motion / audio were (or are) part of the structure |
| `search_text` | `false` | Static search / RSA — **not** 0–3s video |
| `display_static` | `false` | Static display |
| `carousel_static` | `false` | Card carousel without timed AV |
| `unknown` | usually `false` | Do not invent timing |

Retrieve projects `format`, `timing_observable`, `observed_limits`, and `structure.format_note` for non-video. Gates assert `search_text` is not silently video-shaped.

Retrieve **surfaces** `provenance` on every item. **Lint enforces it:** `lint-package.mjs` fails `study-synthesis-cited-as-proof` / `study-provenance-undeclared` if a package launders synthesis into observed evidence (see `examples/lint-corpus/fail-study-synthesis-as-proof.md`).

## Agent loop

```text
retrieve → pick study + attention model (copy provenance into package)
→ research_where (optional 10 min in public libraries)
→ emulate structure for THIS brand
→ human_build playbook + fill human-build LOG artifact
→ finish-the-cut → lint
```

## Join rule (patterns ⊕ studies)

- **Patterns** = grammar + tool routes  
- **Studies** = emulate jobs + playbook (check provenance)  
- **Attention models** = timing sheets  
- If `study.pattern_ids` miss `picks.primary`: use study beats for the script, pattern route for the stack — note the conflict. Retrieve returns `studies.join`.

## Add a private study

```bash
# From AdBlueprint notes (see ../../ingest/sample-ingest.json — needs provenance)
node scripts/ingest-blueprint.mjs ../../ingest/sample-ingest.json --write

# Or from study-shaped JSON
cp studies/private.example.json /tmp/my.json
# edit; set provenance.observed + basis
node scripts/ingest-blueprint.mjs /tmp/my.json --write

node scripts/retrieve.mjs --niche saas --platform tiktok --compact
# payload.studies includes private when valid; invalid files → errors + exit 3
```

## Prove any harness (not only Cursor)

On `main`:

```bash
git clone https://github.com/HarrisCrypto/ad-intelligence.git
cd ad-intelligence/skills/ad-intelligence
node scripts/fresh-clone-prove.mjs
node scripts/demo-quality-gates.mjs
```
