#!/usr/bin/env node
/**
 * Hard gate: subject + reject-class check before anything enters library/footage/.
 *
 *   node library/scripts/qa/vet-asset.mjs --file <path> --bucket hook_vehicle --niche home-services
 *
 * Strong positives required per bucket. Negative keywords hard-fail.
 * Exit 0 = pass. Exit 2 = reject.
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

const file = arg("--file");
const niche = arg("--niche", "home-services");
const bucketId = arg("--bucket");
const title = arg("--title", path.basename(file || ""));
const query = arg("--query", "");

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

const ext = path.extname(file).toLowerCase();
const isVideo = [".mp4", ".webm", ".mov", ".mkv"].includes(ext);
const reject_classes = [];
const labels = [];

if (!isVideo) reject_classes.push("still_in_footage_slot");

const blob = `${title} ${query} ${path.basename(file)}`.toLowerCase();

/** Strong positives: at least one REQUIRED token family must match */
const BUCKET_RULES = {
  hook_vehicle: {
    require_tokens: ["van", "truck", "freight", "cargo"],
    forbid: [
      "bicycle",
      "bike",
      "cyclist",
      "scooter",
      "motorcycle",
      "sedan",
      "coupe",
      "sports car",
      "photographer",
      "workout",
      "gym",
      "barista",
      "coffee",
      "surf",
      "camper",
      "couple",
      "kiss",
      "beach",
      "romance",
      "combi",
      "drone",
      "plane",
      "boat",
    ],
    people: "none",
  },
  hook_phone_ring: {
    require_tokens: ["phone", "smartphone", "mobile", "cellphone", "call"],
    forbid: ["laptop only", "desktop monitor", "tablet drawing", "game controller"],
    people: "unknown",
  },
  problem_hands_tools: {
    // tools + trade context OR hands+tools — titles often omit the word "hands"
    require_any_groups: [
      [
        "tool",
        "tools",
        "wrench",
        "drill",
        "hammer",
        "screwdriver",
        "pliers",
        "pipe",
        "repair",
        "plumber",
        "electrician",
        "technician",
        "carpenter",
        "workshop",
        "sanding",
        "saw",
        "welding",
      ],
    ],
    forbid: [
      "weed",
      "cannabis",
      "cigarette",
      "makeup",
      "nail polish",
      "cooking",
      "chef",
      "ring off",
      "wedding ring",
      "jewelry",
      "telescope",
      "mixer controller",
    ],
    people: "hands_only",
  },
  person_face: {
    require_any_groups: [
      ["worker", "workers", "technician", "plumber", "electrician", "contractor", "builder", "builders", "tradesman", "mechanic", "carpenter"],
    ],
    forbid: [
      "crowd stadium",
      "celebrity",
      "runway",
      "fashion model",
      "influencer haul",
      "aerial",
      "drone",
      "skyline",
      "blueprint only",
      "buildings under construction",
      "time lapse",
    ],
    people: "face",
  },
  product_screen: {
    require_tokens: ["app", "screen", "calendar", "booking", "schedule", "appointment", "interface", "tablet", "typing", "texting", "smartphone"],
    forbid: [
      "neon cockpit",
      "crypto chart",
      "stock trading terminal",
      "worried woman talking",
      "urban call",
      "telephone booth",
    ],
    people: "hands_only",
  },
  place_job_site: {
    require_tokens: [
      "house",
      "home",
      "residential",
      "driveway",
      "suburban",
      "cottage",
      "apartment building",
      "garage",
      "front yard",
    ],
    forbid: ["skyline only", "map of", "floorplan", "diagram"],
    people: "none",
  },
  result_booking: {
    require_tokens: ["calendar", "booking", "appointment", "confirm", "schedule", "checkmark", "success"],
    forbid: ["crypto", "stock chart", "roi dashboard"],
    people: "unknown",
  },
  money_or_cost: {
    require_tokens: [
      "bill",
      "bills",
      "invoice",
      "closed",
      "shutter",
      "dark shop",
      "empty store",
      "worried",
      "stressed",
      "receipt",
    ],
    forbid: ["money rain", "crypto", "casino", "gold coins falling"],
    people: "unknown",
  },
};

