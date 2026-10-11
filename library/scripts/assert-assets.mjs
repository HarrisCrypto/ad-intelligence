#!/usr/bin/env node
/**
 * Hard gate: niche must have usable audio; footage gaps lower the ceiling loudly.
 *
 *   node library/scripts/assert-assets.mjs --niche home-services
 *   node library/scripts/assert-assets.mjs --niche home-services --strict-footage
 *
 * Exit 0 = audio OK (ceiling printed). Exit 1 = audio missing (block generate).
 * Exit 2 = audio OK but footage gaps (warn / lower ceiling). --strict-footage → exit 1 on footage gaps.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nicheIdx = process.argv.indexOf("--niche");
const niche = nicheIdx >= 0 ? process.argv[nicheIdx + 1] : "home-services";
const strictFootage = process.argv.includes("--strict-footage");

const r = spawnSync(
  process.execPath,
  [path.join(__dirname, "asset-gap-report.mjs"), "--niche", niche],
  { encoding: "utf8" }
);
let report;
try {
  report = JSON.parse(r.stdout || "{}");
} catch {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}

const audioBlock = (report.audio_gaps || []).length > 0;
const footageWarn = (report.footage_gaps || []).length > 0;

const out = {
  gate: "assert-assets",
  niche,
  quality_ceiling: report.quality_ceiling,
  audio_ok: !audioBlock,
  footage_complete: !footageWarn,
  audio_gaps: report.audio_gaps,
  footage_gaps: report.footage_gaps,
  must_disclose_before_generate: footageWarn || audioBlock,
  message: audioBlock
    ? "BLOCK: required audio assets missing — do not invent a music bed"
    : footageWarn
      ? `LOWER CEILING: ${report.quality_ceiling}`
      : "Assets OK for niche floor",
};

console.log(JSON.stringify(out, null, 2));

if (audioBlock) process.exit(1);
if (footageWarn && strictFootage) process.exit(1);
if (footageWarn) process.exit(2);
process.exit(0);
