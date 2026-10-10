#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = JSON.parse(
  fs.readFileSync(path.join(__dirname, "ad-spec.schema.json"), "utf8")
);

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const file = process.argv[2];
if (!file) fail("Usage: node specs/validate-ad-spec.mjs <ad-spec.json>");
const spec = JSON.parse(fs.readFileSync(file, "utf8"));

for (const k of schema.required) {
  if (spec[k] === undefined) fail(`${file}: missing ${k}`);
}
const st = spec.structure;
if (!st?.format || typeof st.timing_observable !== "boolean") {
  fail(`${file}: structure.format + timing_observable required`);
}
if (
  ["search_text", "display_static", "carousel_static"].includes(st.format) &&
  st.timing_observable !== false
) {
  fail(`${file}: non-video format must have timing_observable:false`);
}
if (!Array.isArray(spec.timeline) || spec.timeline.length < 2) {
  fail(`${file}: timeline needs ≥2 beats`);
}
if (!Array.isArray(spec.what_not_to_copy) || !spec.what_not_to_copy.length) {
  fail(`${file}: what_not_to_copy required`);
}
if (!Array.isArray(spec.claim_ledger) || !spec.claim_ledger.length) {
  fail(`${file}: claim_ledger required`);
}
for (const row of spec.claim_ledger) {
  if (!["USER_SUPPLIED", "ASSET_VERIFIED", "PLACEHOLDER", "ASSUMED"].includes(row.tag)) {
    fail(`${file}: bad claim tag ${row.tag}`);
  }
}
if (spec.render_status === "RENDERED" && st.format === "video_timed") {
  // soft warning only — finish gate is evidence-derived elsewhere
}
console.log(
  JSON.stringify(
    {
      ok: true,
      id: spec.id,
      template_id: spec.template_id || null,
      format: st.format,
      timing_observable: st.timing_observable,
      render_status: spec.render_status,
    },
    null,
    2
  )
);
