#!/usr/bin/env node
/**
 * Batch ingest from enumerate-latest.json + enforce VIDEO coverage floor.
 *
 *   node classroom/ingest/mass-ingest.mjs --confirm
 *   node classroom/ingest/mass-ingest.mjs --confirm --video-floor 5
 *
 * Fails (exit 2) if video_coverage is below floor — a green count of text-only ads is a failure.
 * Writes classroom/ingest/logs/last-mass-ingest.json with by_format + video_coverage.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isGenuinelyObserved } from "../scripts/observed-honesty.mjs";
import { loadCards } from "../scripts/lib-corpus.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const SEEDS = JSON.parse(fs.readFileSync(path.join(__dirname, "seeds.json"), "utf8"));

const VIDEO_FORMATS = new Set([
  "ugc_video",
  "polished_video",
  "motion_graphics",
  "screen_recording",
  "talking_head",
]);

function arg(n, d = null) {
  const i = process.argv.indexOf(n);
  return i >= 0 ? process.argv[i + 1] : d;
}

const from =
  arg("--from") || path.join(ROOT, "classroom/private-cache/enumerate-latest.json");
const limit = Number(arg("--limit", "80"));
const autoConfirm = process.argv.includes("--confirm");
const videoFloor = Number(arg("--video-floor", String(SEEDS.video_floor_per_niche || 5)));
const skipEnum = process.argv.includes("--corpus-only"); // only score existing corpus / write log
const allowBelow = process.argv.includes("--allow-below-video-floor");

function isVideoFormat(fmt) {
  return VIDEO_FORMATS.has(fmt) || /^video$/i.test(fmt || "");
}

function mapFormat(c) {
  const ui = (c.format_ui || c.format_pass || c.format_guess || "").toString();
  if (/video/i.test(ui) || c.youtube_id || /\.mp4$/i.test(c.media_path || "")) {
    return "ugc_video";
  }
  if (/text/i.test(ui)) return "text_search";
  if (/image|photo/i.test(ui)) return "static_image";
  if (/\.(png|jpg|jpeg|webp)$/i.test(c.media_path || "")) return "static_image";
  return "text_search";
}

function parseTextFromPage(pageText, cr) {
  const lines = String(pageText || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const headlines = lines
    .filter((l) => l.length >= 8 && l.length <= 40 && !/^(Ad|Sponsored|About|See|Format)/i.test(l))
    .slice(0, 3);
  const descriptions = lines.filter((l) => l.length > 40 && l.length < 120).slice(0, 2);
  if (!headlines.length && lines[0]) headlines.push(lines[0].slice(0, 40));
  const rsa = {
    platform: "google",
    url_or_library_id: `google:${cr}`,
    headlines: headlines.length ? headlines : [`Ad ${cr}`],
    descriptions: descriptions.length
      ? descriptions
      : ["See advertiser creative in Ads Transparency."],
    cta: "learn more",
    offer: headlines[0] || cr,
    proof: "[PLACEHOLDER]",
  };
  const p = path.join(ROOT, "classroom/private-cache", `${cr}-rsa.json`);
  fs.writeFileSync(p, JSON.stringify(rsa, null, 2));
  return p;
}

const log = {
  started: new Date().toISOString(),
  source: "google_ads_transparency",
  from: skipEnum ? null : from,
  attempted: 0,
  accepted: 0,
  rejected: 0,
  by_niche: {},
  by_format: {},
  video_coverage: {},
  video_floor_per_niche: videoFloor,
  cards: [],
  errors: [],
};

if (!skipEnum) {
  if (!fs.existsSync(from)) {
    console.error(`Missing enumerate file: ${from}. Run enumerate-ads.mjs --format VIDEO first.`);
    process.exit(1);
  }
  const enumData = JSON.parse(fs.readFileSync(from, "utf8"));
  const creatives = (enumData.creatives || []).slice(0, limit);

  for (const c of creatives) {
    log.attempted++;
    const niche = c.niche || "home-services";
    const id = `gat_${String(c.creative || "x").toLowerCase()}`;
    let format = mapFormat(c);

    try {
      const media = c.media_path;
      const isVideoFile = media && /\.(mp4|mov|webm)$/i.test(media) && fs.existsSync(media);
      const isImage =
        media && /\.(png|jpg|jpeg|webp)$/i.test(media) && fs.existsSync(media);

      // Video pass without downloadable file → reject (do not launder as text)
      if (isVideoFormat(format) && !isVideoFile) {
        log.rejected++;
        log.errors.push({
          id,
          error: "video_media_unavailable",
          media_status: c.media_status,
          youtube_id: c.youtube_id,
          hint: "Pass --cookies for YouTube or run fetch-archive-videos.mjs for measured video floor",
        });
        continue;
      }

      let r;
      if (format === "text_search" || (!isVideoFile && !isImage)) {
        const rsaPath = parseTextFromPage(c.page_text, c.creative);
        r = spawnSync(
          process.execPath,
          [
            path.join(ROOT, "classroom/ingest/ingest-ad.mjs"),
            "--text-ad",
            rsaPath,
            "--niche",
            niche,
            "--id",
            id,
            "--format",
            "text_search",
            "--platform",
            "google",
            "--source-id",
            c.url || `google:${c.advertiser}/${c.creative}`,
            "--rights",
            "annotation-only",
          ],
          { encoding: "utf8", cwd: ROOT, maxBuffer: 10 * 1024 * 1024 }
        );
        format = "text_search";
      } else {
        format = isVideoFile ? "ugc_video" : "static_image";
        r = spawnSync(
          process.execPath,
          [
            path.join(ROOT, "classroom/ingest/ingest-ad.mjs"),
            media,
            "--niche",
            niche,
            "--id",
            id,
            "--format",
            format,
            "--platform",
            "google",
            "--source-id",
            c.url || `google:${c.advertiser}/${c.creative}`,
            "--rights",
            "annotation-only",
          ],
          { encoding: "utf8", cwd: ROOT, maxBuffer: 10 * 1024 * 1024 }
        );
      }

      let j = {};
      try {
        j = JSON.parse(r.stdout || "{}");
      } catch {
        j = { raw: r.stdout, err: r.stderr };
      }
      if (r.status !== 0) {
        log.rejected++;
        log.errors.push({ id, error: r.stderr || j });
        continue;
      }
      const card = JSON.parse(fs.readFileSync(j.out, "utf8"));
      if (!card.provenance?.observed) {
        log.rejected++;
        log.errors.push({
          id,
          error: "honesty_blocked",
          reason: card.provenance?.observed_blocked_reason,
        });
        continue;
      }
      if (autoConfirm) {
        spawnSync(
          process.execPath,
          [
            path.join(ROOT, "classroom/ingest/ingest-ad.mjs"),
            "--confirm",
            j.out,
            "--why",
            `Measured from Google Ads Transparency ${c.creative} (${c.domain || ""}). Emulate structure only.`,
            "--steal",
            "Structure/pacing/copy pattern only|Never copy pixels or trademarks",
          ],
          { encoding: "utf8", cwd: ROOT }
        );
      }
      log.accepted++;
      log.by_niche[niche] = (log.by_niche[niche] || 0) + 1;
      log.by_format[format] = (log.by_format[format] || 0) + 1;
      log.cards.push({
        id,
        niche,
        format,
        creative: c.creative,
        advertiser: c.advertiser,
        url: c.url,
        observed: true,
      });
    } catch (e) {
      log.rejected++;
      log.errors.push({ id, error: String(e.message || e) });
    }
  }
}

// Corpus-wide video coverage (genuine observed video cards) — for reporting.
const all = loadCards().map((x) => x.card).filter(isGenuinelyObserved);
const byNicheCorpus = {};
const byFormatCorpus = {};
for (const c of all) {
  byFormatCorpus[c.format] = (byFormatCorpus[c.format] || 0) + 1;
  if (!isVideoFormat(c.format)) continue;
  byNicheCorpus[c.niche] = byNicheCorpus[c.niche] || {
    count: 0,
    ids: [],
    min_lufs: null,
  };
  byNicheCorpus[c.niche].count++;
  byNicheCorpus[c.niche].ids.push(c.id);
  const lufs = c.audio?.loudness_lufs ?? c.stats?.loudness_lufs;
  if (lufs != null) {
    byNicheCorpus[c.niche].min_lufs =
      byNicheCorpus[c.niche].min_lufs == null
        ? lufs
        : Math.min(byNicheCorpus[c.niche].min_lufs, lufs);
  }
}

const corpusTotalVideo = Object.values(byNicheCorpus).reduce(
  (a, b) => a + b.count,
  0
);

// Run-level video coverage from THIS ingest (not laundered by prior corpus).
const byNicheRun = {};
for (const card of log.cards) {
  if (!isVideoFormat(card.format)) continue;
  byNicheRun[card.niche] = byNicheRun[card.niche] || { count: 0, ids: [] };
  byNicheRun[card.niche].count++;
  byNicheRun[card.niche].ids.push(card.id);
}
const runTotalVideo = Object.values(byNicheRun).reduce((a, b) => a + b.count, 0);
const runVideoFormats = Object.entries(log.by_format)
  .filter(([fmt]) => isVideoFormat(fmt))
  .reduce((a, [, n]) => a + n, 0);

// Floor gate: corpus-only scores the corpus; an ingest run scores what it accepted.
const nichesChecked = Object.keys(SEEDS.niches || {});
const gaps = [];
const coverageSource = skipEnum ? byNicheCorpus : byNicheRun;
const totalVideo = skipEnum ? corpusTotalVideo : runTotalVideo || runVideoFormats;

for (const n of nichesChecked) {
  const v = coverageSource[n]?.count || 0;
  log.video_coverage[n] = {
    video_count: v,
    required: videoFloor,
    ok: v >= videoFloor,
    ids: coverageSource[n]?.ids || [],
    scope: skipEnum ? "corpus" : "run",
  };
  if (skipEnum) {
    if (v < videoFloor) gaps.push(`${n}:video_coverage:${v}<${videoFloor}`);
  }
}
if (!skipEnum) {
  // Text-only / video-blind ingest must fail even if the corpus already has video.
  if (totalVideo < 1) {
    gaps.push("video coverage: 0");
  } else {
    const nichesTouched = new Set(log.cards.map((c) => c.niche));
    for (const n of nichesTouched) {
      const v = byNicheRun[n]?.count || 0;
      if (v < videoFloor) gaps.push(`${n}:video_coverage:${v}<${videoFloor}`);
    }
  }
}

// Corpus-only (or empty run) still must surface per-format counts — never hide a video blind spot.
if (!Object.keys(log.by_format).length) {
  log.by_format = { ...byFormatCorpus };
}
log.corpus = {
  genuine_observed: all.length,
  by_format: byFormatCorpus,
  total_video: corpusTotalVideo,
  video_coverage: Object.fromEntries(
    nichesChecked.map((n) => [
      n,
      {
        video_count: byNicheCorpus[n]?.count || 0,
        required: videoFloor,
        ok: (byNicheCorpus[n]?.count || 0) >= videoFloor,
        ids: byNicheCorpus[n]?.ids || [],
      },
    ])
  ),
};
log.finished = new Date().toISOString();
log.summary = {
  attempted: log.attempted,
  accepted: log.accepted,
  rejected: log.rejected,
  by_niche: log.by_niche,
  by_format: log.by_format,
  video_coverage: log.video_coverage,
  total_video: totalVideo,
  corpus_total_video: corpusTotalVideo,
  gaps,
};

const logDir = path.join(ROOT, "classroom/ingest/logs");
fs.mkdirSync(logDir, { recursive: true });
const logPath = path.join(logDir, "last-mass-ingest.json");
fs.writeFileSync(logPath, JSON.stringify(log, null, 2));

const ok = gaps.length === 0 || allowBelow;
const msg = {
  ok,
  log: logPath,
  summary: log.summary,
  video_coverage: totalVideo,
  floor: videoFloor,
  gaps,
  rule: "A green count that hides zero video ads is a failure, not a success.",
};
if (!ok) {
  console.error(
    JSON.stringify(
      {
        ...msg,
        error: `video coverage: ${totalVideo}`,
        detail: gaps.join("; ") || "video coverage: 0",
      },
      null,
      2
    )
  );
  process.exit(2);
}
console.log(JSON.stringify(msg, null, 2));
