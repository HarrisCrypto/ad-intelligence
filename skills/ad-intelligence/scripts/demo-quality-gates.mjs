#!/usr/bin/env node
/**
 * Demo: prove gold fixtures pass and lint-corpus fails.
 * Usage: node scripts/demo-quality-gates.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const lintBin = path.join(__dirname, "lint-package.mjs");

const GOLD = [
  "examples/beauty-dtc-dual-track.md",
  "examples/local-service-trust.md",
  "examples/saas-demo-pas.md",
  "examples/physical-product-hero.md",
  "examples/voice-agent-front-desk.md",
];

function lint(rel) {
  const file = path.join(ROOT, rel);
  const r = spawnSync(process.execPath, [lintBin, file], { encoding: "utf8" });
  let ok = false;
  try {
    ok = JSON.parse(r.stdout || "{}").ok === true;
  } catch {
    ok = false;
  }
  return { rel, exit: r.status, ok, stdout: r.stdout };
}

function listCorpus() {
  const dir = path.join(ROOT, "examples", "lint-corpus");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f.startsWith("fail-"))
    .map((f) => path.join("examples/lint-corpus", f));
}

const report = { gold: [], corpus: [], pass: true };

console.log("Ad Intelligence — quality gates demo\n");

console.log("FULL-DEPTH GOLD (must PASS)");
for (const g of GOLD) {
  const row = lint(g);
  report.gold.push(row);
  const mark = row.ok ? "PASS" : "FAIL";
  if (!row.ok) report.pass = false;
  console.log(`  [${mark}] ${g}`);
}

console.log("\nLINT CORPUS (must FAIL)");
for (const c of listCorpus()) {
  const row = lint(c);
  report.corpus.push(row);
  const mark = !row.ok ? "CAUGHT" : "MISSED";
  if (row.ok) report.pass = false;
  console.log(`  [${mark}] ${c}`);
}

console.log("\nVISUAL GALLERY");
console.log("  examples/visual/attention-lab.html  (models + public libraries)");
console.log("  examples/visual/index.html          (storyboard frames)");
console.log("  examples/stress-briefs/             (messy prompts for agent drills)");

console.log("\nSTUDIES JOIN (retrieve patterns ⊕ studies + provenance)");
{
  const fixtureDir = path.join(ROOT, "studies", "fixtures", "private-join");
  const env = {
    ...process.env,
    AD_INTEL_STUDIES_PRIVATE: fixtureDir,
  };
  const r = spawnSync(
    process.execPath,
    [
      path.join(__dirname, "retrieve.mjs"),
      "--niche",
      "voice ai",
      "--platform",
      "meta",
      "--compact",
    ],
    { encoding: "utf8", cwd: ROOT, env }
  );
  let j = null;
  try {
    j = JSON.parse(r.stdout || "{}");
  } catch {
    j = null;
  }
  const items = j?.studies?.items || [];
  const hasFixture = items.some((s) => s.id === "study_fixture_join_voice");
  const hasProv = items.every((s) => s.provenance?.basis);
  const hasJoin = Boolean(j?.studies?.join?.rule);
  const synthesisHonest = items
    .filter((s) => s.provenance?.basis === "synthesis")
    .every((s) => s.provenance?.observed === false);
  const joinOk = hasFixture && hasProv && hasJoin && synthesisHonest && j?.studies?.primary;
  report.studies_join = { ok: joinOk, hasFixture, hasProv, hasJoin };
  if (!joinOk) report.pass = false;
  console.log(
    `  [${joinOk ? "PASS" : "FAIL"}] retrieve join + provenance (fixture private dir)`
  );
  if (!joinOk) {
    console.log(
      `         fixture=${hasFixture} prov=${hasProv} join=${hasJoin} primary=${j?.studies?.primary}`
    );
  }

  // Invalid private file must surface errors (loud fail)
  const badDir = path.join(ROOT, "packages", "_gate-bad-study");
  fs.mkdirSync(badDir, { recursive: true });
  fs.writeFileSync(
    path.join(badDir, "broken.json"),
    JSON.stringify({ id: "broken", title: "no provenance" })
  );
  const bad = spawnSync(
    process.execPath,
    [
      path.join(__dirname, "retrieve.mjs"),
      "--niche",
      "saas",
      "--platform",
      "meta",
      "--compact",
    ],
    {
      encoding: "utf8",
      cwd: ROOT,
      env: { ...process.env, AD_INTEL_STUDIES_PRIVATE: badDir },
    }
  );
  let badJ = null;
  try {
    badJ = JSON.parse(bad.stdout || "{}");
  } catch {
    badJ = null;
  }
  const loud =
    bad.status === 3 &&
    Array.isArray(badJ?.studies?.errors) &&
    badJ.studies.errors.length > 0;
  report.studies_loud = { ok: loud };
  if (!loud) report.pass = false;
  console.log(
    `  [${loud ? "PASS" : "FAIL"}] invalid private study fails loudly (exit 3)`
  );
  try {
    fs.rmSync(badDir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }

  // search_text format must survive compact projection (no silent video-shaped drop)
  const search = spawnSync(
    process.execPath,
    [
      path.join(__dirname, "retrieve.mjs"),
      "--niche",
      "local-services",
      "--platform",
      "meta",
      "--compact",
    ],
    {
      encoding: "utf8",
      cwd: ROOT,
      env: { ...process.env, AD_INTEL_STUDIES_PRIVATE: fixtureDir },
    }
  );
  let searchJ = null;
  try {
    searchJ = JSON.parse(search.stdout || "{}");
  } catch {
    searchJ = null;
  }
  const searchItem = (searchJ?.studies?.items || []).find(
    (s) => s.id === "study_fixture_search_text"
  );
  const formatOk =
    searchItem &&
    searchItem.format === "search_text" &&
    searchItem.timing_observable === false &&
    searchItem.structure?.format === "search_text" &&
    searchItem.structure?.timing_observable === false &&
    searchItem.structure?.format_note &&
    searchItem.structure?.duration_s == null &&
    Array.isArray(searchItem.observed_limits) &&
    searchItem.observed_limits.length >= 1 &&
    !(searchItem.structure?.beats || []).some((b) =>
      /\d+\s*[-–]\s*\d+\s*s|\b\d+\s*s\b/i.test(String(b.t || ""))
    );
  report.studies_format = { ok: !!formatOk, id: searchItem?.id || null };
  if (!formatOk) report.pass = false;
  console.log(
    `  [${formatOk ? "PASS" : "FAIL"}] search_text format projects through retrieve (not video-shaped)`
  );
  if (!formatOk) {
    console.log(
      `         item=${searchItem?.id} format=${searchItem?.format} timing=${searchItem?.timing_observable} note=${!!searchItem?.structure?.format_note}`
    );
  }
}

console.log("\nRENDER QA (pipeline — Oply v1 must FAIL for the right reasons)");
{
  const repoRoot = path.join(ROOT, "..", "..");
  const proveQa = path.join(repoRoot, "pipeline", "qa", "prove-qa.mjs");
  if (!fs.existsSync(proveQa)) {
    report.pass = false;
    console.log("  [FAIL] pipeline/qa/prove-qa.mjs missing");
  } else {
    const r = spawnSync(process.execPath, [proveQa], {
      encoding: "utf8",
      cwd: repoRoot,
      maxBuffer: 20 * 1024 * 1024,
    });
    const okQa = r.status === 0;
    if (!okQa) report.pass = false;
    report.render_qa = { ok: okQa };
    console.log(`  [${okQa ? "PASS" : "FAIL"}] prove-qa (oply-v1 expected fails)`);
    if (!okQa) console.log((r.stdout || r.stderr || "").slice(-400));
  }
}

console.log(
  report.pass
    ? "\nOK — gold green, corpus caught, studies join healthy, render QA green."
    : "\nERROR — unexpected lint/join/QA results; inspect above."
);

process.exit(report.pass ? 0 : 1);