const rules = BUCKET_RULES[bucketId] || { require_tokens: [], forbid: [] };

function hasToken(tok) {
  const t = tok.toLowerCase();
  // word-ish match
  return new RegExp(`(?:^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:[^a-z0-9]|$)`).test(
    blob
  );
}

for (const f of rules.forbid || []) {
  if (blob.includes(f.toLowerCase())) {
    reject_classes.push(f.includes("diagram") ? "diagram_schematic" : "wrong_industry");
    labels.push(`forbid:${f}`);
  }
}

let positive = false;
if (rules.require_any) {
  // any of the phrase lists
  positive = rules.require_any.some((phraseParts) => phraseParts.every((p) => blob.includes(p)));
}
if (!positive && rules.require_tokens?.length) {
  positive = rules.require_tokens.some((t) => hasToken(t) || blob.includes(t));
}
if (!positive && rules.require_any_groups) {
  positive = rules.require_any_groups.every((group) =>
    group.some((t) => hasToken(t) || blob.includes(t))
  );
}

if (!positive && mustDepict.length && isVideo) {
  reject_classes.push("off_subject");
  labels.push("missing_strong_positive");
}

// Frame heuristics for diagrams
const framePath = path.join("/tmp", `vet-asset-${process.pid}.jpg`);
if (isVideo) {
  spawnSync(
    "ffmpeg",
    ["-v", "error", "-ss", "00:00:01", "-i", file, "-frames:v", "1", "-q:v", "3", framePath],
    { encoding: "utf8" }
  );
} else if (fs.existsSync(file)) {
  try {
    fs.copyFileSync(file, framePath);
  } catch {
    /* ignore */
  }
}

function analyzeFrame(jpg) {
  if (!fs.existsSync(jpg)) return { white_ratio: 0, variance: 999 };
  const raw = spawnSync(
    "ffmpeg",
    ["-v", "error", "-i", jpg, "-vf", "scale=160:90,format=rgb24", "-f", "rawvideo", "-"],
    { encoding: "buffer", maxBuffer: 5 * 1024 * 1024 }
  );
  const buf = raw.stdout || Buffer.alloc(0);
  const n = Math.floor(buf.length / 3);
  if (!n) return { white_ratio: 0, variance: 999 };
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
  return { white_ratio: white / n, variance: varSum / n };
}

const stats = analyzeFrame(framePath);
try {
  fs.unlinkSync(framePath);
} catch {
  /* ignore */
}

if (stats.white_ratio > 0.55 && stats.variance < 1200) {
  reject_classes.push("diagram_schematic");
}
if (/\b(diagram|schematic|blueprint|floor\s*plan|wiring)\b/i.test(blob)) {
  reject_classes.push("diagram_schematic");
}
if (/\b(illustration|clipart|cartoon)\b/i.test(blob)) reject_classes.push("illustration");
if (/\b(chart|infographic)\b/i.test(blob)) reject_classes.push("chart_text_heavy");
if (/\b(fedex|ups|amazon|mcdonald|coca-?cola)\b/i.test(blob)) reject_classes.push("logo_trademark");

const uniqReject = [...new Set(reject_classes)];
const reject = uniqReject.length > 0 || !isVideo || !positive;

let niche_fit = "none";
if (!reject) {
  // stronger title match → high
  const strongHits = (rules.require_tokens || []).filter((t) => blob.includes(t)).length;
  niche_fit = strongHits >= 2 || (rules.require_any && positive) ? "high" : "med";
}

const depicts_verified = {
  ok: !reject,
  labels: [...new Set(labels)],
  confidence: reject ? 0.1 : niche_fit === "high" ? 0.75 : 0.5,
  method: "strong_token_metadata_frame",
  notes: `positive=${positive}; white=${stats.white_ratio.toFixed(2)}; var=${stats.variance.toFixed(0)}`,
};

const result = {
  ok: !reject && depicts_verified.ok,
  reject,
  reject_classes: uniqReject,
  depicts_verified,
  niche_fit,
  people: rules.people || "unknown",
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
