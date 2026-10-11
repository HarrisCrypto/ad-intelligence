#!/usr/bin/env node
/**
 * Per-niche asset-gap report — bucket-aware motion coverage (not filename matches).
 *
 *   node library/scripts/asset-gap-report.mjs --niche home-services
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIB = path.join(__dirname, "..");
const ROOT = path.join(LIB, "..");

function arg(name, def = null) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : def;
}

const niche = arg("--niche", "home-services");
const ledger = JSON.parse(
  fs.readFileSync(path.join(LIB, "assets/license-ledger.json"), "utf8")
);

const AUDIO_NEED = {
  "home-services": { music_bed: 1, sfx_phone: 1, sfx_ui: 1, ambience: 1 },
  saas: { music_bed: 1, sfx_ui: 1, ambience: 1 },
};

const need = AUDIO_NEED[niche] || AUDIO_NEED["home-services"];
const assets = ledger.assets || [];

function exists(a) {
  return fs.existsSync(path.join(ROOT, a.path));
}

const beds = assets.filter((a) => a.kind === "music_bed" && exists(a));
const sfx = assets.filter((a) => a.kind === "sfx" && exists(a));
const amb = assets.filter((a) => a.kind === "ambience" && exists(a));
const videos = assets.filter(
  (a) =>
    exists(a) &&
    a.reject !== true &&
    a.motion_confirmed === true &&
    (a.kind === "video" || (a.kind === "footage" && a.media === "video")) &&
    ["high", "med"].includes(a.niche_fit)
);

const phoneSfx = sfx.filter(
  (a) => (a.tags || []).includes("phone") || (a.niches || []).includes(niche)
);
const uiSfx = sfx.filter((a) =>
  (a.tags || []).some((t) => ["ui", "click", "notification"].includes(t))
);

const gaps = [];
if (beds.length < need.music_bed) {
  gaps.push({
    bucket: "music_bed",
    have: beds.length,
    need: need.music_bed,
    note: "No licensed bed → cannot claim music; SFX-only or USER_SUPPLIED",
  });
}
if (phoneSfx.length < (need.sfx_phone || 0)) {
  gaps.push({
    bucket: "sfx_phone",
    have: phoneSfx.length,
    need: need.sfx_phone,
    note: "Missed-call spots need ring/busy SFX",
  });
}
if (uiSfx.length < (need.sfx_ui || 0)) {
  gaps.push({ bucket: "sfx_ui", have: uiSfx.length, need: need.sfx_ui });
}
if (amb.length < need.ambience) {
  gaps.push({ bucket: "ambience", have: amb.length, need: need.ambience });
}

// Bucket report via select-footage (source of truth)
const sel = spawnSync(
  process.execPath,
  [path.join(__dirname, "select-footage.mjs"), "--niche", niche, "--report"],
  { encoding: "utf8" }
);
let selection = {};
try {
  selection = JSON.parse(sel.stdout || "{}");
} catch {
  selection = {};
}

const footageGaps = (selection.gaps || []).map((id) => {
  const pick = (selection.picks || []).find((p) => p.bucket === id);
  return {
    missing: id,
    priority: pick?.priority || "?",
    note:
      pick?.why ||
      "No eligible moving clip (kind:video + motion_confirmed + niche_fit). Never substitute a still.",
  };
});

const p0Gaps = (selection.p0_gaps || []).length;
const ceiling =
  selection.quality_ceiling ||
  (p0Gaps >= 3
    ? "designed_cards_on_void — P0 motion buckets missing; disclose before generate"
    : footageGaps.length > 0
      ? "hybrid_gen_plus_stock — motion coverage incomplete"
      : "full_native_motion — eligible video per bucket");

const report = {
  niche,
  ok: gaps.length === 0 && footageGaps.length === 0,
  quality_ceiling: ceiling,
  counts: {
    music_beds: beds.length,
    sfx: sfx.length,
    phone_sfx: phoneSfx.length,
    ambience: amb.length,
    eligible_videos: videos.length,
  },
  audio_gaps: gaps,
  footage_gaps: footageGaps,
  bucket_picks: selection.picks || [],
  have_audio_ids: [...beds, ...sfx, ...amb].map((a) => a.id),
  next_actions: [
    ...(footageGaps.length
      ? [
          "node library/scripts/acquire-footage.mjs --niche " + niche,
          "Or USER_SUPPLIED phone shoot for missing P0 buckets",
        ]
      : []),
    "node library/scripts/assert-assets.mjs --niche " + niche,
    "See library/footage/RULE.md",
  ],
  rule: "Stills never fill footage slots. Counting files ≠ correctness — select by bucket.",
};

console.log(JSON.stringify(report, null, 2));
process.exit(report.ok ? 0 : 2);
