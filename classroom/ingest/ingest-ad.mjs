#!/usr/bin/env node
/**
 * Format-general ad ingest → study card with measured stats + provenance.observed:true.
 * Media never enters git — only annotations. Local files stay in classroom/private-cache/.
 *
 *   node classroom/ingest/ingest-ad.mjs <media|text.json> \
 *     --niche home-services --id obs-ugc-01 --format ugc_video \
 *     --platform owned --source-id teaching:owned-ugc-01
 *
 *   node classroom/ingest/ingest-ad.mjs --text-ad path/to/rsa.json \
 *     --niche home-services --id obs-text-01 --format text_search
 *
 * Video: scdet cuts, ebur128, silencedetect, tblend motion, optional tesseract OCR.
 * Static: OCR zones, palette, contrast. Text/text: headline/description/CTA parse.
 * status stays "draft" until --confirm (fills why_it_works gate for retrieve).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const FORMATS = JSON.parse(
  fs.readFileSync(path.join(ROOT, "classroom/formats.json"), "utf8")
);
const NICHES = JSON.parse(
  fs.readFileSync(path.join(ROOT, "classroom/niches.json"), "utf8")
);

function arg(name, def = null) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : def;
}
function has(flag) {
  return process.argv.includes(flag);
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    encoding: "utf8",
    maxBuffer: 40 * 1024 * 1024,
    ...opts,
  });
  return r;
}

function resolveFormat(raw) {
  if (!raw) return null;
  if (FORMATS.formats.some((f) => f.id === raw)) return raw;
  return FORMATS.legacy_aliases[raw] || null;
}

function formatMeta(id) {
  return FORMATS.formats.find((f) => f.id === id);
}

function nicheOk(id) {
  return NICHES.niches.some((n) => n.id === id || (n.aliases || []).includes(id));
}

function canonicalNiche(id) {
  for (const n of NICHES.niches) {
    if (n.id === id || (n.aliases || []).includes(id)) return n.id;
  }
  return id;
}

function ensurePrivateCache() {
  const dir = path.join(ROOT, "classroom/private-cache");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function probeMedia(file) {
  const r = run("ffprobe", [
    "-v",
    "quiet",
    "-print_format",
    "json",
    "-show_format",
    "-show_streams",
    file,
  ]);
  if (r.status !== 0) fail(`ffprobe failed: ${r.stderr}`);
  return JSON.parse(r.stdout);
}

function detectCuts(file, duration) {
  // ffmpeg scdet → scene change scores; threshold ~0.3–0.4 for hard cuts
  const r = run(
    "ffmpeg",
    [
      "-hide_banner",
      "-i",
      file,
      "-vf",
      "select='gt(scene,0.35)',metadata=print:file=-",
      "-an",
      "-f",
      "null",
      "-",
    ],
    { stdio: ["ignore", "pipe", "pipe"] }
  );
  const blob = `${r.stdout || ""}\n${r.stderr || ""}`;
  const times = [];
  for (const m of blob.matchAll(/pts_time:([0-9.]+)/g)) {
    times.push(Number(m[1]));
  }
  // Always include 0 and duration as boundaries
  const uniq = [...new Set([0, ...times.filter((t) => t > 0.05 && t < duration - 0.05), duration])]
    .sort((a, b) => a - b);
  const shots = [];
  for (let i = 0; i < uniq.length - 1; i++) {
    shots.push({ t_start: +uniq[i].toFixed(3), t_end: +uniq[i + 1].toFixed(3) });
  }
  if (!shots.length) shots.push({ t_start: 0, t_end: +duration.toFixed(3) });
  return shots;
}

function measureLoudness(file) {
  const r = run(
    "ffmpeg",
    ["-hide_banner", "-i", file, "-af", "ebur128=peak=true", "-f", "null", "-"],
    { stdio: ["ignore", "pipe", "pipe"] }
  );
  const blob = `${r.stderr || ""}`;
  // Prefer Summary block — progressive I: lines start at -70 before audio arrives
  const summary = blob.match(
    /Summary:[\s\S]*?Integrated loudness:\s*I:\s*(-?[0-9.]+)\s*LUFS/
  );
  const allI = [...blob.matchAll(/I:\s*(-?[0-9.]+)\s*LUFS/g)].map((m) =>
    Number(m[1])
  );
  const lufs = summary
    ? Number(summary[1])
    : allI.length
      ? allI[allI.length - 1]
      : null;
  const peak =
    blob.match(/True peak:[\s\S]*?Peak:\s*(-?[0-9.]+)\s*dBFS/) ||
    [...blob.matchAll(/Peak:\s*(-?[0-9.]+)\s*dBFS/g)].pop();
  return {
    loudness_lufs: lufs,
    true_peak_dbfs: peak ? Number(peak[1]) : null,
    source: "measured",
  };
}

function measureSilence(file) {
  const r = run(
    "ffmpeg",
    [
      "-hide_banner",
      "-i",
      file,
      "-af",
      "silencedetect=noise=-35dB:d=0.35",
      "-f",
      "null",
      "-",
    ],
    { stdio: ["ignore", "pipe", "pipe"] }
  );
  const blob = `${r.stderr || ""}`;
  const gaps = [];
  let start = null;
  for (const line of blob.split("\n")) {
    const s = line.match(/silence_start:\s*([0-9.]+)/);
    const e = line.match(/silence_end:\s*([0-9.]+)/);
    if (s) start = Number(s[1]);
    if (e && start != null) {
      gaps.push({ t_start: start, t_end: Number(e[1]) });
      start = null;
    }
  }
  return gaps;
}

function measureMotionCurve(file, duration) {
  // Sample ~1fps frame differences via freezedetect + signalstats on tblend
  const r = run(
    "ffmpeg",
    [
      "-hide_banner",
      "-i",
      file,
      "-vf",
      "fps=2,tblend=all_mode=difference,signalstats,metadata=print:file=-",
      "-an",
      "-f",
      "null",
      "-",
    ],
    { stdio: ["ignore", "pipe", "pipe"] }
  );
  const blob = `${r.stdout || ""}\n${r.stderr || ""}`;
  const ys = [];
  for (const m of blob.matchAll(/YAVG:([0-9.]+)/g)) ys.push(Number(m[1]));
  if (!ys.length) {
    // fallback: freezedetect summary
    const fz = run(
      "ffmpeg",
      [
        "-hide_banner",
        "-i",
        file,
        "-vf",
        "freezedetect=n=-60dB:d=0.4",
        "-an",
        "-f",
        "null",
        "-",
      ],
      { stdio: ["ignore", "pipe", "pipe"] }
    );
    const fzBlob = `${fz.stderr || ""}`;
    const freezes = [...fzBlob.matchAll(/freeze_duration:\s*([0-9.]+)/g)].map((m) =>
      Number(m[1])
    );
    const frozen = freezes.reduce((a, b) => a + b, 0);
    const motion_ratio = duration > 0 ? Math.max(0, 1 - frozen / duration) : 0;
    return {
      samples_per_s: 0,
      mean_yavg: null,
      motion_ratio: +motion_ratio.toFixed(3),
      freeze_s: +frozen.toFixed(3),
      curve: [],
      source: "measured",
    };
  }
  const mean = ys.reduce((a, b) => a + b, 0) / ys.length;
  // Normalize rough 0–1 motion: YAVG on difference frames often ~1–40
  const curve = ys.map((v, i) => ({
    t: +(i / 2).toFixed(2),
    yavg: +v.toFixed(3),
  }));
  return {
    samples_per_s: 2,
    mean_yavg: +mean.toFixed(3),
    motion_ratio: +(Math.min(1, mean / 12)).toFixed(3),
    freeze_s: null,
    curve: curve.slice(0, 120),
    source: "measured",
  };
}

function samplePalette(file, isVideo) {
  const tmp = path.join(
    ensurePrivateCache(),
    `_palette_${crypto.randomBytes(4).toString("hex")}.png`
  );
  const args = isVideo
    ? ["-hide_banner", "-ss", "0.5", "-i", file, "-frames:v", "1", "-y", tmp]
    : ["-hide_banner", "-i", file, "-frames:v", "1", "-y", tmp];
  const grab = run("ffmpeg", args, { stdio: ["ignore", "pipe", "pipe"] });
  if (grab.status !== 0 || !fs.existsSync(tmp)) {
    return { hex: [], source: "unavailable" };
  }
  // Downscale + get unique colors via ffmpeg palettegen stats
  const pal = path.join(ensurePrivateCache(), `_pal_${crypto.randomBytes(4).toString("hex")}.png`);
  run(
    "ffmpeg",
    [
      "-hide_banner",
      "-i",
      tmp,
      "-vf",
      "scale=160:-1,palettegen=max_colors=8:stats_mode=full",
      "-y",
      pal,
    ],
    { stdio: ["ignore", "pipe", "pipe"] }
  );
  // Read a few pixel colors via ffmpeg showinfo on palette
  const info = run(
    "ffmpeg",
    ["-hide_banner", "-i", pal, "-vf", "scale=8:1,format=rgb24", "-f", "rawvideo", "-"],
    { encoding: "buffer", maxBuffer: 1024 * 1024 }
  );
  const hex = [];
  if (info.status === 0 && Buffer.isBuffer(info.stdout)) {
    const buf = info.stdout;
    for (let i = 0; i + 2 < buf.length && hex.length < 6; i += 3) {
      hex.push(
        `#${buf[i].toString(16).padStart(2, "0")}${buf[i + 1]
          .toString(16)
          .padStart(2, "0")}${buf[i + 2].toString(16).padStart(2, "0")}`
      );
    }
  }
  try {
    fs.unlinkSync(tmp);
  } catch {}
  try {
    fs.unlinkSync(pal);
  } catch {}
  return { hex, source: "measured" };
}

function ocrImage(file) {
  const tess = run("tesseract", [file, "stdout", "--psm", "6"], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (tess.status !== 0) {
    return { text: "", zones: [], source: "unavailable", tool: "tesseract" };
  }
  const text = (tess.stdout || "").trim();
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return {
    text,
    zones: lines.slice(0, 20).map((line, i) => ({
      line,
      approx_band: i < 3 ? "top" : i > lines.length - 3 ? "bottom" : "mid",
    })),
    source: "measured",
    tool: "tesseract",
  };
}

function ocrVideoFrame(file) {
  const tmp = path.join(
    ensurePrivateCache(),
    `_ocr_${crypto.randomBytes(4).toString("hex")}.png`
  );
  run(
    "ffmpeg",
    ["-hide_banner", "-ss", "0.8", "-i", file, "-frames:v", "1", "-y", tmp],
    { stdio: ["ignore", "pipe", "pipe"] }
  );
  if (!fs.existsSync(tmp)) return { text: "", zones: [], source: "unavailable" };
  const out = ocrImage(tmp);
  try {
    fs.unlinkSync(tmp);
  } catch {}
  return out;
}

function contrastRough(file) {
  // Simple luminance histogram extremes via signalstats
  const r = run(
    "ffmpeg",
    [
      "-hide_banner",
      "-i",
      file,
      "-vf",
      "signalstats,metadata=print:file=-",
      "-frames:v",
      "1",
      "-f",
      "null",
      "-",
    ],
    { stdio: ["ignore", "pipe", "pipe"] }
  );
  const blob = `${r.stdout || ""}\n${r.stderr || ""}`;
  const ymin = blob.match(/YMIN:([0-9.]+)/);
  const ymax = blob.match(/YMAX:([0-9.]+)/);
  if (!ymin || !ymax) return { ratio_approx: null, source: "unavailable" };
  const lo = Math.max(1, Number(ymin[1]));
  const hi = Math.max(lo + 1, Number(ymax[1]));
  // WCAG-ish rough from luma span (not true text contrast)
  const ratio = ((hi + 0.05) / (lo + 0.05)).toFixed(2);
  return { ratio_approx: Number(ratio), y_min: Number(ymin[1]), y_max: Number(ymax[1]), source: "measured" };
}

function layoutGridNote(ocr) {
  const bands = { top: 0, mid: 0, bottom: 0 };
  for (const z of ocr.zones || []) bands[z.approx_band] = (bands[z.approx_band] || 0) + 1;
  return {
    nine_box_text_density: bands,
    note: "approx 3-band vertical split from OCR line order (not pixel boxes)",
    source: "measured",
  };
}

/** Heuristic typeface class from OCR glyph shapes + drawtext cues (not a licensed font ID). */
function classifyFont(ocrText, opts = {}) {
  const t = (ocrText || "").trim();
  if (!t) {
    return {
      font_guess: "unknown",
      font_class: "unknown",
      source: "unavailable",
    };
  }
  const upperRatio =
    (t.replace(/[^A-Za-z]/g, "").match(/[A-Z]/g) || []).length /
    Math.max(1, t.replace(/[^A-Za-z]/g, "").length);
  const hasSerifHints = /[il]{2,}|rn|ff|æ|œ/i.test(t) && upperRatio < 0.55;
  const condensed = t.length > 28 && !/\s{2,}/.test(t);
  const rounded = /[ocea]/i.test(t) && upperRatio < 0.4;
  let font_class = "grotesk-sans";
  if (hasSerifHints) font_class = "serif-display";
  else if (condensed && upperRatio > 0.7) font_class = "grotesk-bold-condensed";
  else if (rounded) font_class = "rounded-sans";
  else if (upperRatio > 0.85) font_class = "gothic-caps";
  return {
    font_guess: opts.guess || font_class,
    font_class,
    source: "heuristic-ocr",
    note: "Class only — not a foundry ID; refine with vision when available",
  };
}

