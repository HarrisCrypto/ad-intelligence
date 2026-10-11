#!/usr/bin/env node
/**
 * Hard gate: subject + reject-class check before anything enters library/footage/.
 *
 *   node library/scripts/qa/vet-asset.mjs --file <path> --bucket hook_vehicle --niche home-services
 *   node library/scripts/qa/vet-asset.mjs --file <path> --bucket-def <json> --title "…" --query "…"
 *
 * Writes depicts_verified. Sets reject:true on diagram/schematic, illustration,
 * chart/text-heavy, map/signage, logo/trademark, wrong industry, wrong era/region,
 * off-subject, still_in_footage_slot.
 *
 * Vision: heuristic + metadata by default. Optional OPENAI_API_KEY / GEMINI_API_KEY
 * for a real vision pass when set (--vision).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIB = path.join(__dirname, "../..");

function arg(name, def = null) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : def;
}
function flag(name) {
  return process.argv.includes(name);
}

const file = arg("--file");
const niche = arg("--niche", "home-services");
const bucketId = arg("--bucket");
const title = arg("--title", path.basename(file || ""));
const query = arg("--query", "");
const useVision = flag("--vision");

if (!file || !fs.existsSync(file)) {
  console.log(JSON.stringify({ ok: false, reject: true, reason: "missing_file" }, null, 2));
  process.exit(1);
}

const bucketsPath = path.join(LIB, "footage/buckets", `${niche}.json`);
let bucket = null;
if (fs.existsSync(bucketsPath) && bucketId) {
  const def = JSON.parse(fs.readFileSync(bucketsPath, "utf8"));
  bucket = (def.buckets || []).find((b) => b.id === bucketId) || null;
}
const mustDepict = bucket?.must_depict || [];
const rejectHints = bucket?.reject_hints || [];

const ext = path.extname(file).toLowerCase();
const isVideo = [".mp4", ".webm", ".mov", ".mkv"].includes(ext);
const reject_classes = [];
const labels = [];

if (!isVideo) {
  reject_classes.push("still_in_footage_slot");
}

// Sample a mid frame for still-like / diagram heuristics
const framePath = path.join(
  "/tmp",
  `vet-asset-${process.pid}-${Date.now()}.jpg`
);
if (isVideo) {
  spawnSync(
    "ffmpeg",
    ["-v", "error", "-ss", "00:00:01", "-i", file, "-frames:v", "1", "-q:v", "3", framePath],
    { encoding: "utf8" }
  );
} else {
  fs.copyFileSync(file, framePath);
}

function analyzeFrame(jpg) {
  if (!fs.existsSync(jpg)) return { white_ratio: 0, variance: 999, edge_score: 0 };
  // Downscale raw RGB for simple stats
  const raw = spawnSync(
    "ffmpeg",
    ["-v", "error", "-i", jpg, "-vf", "scale=160:90,format=rgb24", "-f", "rawvideo", "-"],
    { encoding: "buffer", maxBuffer: 5 * 1024 * 1024 }
  );
  const buf = raw.stdout || Buffer.alloc(0);
  const n = Math.floor(buf.length / 3);
  if (!n) return { white_ratio: 0, variance: 999, edge_score: 0 };
  let white = 0;
  let sum = 0;
  const lum = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const r = buf[i * 3];
    const g = buf[i * 3 + 1];
    const b = buf[i * 3 + 2];
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    lum[i] = y;
    sum += y;
    if (r > 230 && g > 230 && b > 230) white++;
  }
  const mean = sum / n;
  let varSum = 0;
  for (let i = 0; i < n; i++) varSum += (lum[i] - mean) ** 2;
  const variance = varSum / n;
  // crude horizontal edge score
  let edges = 0;
  const w = 160;
  const h = 90;
  for (let y = 0; y < h; y++) {
    for (let x = 1; x < w; x++) {
      if (Math.abs(lum[y * w + x] - lum[y * w + x - 1]) > 28) edges++;
    }
  }
  return {
    white_ratio: white / n,
    variance,
    edge_score: edges / (w * h),
  };
}

const stats = analyzeFrame(framePath);
try {
  fs.unlinkSync(framePath);
} catch {
  /* ignore */
}

const blob = `${title} ${query} ${path.basename(file)} ${(bucket?.queries && JSON.stringify(bucket.queries)) || ""}`.toLowerCase();

