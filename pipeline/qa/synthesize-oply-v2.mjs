#!/usr/bin/env node
/**
 * Build a synthetic 24s 1080×1920 delivery that should PASS render QA —
 * contrast to oply-v1 (hard cuts, loud enough audio, product-demo flagged).
 *
 * Usage: node pipeline/qa/synthesize-oply-v2.mjs [--out path]
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const outDefault = path.join(ROOT, "regression", "pass", "oply-v2", "fixture.mp4");

function die(msg) {
  console.error(msg);
  process.exit(1);
}

const outArg = process.argv.includes("--out")
  ? process.argv[process.argv.indexOf("--out") + 1]
  : outDefault;
const out = path.resolve(outArg);
const dir = path.dirname(out);
fs.mkdirSync(dir, { recursive: true });

// High-contrast scenes so scene-detect ≥4 cuts; grain so bitrate stays ≥6 Mbps.
// Bright bottom band on every frame avoids false black-pill (frame0 YAVG≥25).
const segments = [
  { color: "0x304050", d: 6 },
  { color: "0xC04040", d: 6 },
  { color: "0x208050", d: 6 },
  { color: "0xE8C040", d: 3 },
  { color: "0x3DDC97", d: 3 },
];

const parts = [];
for (let i = 0; i < segments.length; i++) {
  const seg = segments[i];
  const part = path.join(dir, `seg-${i}.mp4`);
  // noise + bright footer (not opaque black pill)
  const vf = [
    `noise=alls=28:allf=t`,
    `drawbox=x=80:y=400:w=920:h=600:color=white@0.15:t=fill`,
    `drawbox=x=0:y=1720:w=1080:h=200:color=0x8899AA@1:t=fill`,
  ].join(",");

  const args = [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-f",
    "lavfi",
    "-i",
    `color=c=${seg.color}:s=1080x1920:d=${seg.d}:r=30`,
    "-f",
    "lavfi",
    "-i",
    `sine=frequency=${220 + i * 30}:sample_rate=44100:duration=${seg.d}`,
    "-vf",
    vf,
    "-af",
    "volume=1.2",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-b:v",
    "8M",
    "-minrate",
    "7M",
    "-maxrate",
    "10M",
    "-bufsize",
    "16M",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-shortest",
    part,
  ];
  const r = spawnSync("ffmpeg", args, { encoding: "utf8" });
  if (r.status !== 0) die(`seg ${i} failed:\n${r.stderr || r.stdout}`);
  parts.push(part);
}

const list = path.join(dir, "concat.txt");
fs.writeFileSync(list, parts.map((p) => `file '${p}'`).join("\n") + "\n");

const cat = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    list,
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-b:v",
    "8M",
    "-minrate",
    "7M",
    "-maxrate",
    "10M",
    "-bufsize",
    "16M",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    out,
  ],
  { encoding: "utf8" }
);
if (cat.status !== 0) die(`concat failed:\n${cat.stderr || cat.stdout}`);

for (const p of parts) fs.unlinkSync(p);
fs.unlinkSync(list);

const specOut = path.join(dir, "qa-spec.json");
fs.writeFileSync(
  specOut,
  JSON.stringify(
    {
      product_type: "voice",
      product_demo_present: true,
      aspect: "9:16",
      declared_font: "Anton",
      intentional_hold: false,
      intentional_silence: false,
      note: "Synthetic v2 pass fixture — proves QA can green; client delivery uses uikit stills",
    },
    null,
    2
  ) + "\n"
);

const probe = spawnSync(
  "ffprobe",
  ["-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", out],
  { encoding: "utf8" }
);
if (probe.status !== 0) die("ffprobe failed");
const j = JSON.parse(probe.stdout);
const v = (j.streams || []).find((s) => s.codec_type === "video");
console.log(
  JSON.stringify(
    {
      ok: true,
      out,
      qa_spec: specOut,
      width: v?.width,
      height: v?.height,
      duration_s: Number(j.format?.duration || 0),
      mbps: Number((Number(j.format?.bit_rate || 0) / 1e6).toFixed(2)),
    },
    null,
    2
  )
);