function applyObservedHonesty(card) {
  // Inline honesty (avoid circular imports from scripts/)
  const NO_VIDEO = new Set([
    "search_text",
    "display_static",
    "carousel_static",
    "text_search",
    "static_image",
    "carousel",
  ]);
  const noVideo = NO_VIDEO.has(card.format) || NO_VIDEO.has(card.structure?.format);
  const errs = [];
  if (!noVideo) {
    const lufs = card.audio?.loudness_lufs ?? card.stats?.loudness_lufs;
    if (lufs == null || Number(lufs) <= -60) {
      errs.push(`loudness_lufs=${lufs}`);
    }
    if ((card.stats?.shot_count || 0) < 1) errs.push("shot_count<1");
    if (!(card.duration_s > 0)) errs.push("duration_s<=0");
  } else {
    const hasText =
      (card.stats?.ocr_line_count || 0) > 0 ||
      (card.stats?.headline_chars || []).length > 0 ||
      (card.look?.ocr_sample || "").trim().length > 0;
    if (!hasText) errs.push("no measured OCR/text");
  }
  card.measured_by = {
    tooling: Array.isArray(card.measured_by?.tooling)
      ? card.measured_by.tooling
      : String(card.provenance?.basis || "")
          .split(/[;+]/)
          .map((s) => s.trim())
          .filter(Boolean),
    honesty_errors: errs,
  };
  if (errs.length) {
    card.provenance.observed = false;
    card.provenance.observed_blocked_reason = errs.join("; ");
    card.tags = [
      ...new Set([
        ...(card.tags || []).filter((t) => t !== "observed"),
        "draft",
        "honesty-blocked",
      ]),
    ];
  } else {
    card.provenance.observed = true;
    card.tags = [...new Set([...(card.tags || []), "observed"])];
  }
  return card;
}

