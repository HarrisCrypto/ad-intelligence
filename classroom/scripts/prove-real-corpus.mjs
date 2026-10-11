#!/usr/bin/env node
/**
 * Prove the corpus is not a video blind spot.
 *
 *   node classroom/scripts/prove-real-corpus.mjs
 *
 * Fails loudly unless ≥1 niche has ≥N measured video cards
 * (loudness_lufs > -60, shot_count ≥ 1) and last-mass-ingest.json
 * reports video_coverage (not just total accepted).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCards } from "./lib-corpus.mjs";
import { isGenuinelyObserved } from "./observed-honesty.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const SEEDS = JSON.parse(
  fs.readFileSync(path.join(ROOT, "classroom/ingest/seeds.json"), "utf8")
);
const N = SEEDS.video_floor_per_niche || 5;
const VIDEO = new Set([
  "ugc_video",
  "polished_video",
  "motion_graphics",
  "screen_recording",
  "talking_head",
]);

const failures = [];
function check(name, ok, detail) {
  if (!ok) failures.push({ name, detail });
  return { name, ok, detail };
}
const results = [];

const logPath = path.join(ROOT, "classroom/ingest/logs/last-mass-ingest.json");
results.push(check("mass_ingest_log", fs.existsSync(logPath), logPath));
let log = {};
if (fs.existsSync(logPath)) log = JSON.parse(fs.readFileSync(logPath, "utf8"));

results.push(
  check(
    "log_has_video_coverage_field",
    log.video_coverage && typeof log.video_coverage === "object",
    log.video_coverage || log.summary?.video_coverage
  )
);
results.push(
  check(
    "log_has_by_format",
    log.by_format || log.corpus?.by_format || log.summary?.by_format,
    log.by_format || log.corpus?.by_format
  )
);

const cards = loadCards().map((x) => x.card).filter(isGenuinelyObserved);
const videoCards = cards.filter((c) => VIDEO.has(c.format));
const byNiche = {};
for (const c of videoCards) {
  byNiche[c.niche] = byNiche[c.niche] || [];
  byNiche[c.niche].push(c);
}

const nichesMeeting = Object.entries(byNiche).filter(([, list]) => list.length >= N);
results.push(
  check(
    "niche_with_ge_N_video",
    nichesMeeting.length >= 1,
    {
      N,
      nichesMeeting: nichesMeeting.map(([n, list]) => ({ niche: n, n: list.length })),
      byNiche: Object.fromEntries(
        Object.entries(byNiche).map(([n, list]) => [n, list.length])
      ),
    }
  )
);

results.push(
  check(
    "video_loudness_and_shots",
    videoCards.length >= 1 &&
      videoCards.every(
        (c) =>
          (c.audio?.loudness_lufs ?? c.stats?.loudness_lufs) > -60 &&
          (c.stats?.shot_count || 0) >= 1
      ),
    videoCards.slice(0, 8).map((c) => ({
      id: c.id,
      lufs: c.audio?.loudness_lufs,
      shots: c.stats?.shot_count,
      font: c.look?.font_guess,
    }))
  )
);

results.push(
  check(
    "font_guess_on_video",
    videoCards.length >= 1 && videoCards.every((c) => c.look?.font_guess),
    videoCards.slice(0, 5).map((c) => ({ id: c.id, font_guess: c.look?.font_guess }))
  )
);

// patterns for video formats
const der = spawnSync(
  process.execPath,
  [path.join(ROOT, "classroom/scripts/derive-patterns.mjs")],
  { encoding: "utf8", cwd: ROOT }
);
results.push(check("derive_patterns", der.status === 0, der.status));

const ugcOrPolished = [];
for (const niche of Object.keys(byNiche)) {
  for (const fmt of ["ugc_video", "polished_video"]) {
    const p = path.join(ROOT, "classroom/patterns", niche, `${fmt}.json`);
    if (fs.existsSync(p)) {
      const j = JSON.parse(fs.readFileSync(p, "utf8"));
      ugcOrPolished.push({
        path: p,
        cites: j.cites?.length || 0,
        has_cuts: Boolean(j.cuts),
        has_content: Boolean(j.content),
        has_fonts: Boolean(j.fonts_craft),
      });
    }
  }
}
results.push(
  check(
    "video_patterns_cite_ads",
    ugcOrPolished.length >= 1 && ugcOrPolished.every((p) => p.cites >= 1 && p.has_cuts),
    ugcOrPolished
  )
);

// Prove text-only mass-ingest fails
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
// Backup real log
const bak = logPath + ".bak-prove";
if (fs.existsSync(logPath)) fs.copyFileSync(logPath, bak);
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
// restore log from corpus-only recount
spawnSync(
  process.execPath,
  [
    path.join(ROOT, "classroom/ingest/mass-ingest.mjs"),
    "--corpus-only",
    "--allow-below-video-floor",
  ],
  { encoding: "utf8", cwd: ROOT }
);
// If corpus already meets floor, re-run without allow to restore honest log
spawnSync(
  process.execPath,
  [path.join(ROOT, "classroom/ingest/mass-ingest.mjs"), "--corpus-only"],
  { encoding: "utf8", cwd: ROOT }
);

const textOut = `${textOnly.stdout || ""}\n${textOnly.stderr || ""}`;
results.push(
  check(
    "text_only_run_fails",
    textOnly.status === 2 && /video coverage:\s*0|video_coverage/i.test(textOut),
    { status: textOnly.status, snippet: textOut.slice(0, 400) }
  )
);

const ok = failures.length === 0;
console.log(
  JSON.stringify(
    {
      gate: "prove-real-corpus",
      ok,
      N,
      video_cards: videoCards.length,
      nichesMeeting: nichesMeeting.map(([n, list]) => ({ niche: n, n: list.length })),
      results,
      failures,
    },
    null,
    2
  )
);
process.exit(ok ? 0 : 1);
