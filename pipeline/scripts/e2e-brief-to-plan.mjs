#!/usr/bin/env node
/**
 * E2E (package path): one-paragraph brief → retrieve → ad-spec validate →
 * compose plan → optional synthetic v2 render + QA + critic.
 *
 *   node pipeline/scripts/e2e-brief-to-plan.mjs
 *   node pipeline/scripts/e2e-brief-to-plan.mjs --render
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const doRender = process.argv.includes("--render");

function run(rel, args = []) {
  const r = spawnSync(process.execPath, [path.join(ROOT, rel), ...args], {
    encoding: "utf8",
    cwd: ROOT,
    maxBuffer: 20 * 1024 * 1024,
  });
  return r;
}

const brief =
  "Oply: after-hours AI phone agent for HVAC / home-services. " +
  "Make missed calls expensive, show the agent answer and book, one CTA.";

const steps = [];

// 1) retrieve study cards
let r = run("classroom/scripts/retrieve-cards.mjs", [
  "--niche",
  "home-services",
  "--platform",
  "meta",
  "--limit",
  "5",
]);
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}
const cards = JSON.parse(r.stdout);
steps.push({
  step: "retrieve",
  ok:
    cards.ok === true &&
    cards.count >= 5 &&
    (cards.observed_in_result || 0) >= 1 &&
    typeof cards.ceiling === "string" &&
    cards.coverage?.floor_ok === true,
  count: cards.count,
  observed_in_result: cards.observed_in_result,
  ceiling: cards.ceiling,
  achieved_rung: cards.achieved_rung,
});

// 2) validate ad-spec
r = run("specs/validate-ad-spec.mjs", [
  "specs/examples/oply-missed-call.ad-spec.json",
]);
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}
steps.push({ step: "validate_spec", ok: true, ...(JSON.parse(r.stdout)) });

// 3a) materials assert — motion + ad_grade rung
r = run("library/scripts/assert-assets.mjs", ["--niche", "home-services"]);
let materials = {};
try {
  materials = JSON.parse(r.stdout || "{}");
} catch {
  materials = {};
}
steps.push({
  step: "assert_assets",
  ok:
    materials.audio_ok &&
    materials.ad_grade_ok === true &&
    (materials.basket_poison || []).length === 0 &&
    (materials.buckets?.P0?.missing || []).length === 0,
  achieved_rung: materials.achieved_rung,
  ad_grade_ok: materials.ad_grade_ok,
  P0: materials.buckets?.P0,
});

// 3b) human assembly — moving footage in every footage slot
r = run("library/scripts/assemble-plan.mjs", [
  "--card",
  "hvac-missed-call-void-01",
  "--niche",
  "home-services",
]);
let assemble = {};
try {
  assemble = JSON.parse(r.stdout || "{}");
} catch {
  assemble = {};
}
const footageSlots = (assemble.timeline || []).filter((t) => t.footage_bucket);
const movingOk =
  footageSlots.length >= 3 &&
  footageSlots.every((t) => t.picture?.id && !t.picture?.gap);
steps.push({
  step: "assemble_plan_motion",
  ok: !!assemble.ok && movingOk,
  achieved_rung: assemble.achieved_rung,
  slots: footageSlots.map((t) => ({
    bucket: t.footage_bucket,
    id: t.picture?.id,
  })),
});

// 3c) compose plan from toolbox
r = run("library/scripts/demo-compose-plan.mjs", ["--brand", "Oply"]);
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}
const plan = JSON.parse(r.stdout);
steps.push({
  step: "compose_plan",
  ok: plan.ok && plan.beats?.length >= 4,
  beats: plan.beats?.map((b) => b.id),
  achieved_rung: plan.achieved_rung,
  ad_grade_ok: plan.ad_grade_ok,
});

// 4) offline critic on spec
r = run("pipeline/critic/critique-frames.mjs", [
  "--spec",
  "specs/examples/oply-missed-call.ad-spec.json",
]);
const criticSpec = (() => {
  try {
    return JSON.parse(r.stdout);
  } catch {
    return { ok: false };
  }
})();
steps.push({ step: "critic_spec", ok: criticSpec.ok, findings: criticSpec.findings?.length });

let qa = null;
let criticRender = null;
if (doRender) {
  r = run("pipeline/qa/synthesize-oply-v2.mjs");
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout);
    process.exit(1);
  }
  const syn = JSON.parse(r.stdout);
  steps.push({ step: "synthesize_v2", ok: syn.ok, out: syn.out });

  r = run("pipeline/qa/run-qa.mjs", [syn.out, "--spec", syn.qa_spec]);
  try {
    qa = JSON.parse(r.stdout);
  } catch {
    qa = { ok: false };
  }
  steps.push({
    step: "qa_v2",
    ok: qa.ok,
    hard_fails: qa.hard_fails || [],
  });

  const tmpQa = path.join(ROOT, "regression", "pass", "oply-v2", "last-qa.json");
  fs.mkdirSync(path.dirname(tmpQa), { recursive: true });
  fs.writeFileSync(tmpQa, JSON.stringify(qa, null, 2));

  r = run("pipeline/critic/critique-frames.mjs", [
    "--spec",
    "specs/examples/oply-missed-call.ad-spec.json",
    "--qa-report",
    tmpQa,
  ]);
  try {
    criticRender = JSON.parse(r.stdout);
  } catch {
    criticRender = { ok: false };
  }
  steps.push({
    step: "critic_render",
    ok: criticRender.ok,
    top_fixes: criticRender.top_fixes || [],
  });
}

const ok = steps.every((s) => s.ok);
const report = {
  ok,
  brief,
  steps,
  vs_v1: doRender
    ? "v2 synthetic targets PASS where regression/fail/oply-v1 must FAIL"
    : "pass --render to synthesize v2 + QA",
  next_human: [
    "Merge PR when CI green",
    "brand-harvest.mjs https://oplyai.com",
    "Replace synthetic panels with uikit stills + licensed bed for client delivery",
  ],
};
console.log(JSON.stringify(report, null, 2));
process.exit(ok ? 0 : 1);