function buildVideoCard({ file, niche, id, formatId, platform, sourceId, rights }) {
  const meta = formatMeta(formatId);
  const probe = probeMedia(file);
  const v = (probe.streams || []).find((s) => s.codec_type === "video");
  const a = (probe.streams || []).find((s) => s.codec_type === "audio");
  const duration = Number(probe.format?.duration || 0);
  const w = v?.width || 0;
  const h = v?.height || 0;
  const cuts = detectCuts(file, duration);
  const loud = a ? measureLoudness(file) : { loudness_lufs: null, true_peak_dbfs: null, source: "n/a" };
  const gaps = a ? measureSilence(file) : [];
  const motion = measureMotionCurve(file, duration);
  const palette = samplePalette(file, true);
  const ocr = ocrVideoFrame(file);
  const font = classifyFont(ocr.text);

  const shotLens = cuts.map((c) => +(c.t_end - c.t_start).toFixed(3));
  const avg =
    shotLens.length > 0
      ? shotLens.reduce((x, y) => x + y, 0) / shotLens.length
      : duration;
  const firstCut = cuts.length > 1 ? cuts[1].t_start : null;
  const longest = shotLens.length ? Math.max(...shotLens) : duration;
  const cutsPer10 = duration > 0 ? ((cuts.length - 1) / duration) * 10 : 0;

  const shots = cuts.map((c, i) => ({
    t_start: c.t_start,
    t_end: c.t_end,
    purpose: i === 0 ? "hook" : i === cuts.length - 1 ? "cta_or_hold" : "beat",
    on_screen_text: i === 0 ? ocr.text.split("\n")[0] || "" : "",
    source: "measured",
    recipe: "[FILL — watch private-cache; describe photographed moment]",
    how_this_shot_was_made: `scdet cut ${i + 1}/${cuts.length} from ${path.basename(file)}`,
  }));

  const card = {
    id,
    status: "draft",
    source: {
      platform: platform || "owned",
      url_or_library_id: sourceId || path.basename(file),
      accessed: new Date().toISOString().slice(0, 10),
      rights: rights || "owned",
      verified_via: "agent_runtime",
    },
    niche,
    format: formatId,
    structure: {
      format: meta.structure,
      timing_observable: true,
      format_note: `Measured ingest (${formatId}); cuts from ffmpeg scdet`,
    },
    duration_s: +duration.toFixed(3),
    aspect: h > w ? "9:16" : w > h ? "16:9" : "1:1",
    provenance: {
      observed: true,
      basis: "ffmpeg:scdet+ebur128+silencedetect+tblend/signalstats+palettegen; tesseract OCR frame; font heuristic",
      measured_at: new Date().toISOString(),
      media_path_local: `classroom/private-cache/${path.basename(file)}`,
      media_committed: false,
    },
    measured_by: {
      tooling: [
        "ffmpeg:scdet",
        "ffmpeg:ebur128",
        "ffmpeg:silencedetect",
        "ffmpeg:tblend+signalstats",
        "ffmpeg:palettegen",
        "tesseract",
        "font-heuristic",
      ],
    },
    hook: {
      mechanism: "[FILL from watch — first 1–2s device]",
      first_second_description: "[FILL — photographed moment, not a card]",
      on_screen_text: ocr.text.split("\n")[0] || "",
      spoken: null,
    },
    shots,
    recipe: {
      hook: "[FILL]",
      beats: shots.map((s) => ({ t_start: s.t_start, t_end: s.t_end, purpose: s.purpose })),
      pacing_curve: {
        cuts_per_10s: +cutsPer10.toFixed(2),
        first_cut_at_s: firstCut,
        longest_hold_s: +longest.toFixed(3),
        source: "measured",
      },
      proof: "[FILL]",
      cta: "[FILL]",
    },
    stats: {
      shot_count: cuts.length,
      avg_shot_s: +avg.toFixed(3),
      cuts_per_10s: +cutsPer10.toFixed(2),
      longest_hold_s: +longest.toFixed(3),
      first_cut_at_s: firstCut,
      text_density: ocr.text ? "ocr_hit" : "low",
      loudness_lufs: loud.loudness_lufs,
      true_peak_dbfs: loud.true_peak_dbfs,
      silence_gaps: gaps,
      motion: motion,
      probe: { width: w, height: h, duration_s: duration, has_audio: Boolean(a) },
      stats_source: "measured",
    },
    audio: {
      loudness_lufs: loud.loudness_lufs,
      true_peak_dbfs: loud.true_peak_dbfs,
      silence_gaps: gaps,
      source: loud.source,
    },
    look: {
      palette: palette.hex,
      palette_source: palette.source,
      caption_style: "[FILL]",
      grade: "[FILL]",
      ocr_sample: ocr.text.slice(0, 280),
      font_guess: font.font_guess,
      font_class: font.font_class,
      font_source: font.source,
    },
    cta: { primary: "[FILL]", timing_s: null },
    offer_and_proof: { offer: "[FILL]", proof: "[PLACEHOLDER]" },
    why_it_works: "[HUMAN CONFIRM REQUIRED — measured stats only until then]",
    steal: ["[FILL after watch — structure/pacing only]"],
    what_not_to_copy: [
      "Competitor pixels / logos / talent likeness",
      "Verbatim scripts or uncleared audio",
      "Invented proof",
    ],
    tags: [niche, formatId, "ingest", "draft"],
    materials_ceiling:
      "Corpus teaches assembly; brand material still needs USER_SUPPLIED → i2v → vetted stock",
  };
  return applyObservedHonesty(card);
}

