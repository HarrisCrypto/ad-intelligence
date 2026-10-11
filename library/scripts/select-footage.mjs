#!/usr/bin/env node
/**
 * Selection by bucket — never by filename.
 *
 *   node library/scripts/select-footage.mjs --niche home-services --bucket hook_vehicle
 *   node library/scripts/select-footage.mjs --niche home-services --report
 *
 * Eligible = kind:video + reject:false + motion_confirmed:true + niche_fit high|med
 * If no pick: report gap (composer must i2v vetted still OR lower ceiling). Never substitute.
 */
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
function flag(name) {
  return process.argv.includes(name);
}

const niche = arg("--niche", "home-services");
const bucketId = arg("--bucket");
const reportMode = flag("--report");

const bucketsFile = path.join(LIB, "footage/buckets", `${niche}.json`);
const def = JSON.parse(fs.readFileSync(bucketsFile, "utf8"));
const ledger = JSON.parse(
  fs.readFileSync(path.join(LIB, "assets/license-ledger.json"), "utf8")
);

function exists(a) {
  return a.path && fs.existsSync(path.join(ROOT, a.path));
}

function eligible(a, bucket) {
  if (!exists(a)) return false;
  if (a.reject === true) return false;
  if (a.motion_confirmed !== true) return false;
  if (!["high", "med"].includes(a.niche_fit)) return false;
  const kindOk = a.kind === "video" || (a.kind === "footage" && a.media === "video");
  if (!kindOk) return false;
  if (/\.(jpe?g|png|webp)$/i.test(a.path)) return false;
  if (a.bucket && a.bucket !== bucket) return false;
  if (!a.bucket) {
    // legacy: do not auto-map by filename
    return false;
  }
  return a.niches?.includes(niche) || (a.tags || []).includes(niche);
}

function pickForBucket(bucket) {
  const pool = (ledger.assets || [])
    .filter((a) => eligible(a, bucket.id))
    .sort((a, b) => {
      const fit = { high: 2, med: 1 }[a.niche_fit] - { high: 2, med: 1 }[b.niche_fit];
      if (fit) return -fit;
      const mot = { high: 3, medium: 2, low: 1 }[a.motion] - { high: 3, medium: 2, low: 1 }[b.motion];
      if (mot) return -mot;
      return (b.height || 0) - (a.height || 0);
    });
  if (!pool.length) {
    return {
      bucket: bucket.id,
      priority: bucket.priority,
      ok: false,
      gap: true,
      must_depict: bucket.must_depict,
      chosen: null,
      why: "No eligible moving clip — report gap; i2v on vetted still OR lower ceiling. Never substitute a still.",
      fallback: "i2v_vetted_still_or_downgrade",
    };
  }
  const chosen = pool[0];
  return {
    bucket: bucket.id,
    priority: bucket.priority,
    ok: true,
    gap: false,
    chosen: {
      id: chosen.id,
      path: chosen.path,
      motion: chosen.motion,
      niche_fit: chosen.niche_fit,
      orientation: chosen.orientation,
      source: chosen.source,
    },
    why:
      chosen.select_why ||
      `Eligible video for ${bucket.id}: motion=${chosen.motion}, fit=${chosen.niche_fit}, ${chosen.orientation}`,
    alternates: pool.slice(1, 4).map((a) => a.id),
  };
}

const buckets = def.buckets || [];
if (reportMode || !bucketId) {
  const picks = buckets.map(pickForBucket);
  const p0Gaps = picks.filter((p) => p.gap && p.priority === "P0");
  const anyGaps = picks.filter((p) => p.gap);
  const ceiling =
    p0Gaps.length >= 3
      ? "designed_cards_on_void — P0 motion buckets missing; disclose before generate"
      : p0Gaps.length > 0 || anyGaps.length > 0
        ? "hybrid_gen_plus_stock — motion coverage incomplete; prefer i2v/USER_SUPPLIED"
        : "full_native_motion — eligible video per bucket";
  console.log(
    JSON.stringify(
      {
        niche,
        quality_ceiling: ceiling,
        p0_gaps: p0Gaps.map((p) => p.bucket),
        gaps: anyGaps.map((p) => p.bucket),
        picks,
        rule: "Select by bucket. Stills never fill footage slots.",
      },
      null,
      2
    )
  );
  process.exit(anyGaps.length ? 2 : 0);
}

const bucket = buckets.find((b) => b.id === bucketId);
if (!bucket) {
  console.error(JSON.stringify({ ok: false, error: `unknown bucket ${bucketId}` }));
  process.exit(1);
}
const pick = pickForBucket(bucket);
console.log(JSON.stringify(pick, null, 2));
process.exit(pick.ok ? 0 : 2);
