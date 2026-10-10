#!/usr/bin/env node
/**
 * Gate 6 — vision critic (offline mode by default).
 * Usage:
 *   node pipeline/critic/critique-frames.mjs --spec specs/examples/oply-missed-call.ad-spec.json
 *   node pipeline/critic/critique-frames.mjs --spec S.json --video V.mp4
 *   node pipeline/critic/critique-frames.mjs --spec S.json --qa-report report.json
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

function fail(msg) {
  console.error(msg);
  process.exit(2);
}

const specPath = arg("--spec");
if (!specPath) fail("Usage: critique-frames.mjs --spec <ad-spec.json> [--video v.mp4] [--qa-report r.json]");
const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
const video = arg("--video");
const qaReportPath = arg("--qa-report");

const findings = [];
function note(severity, id, message, fix) {
  findings.push({ severity, id, message, fix });
}

// Spec / package critic
if (!spec.structure?.format) note("hard", "format_missing", "structure.format missing", "Set format + timing_observable");
if (
  ["search_text", "display_static", "carousel_static"].includes(spec.structure?.format) &&
  spec.structure?.timing_observable !== false
) {
  note("hard", "format_lie", "Non-video format claims timing", "Set timing_observable:false");
}
if (spec.structure?.format === "video_timed" && (!spec.timeline || spec.timeline.length < 3)) {
  note("warn", "thin_timeline", "Video timed with <3 beats — risk of hook-only", "Expand to full void→demo→CTA");
}
const cta = (spec.cta?.primary || "").toLowerCase();
for (const ban of spec.cta?.jargon_ban || ["access call", "unlock ai"]) {
  if (cta.includes(ban.toLowerCase())) {
    note("hard", "cta_jargon", `CTA contains banned jargon: ${ban}`, "Use Call / Book demo");
  }
}
if ((spec.cta?.on_screen_min_s || 0) < 3 && spec.structure?.format === "video_timed") {
  note("warn", "cta_short", "CTA hold <3s", "Hold endcard ≥3s in safe zone");
}
const hasPlaceholderProof = (spec.claim_ledger || []).some(
  (r) => /call volume|booking %|roi|#[0-9]/i.test(r.claim_or_asset) && r.tag !== "PLACEHOLDER" && r.tag !== "USER_SUPPLIED" && r.tag !== "ASSET_VERIFIED"
);
if (hasPlaceholderProof) {
  note("hard", "invented_proof", "Metric-like claim not PLACEHOLDER/USER/ASSET", "Downgrade tag or remove");
}
if (spec.render_status === "RENDERED" && !video && !qaReportPath) {
  note("hard", "render_unproven", "RENDERED without video/QA receipt", "Attach --video or --qa-report");
}
if (!(spec.what_not_to_copy || []).length) {
  note("hard", "no_firewall", "what_not_to_copy empty", "Add asset firewall list");
}

// Steal-list reminders from linked study cards when present
for (const id of spec.retrieval?.study_card_ids || []) {
  const candidates = [
    path.join(ROOT, "classroom/study-cards/home-services", `${id}.json`),
    path.join(ROOT, "classroom/study-cards/technique", `${id}.json`),
  ];
  const hit = candidates.find((p) => fs.existsSync(p));
  if (!hit) {
    note("warn", "card_missing", `Study card not found: ${id}`, "Fix retrieval.study_card_ids");
    continue;
  }
  const card = JSON.parse(fs.readFileSync(hit, "utf8"));
  if (card.steal?.length) {
    note("info", "steal_reminder", `${id}: ${card.steal.slice(0, 2).join("; ")}`, "Check beats emulate these");
  }
}

let qa = null;
if (qaReportPath) {
  qa = JSON.parse(fs.readFileSync(qaReportPath, "utf8"));
} else if (video) {
  const r = spawnSync(
    process.execPath,
    [path.join(ROOT, "pipeline/qa/run-qa.mjs"), video, "--spec", specPath],
    { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }
  );
  try {
    qa = JSON.parse(r.stdout || "{}");
  } catch {
    note("hard", "qa_parse", "Could not parse QA output", r.stderr || "re-run run-qa");
  }
}

if (qa) {
  for (const id of qa.hard_fails || []) {
    note("hard", `qa_${id}`, `Render QA hard-fail: ${id}`, "Fix before delivery");
  }
  if (qa.ok) note("info", "qa_green", "Render QA passed instruments", "Still review taste notes below");
}

const hard = findings.filter((f) => f.severity === "hard");
const report = {
  ok: hard.length === 0,
  mode: video || qaReportPath ? "offline+qa" : "offline-spec",
  spec_id: spec.id,
  findings,
  top_fixes: hard.slice(0, 3).map((f) => f.fix),
  rule: "Instruments first (Phase 5); critic adds package/taste. Max 3 fixes per loop.",
};

console.log(JSON.stringify(report, null, 2));
process.exit(report.ok ? 0 : 1);