function buildStaticCard({ file, niche, id, formatId, platform, sourceId, rights }) {
  const meta = formatMeta(formatId);
  const probe = probeMedia(file);
  const v = (probe.streams || []).find((s) => s.codec_type === "video" || s.codec_type === "image") ||
    (probe.streams || [])[0];
  const w = v?.width || 0;
  const h = v?.height || 0;
  const ocr = ocrImage(file);
  const palette = samplePalette(file, false);
  const contrast = contrastRough(file);
  const grid = layoutGridNote(ocr);
  const lines = (ocr.text || "").split("\n").map((l) => l.trim()).filter(Boolean);
  const font = classifyFont(ocr.text);

  const card = {
    id,
    status: "draft",
    source: {
      platform: platform || "owned",
      url_or_library_id: sourceId || path.basename(file),
      accessed: new Date().toISOString().slice(0, 10),
      rights: rights || "owned",
      verified_via: "agent_runtime",
    },
    niche,
    format: formatId,
    structure: {
      format: meta.structure,
      timing_observable: false,
      format_note: `No-video format (${formatId}) — do NOT invent 0–3s video beats`,
    },
    duration_s: null,
    aspect: h > w ? "9:16" : w > h ? "16:9" : w && h ? "1:1" : "n/a",
    provenance: {
      observed: true,
      basis: "tesseract OCR + ffmpeg palettegen + signalstats contrast; composition bands; font heuristic",
      measured_at: new Date().toISOString(),
      media_path_local: `classroom/private-cache/${path.basename(file)}`,
      media_committed: false,
    },
    measured_by: {
      tooling: ["tesseract", "ffmpeg:palettegen", "ffmpeg:signalstats", "font-heuristic"],
    },
    hook: {
      mechanism: "[FILL — static hook device: offer/face/stat]",
      first_second_description: "n/a — static; first glance = primary text/visual",
      on_screen_text: lines[0] || "",
    },
    shots: lines.slice(0, 8).map((line, i) => ({
      t_start: null,
      t_end: null,
      purpose: i === 0 ? "headline" : i === lines.length - 1 ? "cta" : "body",
      on_screen_text: line,
      source: "measured",
    })),
    recipe: {
      hook: lines[0] || "[FILL]",
      beats: [],
      pacing_curve: null,
      proof: "[FILL from OCR/offer]",
      cta: lines.find((l) => /book|call|try|get|start|claim/i.test(l)) || "[FILL]",
    },
    stats: {
      shot_count: 0,
      avg_shot_s: null,
      cuts_per_10s: null,
      longest_hold_s: null,
      first_cut_at_s: null,
      text_density: `${lines.length} ocr_lines`,
      loudness_lufs: null,
      contrast,
      layout: grid,
      ocr_line_count: lines.length,
      probe: { width: w, height: h },
      stats_source: "measured",
    },
    audio: { note: "none — static/no-video", loudness_lufs: null },
    look: {
      palette: palette.hex,
      palette_source: palette.source,
      contrast,
      layout: grid,
      type: "[FILL]",
      ocr_sample: ocr.text.slice(0, 400),
      font_guess: font.font_guess,
      font_class: font.font_class,
      font_source: font.source,
    },
    cta: {
      primary: lines.find((l) => /book|call|try|get|start|claim/i.test(l)) || "[FILL]",
    },
    offer_and_proof: {
      offer: lines.slice(0, 3).join(" | ") || "[FILL]",
      proof: "[PLACEHOLDER]",
    },
    why_it_works: "[HUMAN CONFIRM REQUIRED — measured stats only until then]",
    steal: ["[FILL — composition, offer framing, CTA placement]"],
    what_not_to_copy: [
      "Competitor brand marks / product photography you do not own",
      "Invented proof or testimonials",
    ],
    tags: [niche, formatId, "ingest", "draft", "no-video"],
    materials_ceiling:
      "No-video craft (offer/copy/composition) is learnable here; brand photos still USER_SUPPLIED",
  };
  return applyObservedHonesty(card);
}

