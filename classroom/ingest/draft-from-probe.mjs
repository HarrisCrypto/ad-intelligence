#!/usr/bin/env node
/**
 * Draft study-card skeleton from a local media probe (private-cache).
 * Does NOT scrape ad libraries. Does NOT commit media.
 *
 *   node classroom/ingest/draft-from-probe.mjs <media> --niche home-services --id draft-local-01
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const file = process.argv[2];
function arg(n) {
  const i = process.argv.indexOf(n);
  return i >= 0 ? process.argv[i + 1] : null;
}
if (!file || file.startsWith("-")) {
  console.error("Usage: draft-from-probe.mjs <media> --niche N --id ID");
  process.exit(1);
}
const niche = arg("--niche") || "home-services";
const id = arg("--id") || `draft-${Date.now()}`;

const probe = spawnSync(
  "ffprobe",
  ["-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", file],
  { encoding: "utf8" }
);
if (probe.status !== 0) {
  console.error(probe.stderr);
  process.exit(1);
}
const j = JSON.parse(probe.stdout);
const v = (j.streams || []).find((s) => s.codec_type === "video");
const duration = Number(j.format?.duration || 0);
const w = v?.width;
const h = v?.height;

const card = {
  id,
  status: "draft",
  source: {
    platform: "owned-or-private-cache",
    url_or_library_id: path.basename(file),
    accessed: new Date().toISOString().slice(0, 10),
    rights: "local-cache-ok",
    verified_via: "agent_runtime",
  },
  niche,
  format: "hybrid",
  structure: { format: "video_timed", timing_observable: true },
  duration_s: duration || null,
  aspect: h > w ? "9:16" : w > h ? "16:9" : "1:1",
  hook: {
    mechanism: "[FILL from watch]",
    first_second_description: "[FILL — photographed moment, not card]",
  },
  shots: [
    {
      t_start: 0,
      t_end: Math.min(3, duration || 3),
      purpose: "hook",
      recipe: "[FILL: handheld/phone/light/subject]",
      how_this_shot_was_made: "[FILL: measured from private-cache probe]",
      source: "model-estimate",
    },
  ],
  stats: {
    shot_count: null,
    loudness_lufs: null,
    stats_source: "probe-partial — run scene-detect + ebur128 for full stats",
    probe: { width: w, height: h, duration_s: duration },
  },
  audio: { note: "run loudness + list bed/sfx ids from ledger" },
  look: { note: "palette sample TBD" },
  cta: { primary: "[FILL]" },
  offer_and_proof: { offer: "[FILL]", proof: "[PLACEHOLDER]" },
  why_it_works: "[HUMAN CONFIRM REQUIRED]",
  steal: ["[FILL]"],
  what_not_to_copy: ["Competitor assets", "Invented proof"],
  tags: [niche, "draft", "ingest"],
  materials_ceiling: "unknown until footage/audio ledger checked",
};

const outDir = path.join("classroom/study-cards", niche);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${id}.json`);
fs.writeFileSync(out, JSON.stringify(card, null, 2) + "\n");
console.log(JSON.stringify({ ok: true, out, status: "draft" }, null, 2));
