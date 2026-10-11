#!/usr/bin/env node
/**
 * Prove validate-card and observed-honesty still catch a bad observed card
 * and accept a measured one. Fixtures are not ads.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const validator = path.join(root, "classroom/scripts/validate-card.mjs");

function run(file) {
  return spawnSync(process.execPath, [validator, file], { encoding: "utf8" });
}

const pass = run(path.join(root, "regression/cards/observed-pass.json"));
const fail = run(path.join(root, "regression/cards/observed-fail.json"));

if (pass.status !== 0) {
  console.error("expected observed-pass to lint clean\n", pass.stderr || pass.stdout);
  process.exit(1);
}
if (fail.status === 0) {
  console.error("expected observed-fail to be rejected");
  process.exit(1);
}
if (!/loudness_lufs/i.test(`${fail.stderr}\n${fail.stdout}`)) {
  console.error("observed-fail was rejected for the wrong reason\n", fail.stderr);
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, pass: "observed-pass", fail: "observed-fail" }));