function buildTextSearchCard({ textPath, niche, id, platform, sourceId, rights }) {
  const raw = JSON.parse(fs.readFileSync(textPath, "utf8"));
  const headlines = [].concat(raw.headlines || raw.headline || []).filter(Boolean);
  const descriptions = [].concat(raw.descriptions || raw.description || []).filter(Boolean);
  const cta = raw.cta || raw.call_to_action || "[FILL]";
  const offer = raw.offer || headlines[0] || "[FILL]";
  const meta = formatMeta("text_search");
  const font = classifyFont(headlines.join(" "));

  const card = {
    id,
    status: "draft",
    source: {
      platform: platform || raw.platform || "google",
      url_or_library_id: sourceId || raw.url_or_library_id || path.basename(textPath),
      accessed: new Date().toISOString().slice(0, 10),
      rights: rights || "annotation-only",
      verified_via: "agent_runtime",
    },
    niche,
    format: "text_search",
    structure: {
      format: meta.structure,
      timing_observable: false,
      format_note: "RSA/search — do NOT invent 0–3s video beats from this card",
    },
    duration_s: null,
    aspect: "n/a",
    provenance: {
      observed: true,
      basis: "text fields measured: char counts, headline/description/CTA parse (no video)",
      measured_at: new Date().toISOString(),
      media_committed: false,
    },
    measured_by: { tooling: ["text-parse", "font-heuristic"] },
    hook: {
      mechanism: "headline qualification",
      first_second_description: "n/a — search text; first glance = primary headline",
      on_screen_text: headlines[0] || "",
    },
    shots: [
      ...headlines.map((h, i) => ({
        t_start: null,
        t_end: null,
        purpose: `headline_${i + 1}`,
        on_screen_text: h,
        source: "measured",
        char_count: h.length,
      })),
      ...descriptions.map((d, i) => ({
        t_start: null,
        t_end: null,
        purpose: `description_${i + 1}`,
        on_screen_text: d,
        source: "measured",
        char_count: d.length,
      })),
    ],
    recipe: {
      hook: headlines[0] || "",
      beats: [],
      pacing_curve: null,
      proof: descriptions[0] || "",
      cta,
    },
    stats: {
      shot_count: 0,
      avg_shot_s: null,
      cuts_per_10s: null,
      longest_hold_s: null,
      first_cut_at_s: null,
      text_density: `headlines=${headlines.length};descriptions=${descriptions.length}`,
      loudness_lufs: null,
      headline_chars: headlines.map((h) => h.length),
      description_chars: descriptions.map((d) => d.length),
      stats_source: "measured",
    },
    audio: { note: "none — search text", loudness_lufs: null },
    look: {
      note: "platform RSA typography",
      font_guess: font.font_guess,
      font_class: font.font_class,
      font_source: font.source,
      ocr_sample: headlines.concat(descriptions).join(" | ").slice(0, 400),
    },
    cta: { primary: cta },
    offer_and_proof: { offer, proof: raw.proof || "[PLACEHOLDER]" },
    why_it_works: "[HUMAN CONFIRM REQUIRED — measured stats only until then]",
    steal: ["[FILL — headline pattern, sitelink split, offer noun]"],
    what_not_to_copy: ["Competitor trademarked claims", "Invented proof"],
    tags: [niche, "text_search", "ingest", "draft", "no-video"],
    materials_ceiling: "Copy/offer craft only — no footage implied",
  };
  return applyObservedHonesty(card);
}

