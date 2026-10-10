#!/usr/bin/env node
/**
 * Prove the skill works from a fresh checkout (any harness), not only a dirty workspace.
 *
 * CI: runs against the current checkout (Actions already cloned the PR ref).
 * Local: optional --clone clones the PR branch into a temp dir first.
 *
 * Usage:
 *   node scripts/fresh-clone-prove.mjs
 *   node scripts/fresh-clone-prove.mjs --clone
 *   node scripts/fresh-clone-prove.mjs --clone --ref cursor/multi-harness-agent-os-08cd
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL = path.join(__dirname, "..");
const REPO = path.join(SKILL, "../..");

const args = process.argv.slice(2);
const doClone = args.includes("--clone");
const refIdx = args.indexOf("--ref");
const ref =
  (refIdx >= 0 && args[refIdx + 1]) ||
  process.env.GITHUB_HEAD_REF ||
  process.env.GITHUB_REF_NAME ||
  "cursor/multi-harness-agent-os-08cd";

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function run(cmd, cwd, cmdArgs) {
  const r = spawnSync(cmd, cmdArgs, { encoding: "utf8", cwd });
  return r;
}

let root = REPO;

if (doClone) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ad-intel-prove-"));
  console.log(`Cloning ${ref} → ${tmp}`);
  // Prefer local origin URL
  const remote = run("git", REPO, ["remote", "get-url", "origin"]);
  const url = (remote.stdout || "").trim() || "https://github.com/HarrisCrypto/ad-intelligence.git";
  const clone = run("git", tmp, [
    "clone",
    "--depth",
    "1",
    "--branch",
    ref,
    url,
    "repo",
  ]);
  if (clone.status !== 0) {
    fail(`git clone failed:\n${clone.stderr || clone.stdout}`);
  }
  root = path.join(tmp, "repo");
}

const skill = path.join(root, "skills", "ad-intelligence");
if (!fs.existsSync(path.join(skill, "studies", "corpus.json"))) {
  fail(
    `studies/corpus.json missing under ${skill} — you may be on main (v3.9). Checkout the PR branch: ${ref}`
  );
}

const corpus = JSON.parse(
  fs.readFileSync(path.join(skill, "studies", "corpus.json"), "utf8")
);
if (!(corpus.studies || []).length) fail("corpus empty");
for (const s of corpus.studies) {
  if (!s.provenance || typeof s.provenance.observed !== "boolean") {
    fail(`study ${s.id} missing provenance.observed`);
  }
  if (!s.provenance.basis) fail(`study ${s.id} missing provenance.basis`);
}

const gates = run(process.execPath, skill, [
  path.join(skill, "scripts", "demo-quality-gates.mjs"),
]);
if (gates.status !== 0) {
  fail(`demo-quality-gates failed:\n${gates.stdout}\n${gates.stderr}`);
}

const retrieve = run(process.execPath, skill, [
  path.join(skill, "scripts", "retrieve.mjs"),
  "--niche",
  "voice ai",
  "--platform",
  "meta",
  "--compact",
]);
if (retrieve.status !== 0 && retrieve.status !== 2) {
  fail(`retrieve failed: ${retrieve.stderr}`);
}
let payload;
try {
  payload = JSON.parse(retrieve.stdout);
} catch {
  fail("retrieve did not return JSON");
}
if (!payload.studies?.primary) fail("retrieve missing studies.primary");
if (!payload.studies?.join?.rule) fail("retrieve missing studies.join.rule");
const item = (payload.studies.items || [])[0];
if (!item?.provenance?.basis) fail("retrieve study item missing provenance");
if (item.provenance.observed !== false && item.provenance.basis === "synthesis") {
  /* ok either way */
}
if (item.provenance.basis === "synthesis" && item.provenance.observed !== false) {
  fail("synthesis study must have observed:false");
}

console.log("OK — fresh checkout proves studies + gates + retrieve provenance join");
console.log(
  JSON.stringify(
    {
      root,
      ref,
      study: payload.studies.primary,
      provenance: item.provenance,
      gates: "pass",
    },
    null,
    2
  )
);
