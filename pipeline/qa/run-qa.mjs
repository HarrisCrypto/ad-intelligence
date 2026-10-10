#!/usr/bin/env node
/**
 * Render QA — inspect an actual video file. Hard-fail blocks delivery.
 *
 * Usage:
 *   node pipeline/qa/run-qa.mjs <video.mp4> [--spec spec.json] [--expect expected.json]
 *
 * Exit 0 = all hard checks pass. Exit 1 = one or more hard fails.
 * Always prints JSON report to stdout.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

function die(msg, code = 2) {
  console.error(msg);
  process.exit(code);
}

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    ...opts,
  });
}

function ffprobeJson(file) {
  const r = run("ffprobe", [
    "-v",
    "quiet",
    "-print_format",
    "json",
    "-show_format",
    "-show_streams",
    file,
  ]);
  if (r.status !== 0) die(`ffprobe failed: ${r.stderr}`);
  return JSON.parse(r.stdout);
}

function meanVolumeDb(file) {
  const r = run("ffmpeg", [
    "-hide_banner",
    "-i",
    file,
    "-af",
    "volumedetect",
    "-f",
    "null",
    "-",
  ]);
  const text = `${r.stderr || ""}\n${r.stdout || ""}`;
  const mean = text.match(/mean_volume:\s*([-\d.]+)\s*dB/i);
  const max = text.match(/max_volume:\s*([-\d.]+)\s*dB/i);
  return {
    mean_db: mean ? Number(mean[1]) : null,
    max_db: max ? Number(max[1]) : null,
    raw: text.slice(-800),
  };
}

function silenceGaps(file, noiseDb = -45, minDur = 0.5) {
  const r = run("ffmpeg", [
    "-hide_banner",
    "-i",
    file,
    "-af",
    `silencedetect=noise=${noiseDb}dB:d=${minDur}`,
    "-f",
    "null",
    "-",
  ]);
  const text = `${r.stderr || ""}\n${r.stdout || ""}`;
  const starts = [...text.matchAll(/silence_start:\s*([-\d.]+)/gi)].map((m) =>
    Number(m[1])
  );
  const ends = [...text.matchAll(/silence_end:\s*([-\d.]+)/gi)].map((m) =>
    Number(m[1])
  );
  const gaps = [];
  for (let i = 0; i < Math.min(starts.length, ends.length); i++) {
    gaps.push({
      start: starts[i],
      end: ends[i],
      dur: Number((ends[i] - starts[i]).toFixed(3)),
    });
  }
  // trailing silence_start without end
  if (starts.length > ends.length) {
    const last = starts[starts.length - 1];
    gaps.push({ start: last, end: null, dur: null });
  }
  return gaps;
}

function hardCuts(file, threshold = 0.3) {
  // select='gt(scene,0.3)' prints pts times for hard cuts
  const r = run("ffmpeg", [
    "-hide_banner",
    "-i",
    file,
    "-vf",
    `select='gt(scene,${threshold})',showinfo`,
    "-f",
    "null",
    "-",
  ]);
  const text = `${r.stderr || ""}\n${r.stdout || ""}`;
  const hits = [...text.matchAll(/n:\s*(\d+)/g)];
  return hits.length;
}

function frame0BottomIsBlack(file, { bandPx = 100, darkness = 25 } = {}) {
  // Frame 0 → crop bottom band → mean R (proxy for luma on dark plates)
  const bin = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      file,
      "-vf",
      `select=eq(n\\,0),crop=iw:${bandPx}:0:ih-${bandPx}`,
      "-vframes",
      "1",
      "-f",
      "rawvideo",
      "-pix_fmt",
      "rgb24",
      "-",
    ],
    { encoding: "buffer", maxBuffer: 20 * 1024 * 1024 }
  );
  if (bin.status !== 0 || !bin.stdout?.length) {
    return {
      ok: false,
      error: "frame0 extract failed",
      yavg: null,
      black_pill_likely: false,
    };
  }
  let sum = 0;
  const b = bin.stdout;
  const n = Math.floor(b.length / 3);
  for (let i = 0; i < n; i++) sum += b[i * 3];
  const mean = n ? sum / n : null;
  return {
    ok: mean != null,
    yavg: mean != null ? Number(mean.toFixed(2)) : null,
    black_pill_likely: mean != null && mean < darkness,
  };
}

function loadJson(p) {
  if (!p) return null;
  return JSON.parse(fs.readFileSync(path.resolve(p), "utf8"));
}

const video = process.argv[2];
if (!video || video.startsWith("-")) {
  die("Usage: node pipeline/qa/run-qa.mjs <video.mp4> [--spec s.json] [--expect e.json]");
}
if (!fs.existsSync(video)) die(`Video not found: ${video}`);

const specFile = arg("--spec");
const expectFile = arg("--expect");
const spec = loadJson(specFile) || {};
const expect = loadJson(expectFile);
const specOverlay = expect?.spec_overlay || spec.spec_overlay || spec;

const probe = ffprobeJson(video);
const vstream = (probe.streams || []).find((s) => s.codec_type === "video");
const astream = (probe.streams || []).find((s) => s.codec_type === "audio");
const width = Number(vstream?.width || 0);
const height = Number(vstream?.height || 0);
const duration = Number(probe.format?.duration || 0);
const formatBitrate = Number(probe.format?.bit_rate || 0);
const videoBitrate = Number(vstream?.bit_rate || 0) || formatBitrate;
const videoMbps = videoBitrate / 1e6;
const fps =
  (() => {
    const r = vstream?.r_frame_rate || vstream?.avg_frame_rate || "0/1";
    const [a, b] = r.split("/").map(Number);
    return b ? a / b : 0;
  })();

const vol = meanVolumeDb(video);
const gaps = silenceGaps(video);
const cuts = hardCuts(video);
const f0 = frame0BottomIsBlack(video);

const checks = [];
function hard(id, pass, detail) {
  checks.push({ id, pass: !!pass, hard: true, detail });
}

// Thresholds — starting values from plan Phase 5 / PART C1
const aspect = specOverlay.aspect || (height > width ? "9:16" : "other");
if (aspect === "9:16") {
  hard(
    "resolution",
    width >= 1080 && height >= 1920,
    `${width}x${height} (need ≥1080x1920 for 9:16)`
  );
} else {
  hard("resolution", width >= 1080, `${width}x${height}`);
}

hard(
  "bitrate",
  videoMbps >= 6.0,
  `${videoMbps.toFixed(2)} Mbps video/format (need ≥6 Mbps)`
);

// Loudness: use mean dB as proxy when ebur128 I is heavy; fail if mean < -20
// (target ads roughly -16..-12 LUFS; -30 dB mean is clearly broken)
hard(
  "loudness",
  vol.mean_db != null && vol.mean_db >= -20 && vol.mean_db <= -8,
  `mean_volume=${vol.mean_db} dB max=${vol.max_db} (expect roughly -16…-12 LUFS-class; reject near-silent beds)`
);

const longGaps = gaps.filter((g) => (g.dur ?? 0) > 0.7);
const intentionalSilence = !!specOverlay.intentional_silence;
hard(
  "silence",
  intentionalSilence || longGaps.length === 0,
  intentionalSilence
    ? "intentional_silence tagged"
    : `${longGaps.length} gaps >0.7s (longest=${Math.max(0, ...gaps.map((g) => g.dur || 0))}s)`
);

const intentionalHold = !!specOverlay.intentional_hold;
const cutsPer10 = duration > 0 ? (cuts / duration) * 10 : 0;
hard(
  "cut_rate",
  intentionalHold || cutsPer10 >= 4 || cuts >= 4,
  `hard_cuts=${cuts} (~${cutsPer10.toFixed(1)}/10s); floor ≥4/10s unless intentional-hold`
);

hard(
  "frame0_artifact",
  !(f0.black_pill_likely === true),
  f0.black_pill_likely
    ? `frame0 bottom YAVG=${f0.yavg} — opaque black pill likely`
    : `frame0 bottom YAVG=${f0.yavg}`
);

const productType = specOverlay.product_type || spec.product_type;
const demoPresent =
  specOverlay.product_demo_present === true ||
  spec.product_demo_present === true;
if (productType === "voice" || productType === "chat" || productType === "app") {
  hard(
    "product_demo",
    demoPresent,
    `product_type=${productType} demo_present=${demoPresent}`
  );
}

const failed = checks.filter((c) => c.hard && !c.pass);
const report = {
  ok: failed.length === 0,
  video: path.resolve(video),
  probe: {
    width,
    height,
    duration_s: Number(duration.toFixed(2)),
    fps: Number(fps.toFixed(2)),
    video_mbps: Number(videoMbps.toFixed(3)),
    has_audio: Boolean(astream),
  },
  audio: {
    mean_db: vol.mean_db,
    max_db: vol.max_db,
    silence_gaps: gaps,
  },
  motion: { hard_cuts: cuts, cuts_per_10s: Number(cutsPer10.toFixed(2)) },
  frame0: f0,
  checks,
  hard_fails: failed.map((c) => c.id),
};

if (expect?.must_fail) {
  const want = expect.must_fail.map((x) => x.id);
  const missing = want.filter((id) => !report.hard_fails.includes(id));
  const extras = report.hard_fails.filter((id) => !want.includes(id));
  report.expect = {
    want,
    missing_fails: missing,
    unexpected_fails: extras,
    matched: missing.length === 0,
  };
  // For --expect mode: success means we caught every required fail
  // (extras OK — QA can be stricter). Exit 0 only if matched.
  report.ok = missing.length === 0;
}

console.log(JSON.stringify(report, null, 2));
process.exit(report.ok ? 0 : 1);
