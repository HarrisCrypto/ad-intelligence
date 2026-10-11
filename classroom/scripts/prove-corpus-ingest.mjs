#!/usr/bin/env node
/**
 * Acceptance for universal corpus:
 *  - ≥3 observed cards with measured stats
 *  - ≥1 no-video format among them
 *  - retrieve surfaces observed cards and states ceiling
 *  - retrieve refuses a niche below floor
 *  - patterns cite cards
 *  - niches.json is the registry (data-only add)
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

// 1) niches + formats are data
results.push(
  check(
    "niches_json",
    fs.existsSync(path.join(ROOT, "classroom/niches.json")),
    "classroom/niches.json"
  )
);
results.push(
  check(
    "formats_json",
    fs.existsSync(path.join(ROOT, "classroom/formats.json")),
    "classroom/formats.json"
  )
);
results.push(
  check(
    "ingest_ad",
    fs.existsSync(path.join(ROOT, "classroom/ingest/ingest-ad.mjs")),
    "classroom/ingest/ingest-ad.mjs"
  )
);

const cards = loadCards().map((x) => x.card);
const observed = cards.filter((c) => c.provenance?.observed === true);
const measured = observed.filter((c) => c.stats?.stats_source === "measured");
const noVideo = measured.filter(
  (c) => isNoVideoFormat(c.format) || isNoVideoFormat(c.structure?.format)
);

results.push(
  check(
    "observed_ge_3",
    measured.length >= 3,
    `measured_observed=${measured.length} ids=${measured.map((c) => c.id).join(",")}`
  )
);
results.push(
  check(
    "no_video_ge_1",
    noVideo.length >= 1,
    `no_video=${noVideo.map((c) => `${c.id}:${c.format}`).join(",")}`
  )
);

// home-services coverage
const cov = nicheCoverage("home-services", cards);
results.push(
  check("home_services_floor", cov.floor_ok, cov)
);

// retrieve surfaces observed
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
    ret.status === 0 && retJ.ok === true,
    { status: ret.status, ceiling: retJ.ceiling, observed_in_result: retJ.observed_in_result }
  )
);
results.push(
  check(
    "retrieve_surfaces_observed",
    (retJ.observed_in_result || 0) >= 1,
    retJ.observed_in_result
  )
);
results.push(
  check(
    "retrieve_states_ceiling",
    typeof retJ.ceiling === "string" && retJ.ceiling.includes("learning from"),
    retJ.ceiling
  )
);

// refuse empty niche
const refuse = run("classroom/scripts/retrieve-cards.mjs", [
  "--niche",
  "dental",
  "--limit",
  "3",
]);
let refuseJ = {};
try {
  refuseJ = JSON.parse(refuse.stdout || "{}");
} catch {
  refuseJ = {};
}
results.push(
  check(
    "retrieve_refuses_below_floor",
    refuse.status === 2 && refuseJ.refused === true,
    { status: refuse.status, refused: refuseJ.refused, missing: refuseJ.coverage?.missing }
  )
);

// patterns cite cards
const der = run("classroom/scripts/derive-patterns.mjs", ["--niche", "home-services"]);
let derJ = {};
try {
  derJ = JSON.parse(der.stdout || "{}");
} catch {
  derJ = {};
}
const patFiles = derJ.written || [];
results.push(
  check(
    "patterns_exist",
    der.status === 0 && patFiles.length >= 1,
    patFiles
  )
);
const citesOk = patFiles.every(
  (p) => Array.isArray(p.cites) && p.cites.length >= 1
);
results.push(check("patterns_cite_cards", citesOk, patFiles.map((p) => p.cites)));

// adding a niche is data-only — niches.json already has dental/saas/skincare rows
results.push(
  check(
    "niche_rows_data",
    NICHES.niches.some((n) => n.id === "dental") &&
      NICHES.niches.some((n) => n.id === "saas"),
    NICHES.niches.map((n) => n.id)
  )
);

// no media in git under study-cards
const blob = cards.map((c) => JSON.stringify(c)).join("\n");
results.push(
  check(
    "no_media_payloads",
    !/data:(image|video|audio)\//i.test(blob),
    "study-cards clean"
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