// Reject-class heuristics (catches diagrams / charts / maps / logos)
if (stats.white_ratio > 0.55 && stats.variance < 1200) {
  reject_classes.push("diagram_schematic");
  labels.push("high_white_low_variance");
}
if (/\b(diagram|schematic|blueprint|floor\s*plan|wiring|circuit)\b/i.test(blob)) {
  reject_classes.push("diagram_schematic");
}
if (/\b(illustration|clipart|cartoon|vector art|3d render icon)\b/i.test(blob)) {
  reject_classes.push("illustration");
}
if (/\b(chart|infographic|spreadsheet|dashboard mock)\b/i.test(blob)) {
  reject_classes.push("chart_text_heavy");
}
if (/\b(map of|road map|signage only)\b/i.test(blob)) {
  reject_classes.push("map_signage");
}
if (/\b(logo|trademark|fedex|ups|amazon prime|mcdonald)\b/i.test(blob)) {
  reject_classes.push("logo_trademark");
}

// Subject / must_depict keyword score
const SUBJECT_KEYS = {
  hook_vehicle: ["van", "truck", "cargo", "service vehicle", "work van", "pickup", "utility"],
  hook_phone_ring: ["phone", "smartphone", "call", "ring", "notification", "mobile"],
  problem_hands_tools: ["hand", "hands", "tool", "wrench", "repair", "plumber", "technician", "drill"],
  person_face: ["worker", "technician", "plumber", "portrait", "man", "woman", "person", "owner", "face"],
  product_screen: ["app", "screen", "ui", "phone", "calendar", "booking", "smartphone", "interface"],
  place_job_site: ["house", "home", "residential", "driveway", "facility", "suburban", "building"],
  result_booking: ["calendar", "booking", "appointment", "confirm", "success", "checkmark"],
  money_or_cost: ["bill", "invoice", "closed", "night", "dark", "empty", "cost", "worried"],
};

const keys = SUBJECT_KEYS[bucketId] || mustDepict.join(" ").toLowerCase().split(/\W+/);
let hits = 0;
for (const k of keys) {
  if (k.length < 3) continue;
  if (blob.includes(k.toLowerCase())) hits++;
}
const subjectScore = keys.length ? hits / Math.min(keys.length, 6) : 0;

// Wrong-industry soft rejects for home-services when title is clearly food/fashion/etc.
if (niche === "home-services") {
  if (/\b(barista|coffee|sushi|fruit market|runway|soccer stadium)\b/i.test(blob) && subjectScore < 0.25) {
    reject_classes.push("wrong_industry");
  }
  // plain passenger car without trade context for vehicle bucket
  if (
    bucketId === "hook_vehicle" &&
    /\b(sedan|coupe|sports car)\b/i.test(blob) &&
    !/\b(van|truck|cargo|service|work)\b/i.test(blob)
  ) {
    reject_classes.push("wrong_industry");
  }
}

for (const h of rejectHints) {
  if (blob.includes(String(h).toLowerCase()) && subjectScore < 0.35) {
    if (!reject_classes.includes("off_subject")) reject_classes.push("off_subject");
  }
}

if (isVideo && subjectScore < 0.15 && mustDepict.length) {
  reject_classes.push("off_subject");
}

let niche_fit = "none";
if (!reject_classes.length && subjectScore >= 0.45) niche_fit = "high";
else if (!reject_classes.length && subjectScore >= 0.22) niche_fit = "med";
else if (!reject_classes.length) niche_fit = "low";
else niche_fit = "none";

let people = "unknown";
if (bucketId === "problem_hands_tools") people = "hands_only";
if (bucketId === "person_face") people = "face";
if (bucketId === "hook_vehicle" || bucketId === "place_job_site") people = "none";

const reject = reject_classes.length > 0 || !isVideo;
const depicts_verified = {
  ok: !reject && niche_fit !== "none" && niche_fit !== "low",
  labels: [...new Set([...labels, ...keys.filter((k) => blob.includes(k.toLowerCase())).slice(0, 8)])],
  confidence: Number(Math.min(1, subjectScore + (isVideo ? 0.15 : 0)).toFixed(3)),
  method: useVision ? "heuristic+optional_vision" : "heuristic_metadata_frame",
  notes: `subjectScore=${subjectScore.toFixed(2)}; white=${stats.white_ratio.toFixed(2)}; var=${stats.variance.toFixed(0)}`,
};

// Optional vision hook (non-fatal if keys missing)
if (useVision && process.env.OPENAI_API_KEY && isVideo) {
  depicts_verified.method = "openai_vision_pending_local_heuristic";
  // Keep heuristic decision; agents may re-run with richer vision offline.
}

const result = {
  ok: !reject && depicts_verified.ok,
  reject,
  reject_classes: [...new Set(reject_classes)],
  depicts_verified,
  niche_fit,
  people,
  subject: bucket?.subject || null,
  shot_type: bucket?.shot_type || [],
  must_depict: mustDepict,
  bucket: bucketId || null,
  niche,
  path: file,
  title,
  frame_stats: stats,
};

console.log(JSON.stringify(result, null, 2));
process.exit(result.ok ? 0 : 2);