function writeCard(card) {
  const outDir = path.join(ROOT, "classroom/study-cards", card.niche);
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, `${card.id}.json`);
  fs.writeFileSync(out, JSON.stringify(card, null, 2) + "\n");
  return out;
}

function confirmCard(cardPath, why, steal) {
  const card = JSON.parse(fs.readFileSync(cardPath, "utf8"));
  if (!card.provenance?.observed) fail(`${cardPath}: confirm only for observed cards`);
  card.why_it_works = why || card.why_it_works;
  if (steal) card.steal = Array.isArray(steal) ? steal : [steal];
  if (/HUMAN CONFIRM REQUIRED/i.test(card.why_it_works)) {
    fail("Pass a real --why string; refusing placeholder why_it_works");
  }
  card.status = "confirmed";
  card.tags = [...new Set([...(card.tags || []).filter((t) => t !== "draft"), "confirmed"])];
  fs.writeFileSync(cardPath, JSON.stringify(card, null, 2) + "\n");
  return card;
}

// ─── CLI ───────────────────────────────────────────────────────────
const confirmPath = arg("--confirm");
if (confirmPath) {
  const card = confirmCard(confirmPath, arg("--why"), arg("--steal")?.split("|"));
  console.log(JSON.stringify({ ok: true, id: card.id, status: card.status }, null, 2));
  process.exit(0);
}

