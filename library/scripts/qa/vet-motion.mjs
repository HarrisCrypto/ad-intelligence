#!/usr/bin/env node
/**
 * Hard gate: clip must contain real motion (not a still being panned / freeze).
 *
 *   node library/scripts/qa/vet-motion.mjs <path.mp4>
 *   node library/scripts/qa/vet-motion.mjs --json <path.mp4>
 *
 * Uses ffmpeg freezedetect=n=-60dB:d=0.4 + mean frame-difference on sampled greys.
 * Exit 0 = pass (motion_confirmed). Exit 2 = fail static/near-static.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const json = process.argv.includes("--json");
const file = process.argv.filter((a) => !a.startsWith("-") && !a.endsWith("vet-motion.mjs")).pop();

function out(obj, code) {
  if (json) console.log(JSON.stringify(obj, null, 2));
  else {
    console.log(obj.ok ? `PASS motion ${obj.motion}` : `FAIL ${obj.reason}`);
    if (obj.details) console.error(JSON.stringify(obj.details));
  }
  process.exit(code);
}

if (!file || !fs.existsSync(file)) {
  out({ ok: false, reason: "missing_file", path: file || null }, 1);
}

const ext = path.extname(file).toLowerCase();
if (![".mp4", ".webm", ".mov", ".mkv"].includes(ext)) {
  out(
    {
      ok: false,
      reason: "not_video",
      path: file,
      reject_classes: ["still_in_footage_slot"],
      motion_confirmed: false,
      motion: "none",
    },
    2
  );
}

const probe = spawnSync(
  "ffprobe",
  [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height,duration,nb_frames,avg_frame_rate",
    "-of",
    "json",
    file,
  ],
  { encoding: "utf8" }
);
let meta = {};
try {
  meta = JSON.parse(probe.stdout || "{}").streams?.[0] || {};
} catch {
  meta = {};
}
const duration = Number(meta.duration) || 0;
const width = Number(meta.width) || 0;
const height = Number(meta.height) || 0;

if (duration > 0 && duration < 0.8) {
  out(
    {
      ok: false,
      reason: "too_short",
      path: file,
      duration_s: duration,
      motion_confirmed: false,
      motion: "none",
      reject_classes: ["static_no_motion"],
    },
    2
  );
}

// freezedetect
const freeze = spawnSync(
  "ffmpeg",
  ["-v", "info", "-i", file, "-vf", "freezedetect=n=-60dB:d=0.4", "-f", "null", "-"],
  { encoding: "utf8" }
);
const freezeLog = `${freeze.stderr || ""}\n${freeze.stdout || ""}`;
const freezeStarts = [...freezeLog.matchAll(/freeze_start:\s*([\d.]+)/g)].map((m) =>
  Number(m[1])
);
const freezeEnds = [...freezeLog.matchAll(/freeze_end:\s*([\d.]+)/g)].map((m) =>
  Number(m[1])
);
const freezeDurs = [...freezeLog.matchAll(/freeze_duration:\s*([\d.]+)/g)].map((m) =>
  Number(m[1])
);
let frozenS = freezeDurs.reduce((a, b) => a + b, 0);
if (!freezeDurs.length && freezeStarts.length && duration) {
  // open-ended freeze to EOF
  frozenS = Math.max(0, duration - freezeStarts[0]);
}
const freezeRatio = duration > 0 ? frozenS / duration : 1;

// Mean absolute frame difference on downscaled greys (first ~48 frames after frame 0)
const raw = spawnSync(
  "ffmpeg",
  [
    "-v",
    "error",
    "-i",
    file,
    "-vf",
    "fps=8,scale=160:90,format=gray",
    "-frames:v",
    "48",
    "-f",
    "rawvideo",
    "-",
  ],
  { encoding: "buffer", maxBuffer: 20 * 1024 * 1024 }
);
const buf = raw.stdout || Buffer.alloc(0);
const frameSize = 160 * 90;
const nFrames = Math.floor(buf.length / frameSize);
let meanDiff = 0;
let diffs = 0;
for (let i = 1; i < nFrames; i++) {
  let sum = 0;
  const a = (i - 1) * frameSize;
  const b = i * frameSize;
  for (let p = 0; p < frameSize; p++) sum += Math.abs(buf[a + p] - buf[b + p]);
  meanDiff += sum / frameSize;
  diffs++;
}
meanDiff = diffs ? meanDiff / diffs : 0;

// Thresholds: near-static stock "Ken Burns of a still" fails both
// Subtle hand/tool motion often lands 1.2–2.0; Ken-Burns stills are <<1.0
const FAIL_MEAN = 1.15;
const FAIL_FREEZE_RATIO = 0.78;

const staticFail = meanDiff < FAIL_MEAN || freezeRatio >= FAIL_FREEZE_RATIO;
const motion =
  meanDiff >= 8 ? "high" : meanDiff >= 3.5 ? "medium" : meanDiff >= FAIL_MEAN ? "low" : "none";

const result = {
  ok: !staticFail,
  path: file,
  motion_confirmed: !staticFail,
  motion,
  duration_s: duration,
  width,
  height,
  orientation:
    width && height ? (height > width * 1.05 ? "portrait" : width > height * 1.05 ? "landscape" : "square") : "unknown",
  details: {
    mean_frame_diff: Number(meanDiff.toFixed(3)),
    freeze_ratio: Number(freezeRatio.toFixed(3)),
    freeze_starts: freezeStarts.slice(0, 8),
    freeze_ends: freezeEnds.slice(0, 8),
    sampled_frames: nFrames,
    thresholds: { FAIL_MEAN, FAIL_FREEZE_RATIO },
  },
  reject_classes: staticFail ? ["static_no_motion"] : [],
  reason: staticFail
    ? meanDiff < FAIL_MEAN
      ? "near_static_mean_diff"
      : "mostly_frozen"
    : "ok",
};

out(result, staticFail ? 2 : 0);
