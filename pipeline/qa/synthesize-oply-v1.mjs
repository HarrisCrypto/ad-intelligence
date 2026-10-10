#!/usr/bin/env node
/**
 * Build a synthetic 24s 720×1280 low-bitrate quiet ad that reproduces the
 * Oply v1 measured defect profile for CI (not the original delivery).
 *
 * Usage: node pipeline/qa/synthesize-oply-v1.mjs [--out path]
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const outDefault = path.join(
  ROOT,
  "regression",
  "fail",
  "oply-v1",
  "fixture.mp4"
);

function die(msg) {
  console.error(msg);
  process.exit(1);
}

const outArg = process.argv.includes("--out")
  ? process.argv[process.argv.indexOf("--out") + 1]
  : outDefault;
const out = path.resolve(outArg);
fs.mkdirSync(path.dirname(out), { recursive: true });

// Slow hue shifts via geq/colorchannelmixer + crossfade-like soft changes
// are hard; instead hold one panel and overlay translucent washes with fade.
// Hard scene detect stays near 0. Frame 0: opaque black pill via drawbox.
const vf = [
  "drawbox=x=0:y=1180:w=720:h=100:color=black@1:t=fill",
  "drawbox=x=40:y=200:w=640:h=80:color=0x1a3a55@0.35:t=fill:enable='between(t,3.5,8)'",
  "drawbox=x=40:y=400:w=640:h=120:color=0x244a3a@0.4:t=fill:enable='between(t,8,14)'",
  "drawbox=x=40:y=600:w=640:h=100:color=0x3a2040@0.35:t=fill:enable='between(t,14,20)'",
  "drawbox=x=40:y=900:w=640:h=80:color=0x2FBF8F@0.25:t=fill:enable='gte(t,20)'",
].join(",");

// Quiet 110 Hz tone (~ -34 dBFS peak for 0.02 amp) with silence windows
const af =
  "volume=0.02," +
  [
    [0, 0.51],
    [4.34, 5.6],
    [6.99, 8.52],
    [9.54, 12.49],
    [13.8, 15.48],
    [16.87, 18.51],
    [20.05, 21.47],
    [22.72, 24.02],
  ]
    .map(
      ([a, b]) =>
        `volume=enable='between(t,${a},${b})':volume=0`
    )
    .join(",");

const args = [
  "-y",
  "-hide_banner",
  "-loglevel",
  "error",
  "-f",
  "lavfi",
  "-i",
  "color=c=0x12283F:s=720x1280:d=24:r=30",
  "-f",
  "lavfi",
  "-i",
  "sine=frequency=110:sample_rate=44100:duration=24",
  "-vf",
  vf,
  "-af",
  af,
  "-c:v",
  "libx264",
  "-preset",
  "veryfast",
  "-b:v",
  "800k",
  "-maxrate",
  "850k",
  "-bufsize",
  "1600k",
  "-pix_fmt",
  "yuv420p",
  "-c:a",
  "aac",
  "-b:a",
  "64k",
  "-shortest",
  out,
];

const r = spawnSync("ffmpeg", args, { encoding: "utf8" });
if (r.status !== 0) die(`ffmpeg failed:\n${r.stderr || r.stdout}`);

const probe = spawnSync(
  "ffprobe",
  [
    "-v",
    "quiet",
    "-print_format",
    "json",
    "-show_format",
    "-show_streams",
    out,
  ],
  { encoding: "utf8" }
);
if (probe.status !== 0) die("ffprobe failed after synthesize");
const j = JSON.parse(probe.stdout);
const v = (j.streams || []).find((s) => s.codec_type === "video");
const mbps = Number(j.format?.bit_rate || 0) / 1e6;
console.log(
  JSON.stringify(
    {
      ok: true,
      out,
      width: v?.width,
      height: v?.height,
      duration_s: Number(Number(j.format?.duration || 0).toFixed(2)),
      format_mbps: Number(mbps.toFixed(3)),
    },
    null,
    2
  )
);
