#!/usr/bin/env node
/**
 * Prove render QA: synthesize Oply v1 fail fixture and assert expected hard fails.
 * Usage: node pipeline/qa/prove-qa.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const fixtureDir = path.join(ROOT, "regression", "fail", "oply-v1");
const video = path.join(fixtureDir, "fixture.mp4");
const expectPath = path.join(fixtureDir, "expected.json");

function runNode(rel, args = []) {
  return spawnSync(process.execPath, [path.join(ROOT, rel), ...args], {
    encoding: "utf8",
    cwd: ROOT,
    maxBuffer: 20 * 1024 * 1024,
  });
}

console.log("Render QA prove\n");

const syn = runNode("pipeline/qa/synthesize-oply-v1.mjs");
if (syn.status !== 0) {
  console.error("SYNTH FAIL\n", syn.stderr || syn.stdout);
  process.exit(1);
}
console.log("  [ok] synthesized", video);

const qa = runNode("pipeline/qa/run-qa.mjs", [
  video,
  "--expect",
  expectPath,
  "--spec",
  expectPath,
]);
let report = null;
try {
  report = JSON.parse(qa.stdout || "{}");
} catch {
  console.error("QA JSON parse fail\n", qa.stdout, qa.stderr);
  process.exit(1);
}

const matched = report.expect?.matched === true;
const mark = matched ? "PASS" : "FAIL";
console.log(`  [${mark}] oply-v1 expected fails caught`);
console.log(`         hard_fails=${(report.hard_fails || []).join(",")}`);
if (report.expect?.missing_fails?.length) {
  console.log(`         missing=${report.expect.missing_fails.join(",")}`);
}
if (!matched) {
  console.log("\nERROR — QA did not catch required Oply v1 defects. Fix QA first.");
  process.exit(1);
}

console.log("\nOK — regression/fail/oply-v1 fails for the right reasons.");
process.exit(0);