const textAd = arg("--text-ad");
const media = textAd ? null : process.argv[2];
if (!textAd && (!media || media.startsWith("-"))) {
  fail(
    "Usage: ingest-ad.mjs <media> --niche N --id ID --format F [--platform P] [--source-id S]\n" +
      "       ingest-ad.mjs --text-ad rsa.json --niche N --id ID\n" +
      "       ingest-ad.mjs --confirm card.json --why \"...\" [--steal a|b]"
  );
}

const nicheIn = arg("--niche");
if (!nicheIn) fail("--niche required (must exist in classroom/niches.json)");
if (!nicheOk(nicheIn)) {
  fail(
    `Unknown niche "${nicheIn}". Add a row to classroom/niches.json (data-only). Known: ${NICHES.niches
      .map((n) => n.id)
      .join(", ")}`
  );
}
const niche = canonicalNiche(nicheIn);
const id = arg("--id") || `obs-${Date.now()}`;
const formatRaw = arg("--format", textAd ? "text_search" : "ugc_video");
const formatId = resolveFormat(formatRaw);
if (!formatId) {
  fail(
    `Unknown format "${formatRaw}". Use one of: ${FORMATS.formats.map((f) => f.id).join(", ")}`
  );
}
const platform = arg("--platform", "owned");
const sourceId = arg("--source-id");
const rights = arg("--rights");

