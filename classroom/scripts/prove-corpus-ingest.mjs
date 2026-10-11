#!/usr/bin/env node
/**
 * Acceptance (MASS-INGEST.md):
 *  - ≥3 genuinely observed cards (video: lufs>-60, shot_count≥1; no-video: OCR/text)
 *  - ≥1 no-video format
 *  - validator rejects lufs:-70 / shot_count:0 video cards
 *  - look.font_guess on video cards
 *  - patterns cite ad IDs
 *  - retrieve floor/ceiling
 *  - run log exists
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadCards,
  nicheCoverage,
  isNoVideoFormat,
  NICHES,
} from "./lib-corpus.mjs";
import { isGenuinelyObserved } from "./observed-honesty.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");

function run(rel, args = []) {
  return spawnSync(process.execPath, [path.join(ROOT, rel), ...args], {
    encoding: "utf8",
    cwd: ROOT,
    maxBuffer: 20 * 1024 * 1024,
  });
}

const failures = [];
function check(name, ok, detail) {
  if (!ok) failures.push({ name, detail });
  return { name, ok, detail };
}

const results = [];

results.push(
  check(
    "mass_ingest_spec",
    fs.existsSync(path.join(ROOT, "classroom/ingest/MASS-INGEST.md")),
    "classroom/ingest/MASS-INGEST.md"
  )
);
results.push(
  check(
    "enumerate_ads",
    fs.existsSync(path.join(ROOT, "classroom/ingest/enumerate-ads.mjs")),
    "enumerate-ads.mjs"
  )
);

// Validator rejects silence placeholders
const fakePath = path.join(ROOT, "classroom/private-cache/_prove-fake-silence.json");
fs.mkdirSync(path.dirname(fakePath), { recursive: true });
fs.writeFileSync(
  fakePath,
  JSON.stringify(
    {
      id: "prove-fake-silence",
      status: "draft",
      source: {
        platform: "test",
        url_or_library_id: "x",
        accessed: "2026-10-11",
        rights: "annotation-only",
      },
      niche: "home-services",
      format: "ugc_video",
      structure: { format: "video_timed", timing_observable: true },
      duration_s: 7,
      aspect: "9:16",
      provenance: {
        observed: true,
        basis: "test",
        media_committed: false,
      },
      measured_by: { tooling: ["ffmpeg"] },
      hook: { mechanism: "x", first_second_description: "x" },
      shots: [{ t_start: 0, t_end: 7, purpose: "hook" }],
      stats: { shot_count: 0, loudness_lufs: -70, stats_source: "measured" },
      audio: { loudness_lufs: -70 },
      look: {},
      cta: {},
      offer_and_proof: {},
      why_it_works: "x",
      steal: ["x"],
      what_not_to_copy: ["x"],
      tags: [],
    },
    null,
    2
  )
);
const rej = run("classroom/scripts/validate-card.mjs", [fakePath]);
results.push(
  check(
    "validator_rejects_lufs_neg70_shot0",
    rej.status === 1 && /loudness_lufs|shot_count/i.test(rej.stderr || ""),
    { status: rej.status, stderr: (rej.stderr || "").slice(0, 300) }
  )
);

const cards = loadCards().map((x) => x.card);
const measured = cards.filter(isGenuinelyObserved);
const noVideo = measured.filter(
  (c) => isNoVideoFormat(c.format) || isNoVideoFormat(c.structure?.format)
);
const video = measured.filter((c) => !isNoVideoFormat(c.format));

results.push(
  check(
    "observed_ge_3",
    measured.length >= 3,
    `genuine_observed=${measured.length}`
  )
);
results.push(
  check(
    "no_video_ge_1",
    noVideo.length >= 1,
    `no_video=${noVideo.length}`
  )
);
results.push(
  check(
    "video_loudness_ok",
    video.length >= 1 &&
      video.every((c) => (c.audio?.loudness_lufs ?? c.stats?.loudness_lufs) > -60),
    video.map((c) => ({ id: c.id, lufs: c.audio?.loudness_lufs }))
  )
);
results.push(
  check(
    "font_guess_on_video",
    video.length >= 1 && video.every((c) => c.look?.font_guess),
    video.map((c) => ({ id: c.id, font_guess: c.look?.font_guess, font_class: c.look?.font_class }))
  )
);

// Placeholders reflagged
const placeholders = cards.filter((c) =>
  /^obs-(ugc|static|text|screen)/.test(c.id)
);
results.push(
  check(
    "placeholders_not_observed",
    placeholders.every((c) => c.provenance?.observed !== true),
    placeholders.map((c) => ({ id: c.id, observed: c.provenance?.observed }))
  )
);

const cov = nicheCoverage("home-services", cards);
results.push(check("home_services_floor", cov.floor_ok, cov));

const nichesLive = ["home-services", "saas", "skincare", "dental"].filter(
  (n) => nicheCoverage(n, cards).floor_ok
);
results.push(
  check(
    "niches_ge_3_floor",
    nichesLive.length >= 3,
    nichesLive
  )
);

const ret = run("classroom/scripts/retrieve-cards.mjs", [
  "--niche",
  "home-services",
  "--limit",
  "8",
]);
let retJ = {};
try {
  retJ = JSON.parse(ret.stdout || "{}");
} catch {
  retJ = {};
}
results.push(
  check(
    "retrieve_ok",
    ret.status === 0 && retJ.ok === true && (retJ.observed_in_result || 0) >= 1,
    { status: ret.status, observed_in_result: retJ.observed_in_result, ceiling: retJ.ceiling }
  )
);

const refuse = run("classroom/scripts/retrieve-cards.mjs", [
  "--niche",
  "local-gym",
  "--limit",
  "2",
]);
let refuseJ = {};
try {
  refuseJ = JSON.parse(refuse.stdout || "{}");
} catch {
  refuseJ = {};
}
results.push(
  check(
    "retrieve_refuses_empty_niche",
    refuse.status === 2 && refuseJ.refused === true,
    { status: refuse.status, refused: refuseJ.refused }
  )
);

const der = run("classroom/scripts/derive-patterns.mjs", []);
let derJ = {};
try {
  derJ = JSON.parse(der.stdout || "{}");
} catch {
  derJ = {};
}
results.push(
  check(
    "patterns_exist",
    der.status === 0 && (derJ.written || []).length >= 1,
    { groups: derJ.groups, n: (derJ.written || []).length }
  )
);
const citesOk = (derJ.written || []).every(
  (p) => Array.isArray(p.cites) && p.cites.length >= 1
);
results.push(check("patterns_cite_ad_ids", citesOk, derJ.written?.slice(0, 5)));

// pattern files have cuts/content/fonts_craft
let structureOk = true;
const samplePat = (derJ.written || [])[0]?.out;
if (samplePat && fs.existsSync(samplePat)) {
  const p = JSON.parse(fs.readFileSync(samplePat, "utf8"));
  structureOk = Boolean(p.cuts && p.content && p.fonts_craft && p.cites?.length);
} else structureOk = false;
results.push(check("patterns_cuts_content_fonts", structureOk, samplePat));

const logPath = path.join(ROOT, "classroom/ingest/logs/last-mass-ingest.json");
results.push(
  check(
    "run_log",
    fs.existsSync(logPath),
    fs.existsSync(logPath)
      ? JSON.parse(fs.readFileSync(logPath, "utf8")).summary ||
          {
            attempted: JSON.parse(fs.readFileSync(logPath, "utf8")).attempted,
            accepted: JSON.parse(fs.readFileSync(logPath, "utf8")).accepted,
          }
      : null
  )
);

const ok = failures.length === 0;
console.log(
  JSON.stringify(
    {
      gate: "prove-corpus-ingest",
      ok,
      results,
      failures,
      genuine_observed: measured.length,
      niches_floor_ok: nichesLive,
      coverage_home_services: cov,
      floor: NICHES.floor,
      honest_limit:
        "Corpus teaches how quality is assembled; ladder still ends at real brand material.",
    },
    null,
    2
  )
);
process.exit(ok ? 0 : 1);
