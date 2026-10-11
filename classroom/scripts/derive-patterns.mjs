#!/usr/bin/env node
/**
 * Aggregate observed cards → patterns per (niche × format).
 * Every pattern cites the card ids it came from. Counts, not opinions.
 *
 *   node classroom/scripts/derive-patterns.mjs
 *   node classroom/scripts/derive-patterns.mjs --niche home-services
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadCards,
  resolveFormat,
  canonicalNiche,
  NICHES,
} from "./lib-corpus.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "patterns");

function arg(n, d = null) {
  const i = process.argv.indexOf(n);
  return i >= 0 ? process.argv[i + 1] : d;
}

const onlyNiche = arg("--niche");
const cards = loadCards()
  .map((x) => x.card)
  .filter((c) => c.provenance?.observed === true)
  .filter((c) => c.status === "confirmed" || process.argv.includes("--include-draft"))
  .filter((c) => !onlyNiche || canonicalNiche(c.niche) === canonicalNiche(onlyNiche));

const groups = new Map();
for (const c of cards) {
  const niche = canonicalNiche(c.niche);
  const format = resolveFormat(c.format);
  const key = `${niche}__${format}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(c);
}

fs.mkdirSync(OUT, { recursive: true });
const written = [];

for (const [key, list] of groups) {
  const [niche, format] = key.split("__");
  const hookFreq = {};
  for (const c of list) {
    const m = c.hook?.mechanism || "unknown";
    if (/^\[FILL/i.test(m)) continue;
    hookFreq[m] = (hookFreq[m] || 0) + 1;
  }
  const pacing = list
    .filter((c) => c.stats?.cuts_per_10s != null)
    .map((c) => ({
      id: c.id,
      cuts_per_10s: c.stats.cuts_per_10s,
      first_cut_at_s: c.stats.first_cut_at_s,
      longest_hold_s: c.stats.longest_hold_s,
      loudness_lufs: c.stats.loudness_lufs,
    }));
  const meanCuts =
    pacing.length > 0
      ? pacing.reduce((a, p) => a + p.cuts_per_10s, 0) / pacing.length
      : null;
  const ctas = {};
  for (const c of list) {
    const t = c.cta?.primary || "unknown";
    if (/^\[FILL/i.test(t)) continue;
    ctas[t] = (ctas[t] || 0) + 1;
  }

  const pattern = {
    id: `pat_${niche}_${format}`,
    niche,
    format,
    n_cards: list.length,
    cites: list.map((c) => c.id),
    hook_frequency: hookFreq,
    pacing: {
      n: pacing.length,
      mean_cuts_per_10s: meanCuts != null ? +meanCuts.toFixed(2) : null,
      samples: pacing,
      source: "measured_aggregate",
    },
    cta_norms: ctas,
    caption_conventions: list
      .map((c) => c.look?.caption_style)
      .filter((x) => x && !/^\[FILL/i.test(x)),
    floor_note:
      list.length < (NICHES.floor?.min_observed_cards || 3)
        ? "thin — treat as directional, not normative"
        : "enough cards for directional norms",
    honest_limit:
      "Patterns teach assembly from real ads; they do not supply the brand's own material.",
  };

  const nicheDir = path.join(OUT, niche);
  fs.mkdirSync(nicheDir, { recursive: true });
  const out = path.join(nicheDir, `${format}.json`);
  fs.writeFileSync(out, JSON.stringify(pattern, null, 2) + "\n");
  written.push({ out, n: list.length, cites: pattern.cites });
}

console.log(
  JSON.stringify(
    {
      ok: true,
      groups: written.length,
      written,
      rule: "Every pattern cites cards. Counts, not opinions.",
    },
    null,
    2
  )
);
