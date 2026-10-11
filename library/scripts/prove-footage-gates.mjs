#!/usr/bin/env node
/**
 * Acceptance proofs for the footage pipeline — prove, don't claim.
 *
 *   node library/scripts/prove-footage-gates.mjs
 *
 * 1) Known still → vet-motion FAIL / still_in_footage_slot
 * 2) Known diagram-like still → vet-asset reject diagram_schematic or still_in_slot
 * 3) library/footage/home-services has videos only (no jpg/png)
 * 4) assert-assets returns ad_grade_ok + achieved_rung truthfully
 * 5) assemble-plan Oply/hvac card: every footage slot has moving clip; vet-motion PASS
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIB = path.join(__dirname, "..");
const ROOT = path.join(LIB, "..");
const FIX = path.join(__dirname, "qa/fixtures");
fs.mkdirSync(FIX, { recursive: true });

const proofs = [];

function run(args, opts = {}) {
  return spawnSync(process.execPath, args, {
    encoding: "utf8",
    cwd: ROOT,
    maxBuffer: 10 * 1024 * 1024,
    ...opts,
  });
}

// --- Fixture: tiny still JPG via ffmpeg ---
const stillPath = path.join(FIX, "known-still.jpg");
if (!fs.existsSync(stillPath)) {
  spawnSync(
    "ffmpeg",
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      "color=c=white:s=320x180:d=0.1",
      "-frames:v",
      "1",
      stillPath,
    ],
    { encoding: "utf8" }
  );
}

// --- Fixture: diagram-like high-white schematic PNG ---
const diagramPath = path.join(FIX, "known-diagram.png");
if (!fs.existsSync(diagramPath)) {
  spawnSync(
    "ffmpeg",
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      "color=c=0xF5F5F5:s=640x360:d=0.1",
      "-vf",
      "drawgrid=width=40:height=40:thickness=1:color=black@0.4,drawtext=text='HVAC SCHEMATIC':fontsize=28:fontcolor=black:x=120:y=160",
      "-frames:v",
      "1",
      diagramPath,
    ],
    { encoding: "utf8" }
  );
}

// Also use a real still from library/stills if present
const realStillDir = path.join(LIB, "stills/home-services");
let realStill = null;
if (fs.existsSync(realStillDir)) {
  realStill = fs
    .readdirSync(realStillDir)
    .find((n) => /\.jpe?g$/i.test(n));
  if (realStill) realStill = path.join(realStillDir, realStill);
}

// 1) Still rejected by vet-motion
{
  const r = run([path.join(__dirname, "qa/vet-motion.mjs"), "--json", stillPath]);
  let body = {};
  try {
    body = JSON.parse(r.stdout || "{}");
  } catch {
    body = {};
  }
  const ok = body.ok === false && (body.reject_classes || []).includes("still_in_footage_slot");
  proofs.push({
    id: "vet_motion_rejects_still",
    pass: ok,
    detail: { ok: body.ok, reject_classes: body.reject_classes, reason: body.reason },
  });
}

// 2) Diagram / still rejected by vet-asset for footage bucket
{
  const target = fs.existsSync(diagramPath) ? diagramPath : stillPath;
  const r = run([
    path.join(__dirname, "qa/vet-asset.mjs"),
    "--file",
    target,
    "--niche",
    "home-services",
    "--bucket",
    "hook_vehicle",
    "--title",
    "HVAC refrigeration diagram schematic",
    "--query",
    "diagram schematic",
  ]);
  let body = {};
  try {
    body = JSON.parse(r.stdout || "{}");
  } catch {
    body = {};
  }
  const classes = body.reject_classes || [];
  const ok =
    body.reject === true &&
    (classes.includes("still_in_footage_slot") ||
      classes.includes("diagram_schematic") ||
      classes.includes("off_subject"));
  proofs.push({
    id: "vet_asset_rejects_diagram_or_still",
    pass: ok,
    detail: { reject: body.reject, reject_classes: classes, niche_fit: body.niche_fit },
  });
}

// 2b) Real library still also rejected for footage slot
if (realStill) {
  const r = run([
    path.join(__dirname, "qa/vet-asset.mjs"),
    "--file",
    realStill,
    "--niche",
    "home-services",
    "--bucket",
    "hook_phone_ring",
    "--title",
    "desk phone still",
  ]);
  let body = {};
  try {
    body = JSON.parse(r.stdout || "{}");
  } catch {
    body = {};
  }
  proofs.push({
    id: "vet_asset_rejects_library_still",
    pass: body.reject === true && (body.reject_classes || []).includes("still_in_footage_slot"),
    detail: { path: realStill, reject_classes: body.reject_classes },
  });
}

// 3) footage/home-services videos only
{
  const dir = path.join(LIB, "footage/home-services");
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const videos = files.filter((f) => /\.(mp4|webm|mov)$/i.test(f));
  const stills = files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  proofs.push({
    id: "footage_dir_videos_only",
    pass: videos.length > 0 && stills.length === 0,
    detail: { videos: videos.length, stills: stills.length, files },
  });
}

// 4) assert-assets shape + ad_grade_ok
{
  const r = run([path.join(__dirname, "assert-assets.mjs"), "--niche", "home-services"]);
  let body = {};
  try {
    body = JSON.parse(r.stdout || "{}");
  } catch {
    body = {};
  }
  const hasBuckets =
    body.buckets?.P0 &&
    Array.isArray(body.buckets.P0.covered) &&
    Array.isArray(body.buckets.P0.missing);
  const ok =
    hasBuckets &&
    typeof body.achieved_rung === "string" &&
    typeof body.ad_grade_ok === "boolean" &&
    (body.basket_poison || []).length === 0 &&
    body.ad_grade_ok === true &&
    body.buckets.P0.missing.length === 0;
  proofs.push({
    id: "assert_assets_ad_grade_rung",
    pass: ok,
    detail: {
      ad_grade_ok: body.ad_grade_ok,
      achieved_rung: body.achieved_rung,
      P0: body.buckets?.P0,
      poison: body.basket_poison,
      exit: r.status,
    },
  });
}

// 5) Oply / hvac assemble-plan — moving footage in every footage slot + vet-motion
{
  const r = run([
    path.join(__dirname, "assemble-plan.mjs"),
    "--card",
    "hvac-missed-call-void-01",
    "--niche",
    "home-services",
  ]);
  let plan = {};
  try {
    plan = JSON.parse(r.stdout || "{}");
  } catch {
    plan = {};
  }
  const footageRows = (plan.timeline || []).filter((row) => row.footage_bucket);
  const allMoving = footageRows.every((row) => row.picture?.id && !row.picture?.gap);
  let motionPass = true;
  const motionDetails = [];
  for (const row of footageRows) {
    if (!row.picture?.path) {
      motionPass = false;
      continue;
    }
    const abs = path.join(ROOT, row.picture.path);
    const m = run([path.join(__dirname, "qa/vet-motion.mjs"), "--json", abs]);
    let body = {};
    try {
      body = JSON.parse(m.stdout || "{}");
    } catch {
      body = {};
    }
    motionDetails.push({
      bucket: row.footage_bucket,
      id: row.picture.id,
      motion_ok: !!body.ok,
      motion: body.motion,
    });
    if (!body.ok) motionPass = false;
  }
  proofs.push({
    id: "oply_assemble_moving_footage",
    pass: plan.ok && allMoving && motionPass && footageRows.length >= 3,
    detail: { gaps: plan.gaps, slots: footageRows.length, motionDetails },
  });
}

const allPass = proofs.every((p) => p.pass);
const report = {
  ok: allPass,
  gate: "prove-footage-gates",
  proofs,
  summary: allPass
    ? "ACCEPT — still/diagram rejected; footage videos only; assert ad_grade_ok; Oply plan uses moving clips"
    : "FAIL — see proofs[].pass false",
};
console.log(JSON.stringify(report, null, 2));
process.exit(allPass ? 0 : 1);