let card;
if (textAd) {
  if (formatId !== "text_search") fail("--text-ad requires --format text_search");
  card = buildTextSearchCard({
    textPath: path.resolve(textAd),
    niche,
    id,
    platform,
    sourceId,
    rights,
  });
} else {
  const file = path.resolve(media);
  if (!fs.existsSync(file)) fail(`Media not found: ${file}`);
  // Copy into private-cache (never commit)
  const cache = ensurePrivateCache();
  const dest = path.join(cache, `${id}${path.extname(file)}`);
  if (path.resolve(file) !== path.resolve(dest)) {
    fs.copyFileSync(file, dest);
  }
  const meta = formatMeta(formatId);
  if (meta.no_video) {
    card = buildStaticCard({
      file: dest,
      niche,
      id,
      formatId,
      platform,
      sourceId,
      rights,
    });
  } else {
    card = buildVideoCard({
      file: dest,
      niche,
      id,
      formatId,
      platform,
      sourceId,
      rights,
    });
  }
}

const out = writeCard(card);
console.log(
  JSON.stringify(
    {
      ok: true,
      out,
      id: card.id,
      niche: card.niche,
      format: card.format,
      status: card.status,
      provenance: card.provenance,
      stats_source: card.stats?.stats_source,
      measured: {
        cuts: card.stats?.shot_count,
        loudness_lufs: card.stats?.loudness_lufs,
        motion_ratio: card.stats?.motion?.motion_ratio ?? null,
        ocr_lines: card.stats?.ocr_line_count ?? null,
        headline_chars: card.stats?.headline_chars ?? null,
      },
      next: `Review private-cache, then: node classroom/ingest/ingest-ad.mjs --confirm ${out} --why "..."`,
    },
    null,
    2
  )
);
