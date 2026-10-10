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
console.log("  examples/visual/index.html  (open in browser)");
console.log("  examples/stress-briefs/     (messy prompts for agent drills)");

console.log(
  report.pass
    ? "\nOK — gold green, corpus caught. Gates look healthy."
    : "\nERROR — unexpected lint results; inspect above."
);

process.exit(report.pass ? 0 : 1);
