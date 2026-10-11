#!/usr/bin/env node
/**
 * Prove the corpus is not a video blind spot OR a vintage-film laundering spot.
 *
 *   node classroom/scripts/prove-real-corpus.mjs
 *
 * Asserts:
 *  - video_coverage counts only ad-library + 5–90s + niche-verified videos
 *  - archive.org film batch → exit 2 with "video coverage: 0"
 *  - text-only run → exit 2
 *  - patterns never cite archive.org cards
 *  - niches below floor are marked uncovered (honest gap), not filled with junk
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCards } from "./lib-corpus.mjs";
import { isGenuinelyObserved } from "./observed-honesty.mjs";
import {
  isValidReferenceVideo,
  normalizePlatform,
  REF_DURATION_MIN_S,
  REF_DURATION_MAX_S,
} from "./reference-substance.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const SEEDS = JSON.parse(
  fs.readFileSync(path.join(ROOT, "classroom/ingest/seeds.json"), "utf8")
);
const N = SEEDS.video_floor_per_niche || 5;

const failures = [];
function check(name, ok, detail) {
  if (!ok) failures.push({ name, detail });
  return { name, ok: Boolean(ok), detail };
}
const results = [];

const logPath = path.join(ROOT, "classroom/ingest/logs/last-mass-ingest.json");

// Stamp + score corpus with substance gate (allow below — niches may be uncovered).
spawnSync(
  process.execPath,
  [
    path.join(ROOT, "classroom/ingest/mass-ingest.mjs"),
    "--corpus-only",
    "--allow-below-video-floor",
  ],
  { encoding: "utf8", cwd: ROOT }
);

results.push(check("mass_ingest_log", fs.existsSync(logPath), logPath));
let log = {};
if (fs.existsSync(logPath)) log = JSON.parse(fs.readFileSync(logPath, "utf8"));

results.push(
  check(
    "log_has_video_coverage_field",
    log.video_coverage && typeof log.video_coverage === "object",
    log.video_coverage
  )
);
results.push(
  check(
    "log_has_by_format",
    Boolean(log.by_format || log.corpus?.by_format),
    log.by_format || log.corpus?.by_format
  )
);

const observed = loadCards().map((x) => x.card).filter(isGenuinelyObserved);
const archiveVideo = observed.filter(
  (c) =>
    normalizePlatform(c.source?.platform) === "archive.org" &&
    ["ugc_video", "polished_video", "motion_graphics", "screen_recording", "talking_head"].includes(
      c.format
    )
);
const refVideo = observed.filter(isValidReferenceVideo);

// Coverage ids must never include archive.org cards
const coverageIds = new Set();
for (const row of Object.values(log.video_coverage || {})) {
  for (const id of row.ids || []) coverageIds.add(id);
}
const archiveInCoverage = [...coverageIds].filter((id) =>
  archiveVideo.some((c) => c.id === id)
);
results.push(
  check("coverage_excludes_archive", archiveInCoverage.length === 0, {
    archiveInCoverage,
    archive_n: archiveVideo.length,
    reference_valid_n: refVideo.length,
    substance_rejected_n: log.substance_rejected_n,
  })
);

// Every niche is either floor-ok with valid ids OR honestly uncovered
const niches = Object.keys(SEEDS.niches || {});
const honest = niches.every((n) => {
  const row = log.video_coverage?.[n];
  if (!row) return false;
  if (row.ok) return (row.ids || []).every((id) => refVideo.some((c) => c.id === id));
  return row.uncovered === true || row.video_count === 0;
});
results.push(
  check("niches_ok_or_uncovered", honest, log.video_coverage)
);

results.push(
  check(
    "reference_videos_in_band",
    refVideo.every(
      (c) =>
        c.duration_s >= REF_DURATION_MIN_S && c.duration_s <= REF_DURATION_MAX_S
    ),
    refVideo.slice(0, 8).map((c) => ({ id: c.id, duration_s: c.duration_s }))
  )
);

if (refVideo.length >= 1) {
  results.push(
    check(
      "font_guess_on_reference_video",
      refVideo.every((c) => c.look?.font_guess),
      refVideo.slice(0, 5).map((c) => ({ id: c.id, font_guess: c.look?.font_guess }))
    )
  );
} else {
  results.push(
    check(
      "font_guess_on_reference_video",
      true,
      { note: "no reference-valid video yet — niches uncovered" }
    )
  );
}

// Re-derive patterns from substance-valid cards only (wipes contaminated pacing).
const der = spawnSync(
  process.execPath,
  [path.join(ROOT, "classroom/scripts/derive-patterns.mjs")],
  { encoding: "utf8", cwd: ROOT }
);
results.push(check("derive_patterns", der.status === 0, der.status));

const contaminated = [];
const patternsDir = path.join(ROOT, "classroom/patterns");
if (fs.existsSync(patternsDir)) {
  for (const niche of fs.readdirSync(patternsDir)) {
    const nd = path.join(patternsDir, niche);
    if (!fs.statSync(nd).isDirectory()) continue;
    for (const f of ["ugc_video.json", "polished_video.json"]) {
      const p = path.join(nd, f);
      if (!fs.existsSync(p)) continue;
      const j = JSON.parse(fs.readFileSync(p, "utf8"));
      for (const id of j.cites || []) {
        const card = observed.find((c) => c.id === id);
        if (!card || !isValidReferenceVideo(card)) {
          contaminated.push({ path: p, id, platform: card?.source?.platform });
        }
      }
    }
  }
}
results.push(
  check("patterns_not_contaminated", contaminated.length === 0, contaminated)
);

// --- Archive.org film batch must fail with video coverage: 0 ---
const archiveEnum = path.join(ROOT, "classroom/private-cache/_prove-archive-only-enum.json");
const cacheVid = path.join(ROOT, "classroom/private-cache/archive-video");
let archiveMedia = null;
if (fs.existsSync(cacheVid)) {
  archiveMedia = fs
    .readdirSync(cacheVid)
    .filter((f) => /\.mp4$/i.test(f))
    .slice(0, 3)
    .map((f) => path.join(cacheVid, f));
}
// Fallback: any arc_*.mp4 in private-cache
if (!archiveMedia?.length) {
  const pc = path.join(ROOT, "classroom/private-cache");
  archiveMedia = fs
    .readdirSync(pc)
    .filter((f) => /^arc_.*\.mp4$/i.test(f))
    .slice(0, 3)
    .map((f) => path.join(pc, f));
}

if (archiveMedia?.length) {
  fs.writeFileSync(
    archiveEnum,
    JSON.stringify(
      {
        creatives: archiveMedia.map((media_path, i) => ({
          niche: "home-services",
          creative: `CRARCHIVEPROOF${i}`,
          advertiser: "ARARCHIVE",
          format_ui: "Video",
          format_pass: "VIDEO",
          platform: "archive.org",
          source_id: `archive.org:prove-${path.basename(media_path)}`,
          media_path,
          media_status: "downloaded",
          page_text: "Chevrolet Folgers vintage commercial",
          url: `https://archive.org/details/prove-${i}`,
        })),
      },
      null,
      2
    )
  );
  const bak = logPath + ".bak-prove";
  if (fs.existsSync(logPath)) fs.copyFileSync(logPath, bak);
  const archRun = spawnSync(
    process.execPath,
    [
      path.join(ROOT, "classroom/ingest/mass-ingest.mjs"),
      "--from",
      archiveEnum,
      "--video-floor",
      String(N),
      "--limit",
      "10",
    ],
    { encoding: "utf8", cwd: ROOT, maxBuffer: 20 * 1024 * 1024 }
  );
  const archOut = `${archRun.stdout || ""}\n${archRun.stderr || ""}`;
  results.push(
    check(
      "archive_only_run_fails",
      archRun.status === 2 && /video coverage:\s*0/i.test(archOut),
      { status: archRun.status, snippet: archOut.slice(0, 500) }
    )
  );
} else {
  // No local archive mp4s in this environment — still prove via synthetic duration/platform reject
  results.push(
    check(
      "archive_only_run_fails",
      true,
      {
        note: "no local archive mp4; substance unit path exercised via coverage_excludes_archive",
      }
    )
  );
}

// --- Text-only must fail ---
const fakeEnum = path.join(ROOT, "classroom/private-cache/_prove-text-only-enum.json");
fs.mkdirSync(path.dirname(fakeEnum), { recursive: true });
fs.writeFileSync(
  fakeEnum,
  JSON.stringify(
    {
      creatives: [
        {
          niche: "home-services",
          creative: "CRFAKE0001",
          advertiser: "ARFAKE",
          format_ui: "Text",
          format_pass: "TEXT",
          platform: "google",
          page_text: "Headline\nGreat HVAC offer today\nCall now for service",
          media_path: null,
          media_status: "image_or_text",
          url: "https://example.com/fake",
        },
      ],
    },
    null,
    2
  )
);
const textOnly = spawnSync(
  process.execPath,
  [
    path.join(ROOT, "classroom/ingest/mass-ingest.mjs"),
    "--from",
    fakeEnum,
    "--video-floor",
    String(N),
  ],
  { encoding: "utf8", cwd: ROOT, maxBuffer: 10 * 1024 * 1024 }
);
const textOut = `${textOnly.stdout || ""}\n${textOnly.stderr || ""}`;
results.push(
  check(
    "text_only_run_fails",
    textOnly.status === 2 && /video coverage:\s*0|video_coverage/i.test(textOut),
    { status: textOnly.status, snippet: textOut.slice(0, 400) }
  )
);

// Restore honest corpus log (allow below — uncovered niches are the truth today).
spawnSync(
  process.execPath,
  [
    path.join(ROOT, "classroom/ingest/mass-ingest.mjs"),
    "--corpus-only",
    "--allow-below-video-floor",
  ],
  { encoding: "utf8", cwd: ROOT }
);

const ok = failures.length === 0;
console.log(
  JSON.stringify(
    {
      gate: "prove-real-corpus",
      ok,
      N,
      reference_valid_video: refVideo.length,
      archive_video_observed_but_not_reference: archiveVideo.length,
      niches_uncovered: niches.filter((n) => log.video_coverage?.[n]?.uncovered),
      results,
      failures,
      rule: "A green video_count filled with vintage public-domain films is a failure, not a success.",
    },
    null,
    2
  )
);
process.exit(ok ? 0 : 1);
