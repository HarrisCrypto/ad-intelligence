#!/usr/bin/env node
/**
 * Aggregate genuinely observed cards → patterns per (niche × format).
 * Answers cuts / content / fonts-craft. Every pattern cites ad card ids.
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
import { isGenuinelyObserved } from "./observed-honesty.mjs";
import {
  isValidReferenceCard,
  isVideoFormat,
  isValidReferenceVideo,
} from "./reference-substance.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "patterns");

function arg(n, d = null) {
  const i = process.argv.indexOf(n);
  return i >= 0 ? process.argv[i + 1] : d;
}

function freq(items) {
  const m = {};
  for (const x of items) {
    if (!x || /^\[FILL/i.test(x)) continue;
    m[x] = (m[x] || 0) + 1;
  }
  return m;
}

const onlyNiche = arg("--niche");
const cards = loadCards()
  .map((x) => x.card)
  .filter((c) => isGenuinelyObserved(c))
  .filter((c) => c.status === "confirmed" || process.argv.includes("--include-draft"))
  .filter((c) => !onlyNiche || canonicalNiche(c.niche) === canonicalNiche(onlyNiche))
  // Video patterns must never learn pacing from archive.org films.
  .filter((c) =>
    isVideoFormat(c.format) ? isValidReferenceVideo(c) : isValidReferenceCard(c)
  );

const groups = new Map();
for (const c of cards) {
  const niche = canonicalNiche(c.niche);
  const format = resolveFormat(c.format);
  const key = `${niche}__${format}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(c);
}

// Wipe stale pattern files (incl. contaminated ugc/polished from archive films).
fs.mkdirSync(OUT, { recursive: true });
const wipeNiches = onlyNiche
  ? [canonicalNiche(onlyNiche)]
  : [...new Set(NICHES.niches.map((n) => n.id))];
for (const niche of wipeNiches) {
  const nicheDir = path.join(OUT, niche);
  if (!fs.existsSync(nicheDir)) continue;
  for (const f of fs.readdirSync(nicheDir).filter((x) => x.endsWith(".json"))) {
    fs.unlinkSync(path.join(nicheDir, f));
  }
}
const written = [];

for (const [key, list] of groups) {
  const [niche, format] = key.split("__");
  const pacingSamples = list
    .filter((c) => c.stats?.cuts_per_10s != null)
    .map((c) => ({
      id: c.id,
      cuts_per_10s: c.stats.cuts_per_10s,
      avg_shot_s: c.stats.avg_shot_s,
      first_cut_at_s: c.stats.first_cut_at_s,
      longest_hold_s: c.stats.longest_hold_s,
      loudness_lufs: c.stats.loudness_lufs ?? c.audio?.loudness_lufs,
    }));
  const mean = (arr, k) => {
    const xs = arr.map((x) => x[k]).filter((v) => v != null && !Number.isNaN(v));
    if (!xs.length) return null;
    return +(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2);
  };

  const beatOrders = list.map((c) =>
    (c.recipe?.beats || c.shots || [])
      .map((b) => b.purpose)
      .filter(Boolean)
      .join("→")
  );

  const pattern = {
    id: `pat_${niche}_${format}`,
    niche,
    format,
    n_cards: list.length,
    cites: list.map((c) => c.id),
    source_ids: list.map((c) => c.source?.url_or_library_id).filter(Boolean),
    cuts: {
      mean_cuts_per_10s: mean(pacingSamples, "cuts_per_10s"),
      mean_avg_shot_s: mean(pacingSamples, "avg_shot_s"),
      mean_first_cut_at_s: mean(pacingSamples, "first_cut_at_s"),
      mean_longest_hold_s: mean(pacingSamples, "longest_hold_s"),
      samples: pacingSamples,
      source: "measured_aggregate",
    },
    content: {
      hook_frequency: freq(list.map((c) => c.hook?.mechanism)),
      beat_order_frequency: freq(beatOrders),
      proof_placement: freq(
        list.map((c) => c.recipe?.proof || c.offer_and_proof?.proof)
      ),
      cta_wording: freq(list.map((c) => c.cta?.primary)),
      cta_timing_s: list
        .map((c) => ({ id: c.id, timing_s: c.cta?.timing_s }))
        .filter((x) => x.timing_s != null),
    },
    fonts_craft: {
      font_class_frequency: freq(list.map((c) => c.look?.font_class)),
      font_guess_frequency: freq(list.map((c) => c.look?.font_guess)),
      caption_style_frequency: freq(list.map((c) => c.look?.caption_style)),
      palette_samples: list
        .map((c) => ({ id: c.id, palette: c.look?.palette }))
        .filter((x) => Array.isArray(x.palette) && x.palette.length),
      grade_notes: freq(list.map((c) => c.look?.grade)),
      sfx_density: freq(
        list.map((c) => {
          const n = (c.shots || []).filter((s) => s.sfx).length;
          return n ? `sfx_shots:${n}` : null;
        })
      ),
    },
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
      rule: "cuts + content + fonts/craft; every pattern cites ad IDs.",
    },
    null,
    2
  )
);
