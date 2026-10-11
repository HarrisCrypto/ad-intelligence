#!/usr/bin/env node
/**
 * Retrieve study cards for a niche/platform — gated on observed corpus floor.
 *
 *   node classroom/scripts/retrieve-cards.mjs --niche home-services --limit 5
 *   node classroom/scripts/retrieve-cards.mjs --niche saas   # refuses below floor
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadCards,
  nicheCoverage,
  canonicalNiche,
  resolveFormat,
  NICHES,
} from "./lib-corpus.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function args(argv) {
  const o = {
    niche: null,
    platform: null,
    limit: 5,
    includeDraft: false,
    allowBelowFloor: false,
    format: null,
  };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--niche") o.niche = argv[++i];
    else if (argv[i] === "--platform") o.platform = argv[++i];
    else if (argv[i] === "--limit") o.limit = Number(argv[++i]);
    else if (argv[i] === "--include-draft") o.includeDraft = true;
    else if (argv[i] === "--allow-below-floor") o.allowBelowFloor = true;
    else if (argv[i] === "--format") o.format = argv[++i];
  }
  return o;
}

const q = args(process.argv);
const all = loadCards().map((x) => x.card);

const coverage = q.niche
  ? nicheCoverage(q.niche, all)
  : {
      niche: null,
      floor_ok: true,
      ceiling: "no niche filter",
      achieved_rung: "unscoped",
      observed_count: all.filter((c) => c.provenance?.observed).length,
      formats: [],
      missing: [],
    };

if (q.niche && !coverage.floor_ok && !q.allowBelowFloor) {
  console.log(
    JSON.stringify(
      {
        ok: false,
        refused: true,
        reason: "observed_corpus_below_floor",
        must_disclose_before_generate: true,
        coverage,
        query: q,
        floor: NICHES.floor,
        hint:
          "Ingest real ads: node classroom/ingest/ingest-ad.mjs <media> --niche … — or pass --allow-below-floor and state the ceiling.",
      },
      null,
      2
    )
  );
  process.exit(2);
}

const nicheCanon = q.niche ? canonicalNiche(q.niche) : null;

const cards = all.filter((c) => (q.includeDraft ? true : c.status === "confirmed"));

function score(c) {
  let s = 0;
  if (nicheCanon && (c.niche === nicheCanon || (c.tags || []).includes(nicheCanon))) s += 5;
  if (q.platform && c.source?.platform === q.platform) s += 3;
  if (q.format && resolveFormat(c.format) === resolveFormat(q.format)) s += 4;
  if (c.provenance?.observed === true) s += 6;
  if ((c.tags || []).includes("technique")) s += 1;
  if (c.gold_fixture) s += 2;
  return s;
}

const ranked = cards
  .map((c) => ({ c, s: score(c) }))
  .filter((x) => x.s > 0 || !q.niche)
  .sort((a, b) => {
    if (b.s !== a.s) return b.s - a.s;
    // Prefer observed over synthesis when tied
    const ao = a.c.provenance?.observed ? 1 : 0;
    const bo = b.c.provenance?.observed ? 1 : 0;
    return bo - ao;
  })
  .slice(0, q.limit)
  .map((x) => x.c);

const observedInResult = ranked.filter((c) => c.provenance?.observed === true).length;

console.log(
  JSON.stringify(
    {
      ok: true,
      query: q,
      count: ranked.length,
      observed_in_result: observedInResult,
      coverage,
      ceiling: coverage.ceiling,
      achieved_rung: coverage.achieved_rung,
      cards: ranked.map((c) => ({
        id: c.id,
        niche: c.niche,
        format: c.format,
        structure: c.structure,
        provenance: c.provenance || { observed: false, basis: "undeclared" },
        hook: c.hook,
        stats: c.stats,
        recipe: c.recipe || null,
        steal: c.steal,
        what_not_to_copy: c.what_not_to_copy,
        gold_fixture: c.gold_fixture || null,
        linked_study_id: c.linked_study_id || null,
        why_it_works: c.why_it_works,
        status: c.status,
      })),
      rule: "Open steal + measured stats before writing beats. Emulate structure; never copy assets. State the ceiling.",
      honest_limit:
        "Real-ad corpus teaches assembly — it cannot manufacture the brand's own material. Ladder ends at USER_SUPPLIED → i2v → vetted stock.",
    },
    null,
    2
  )
);
