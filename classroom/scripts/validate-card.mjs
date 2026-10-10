#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const schema = JSON.parse(
  fs.readFileSync(path.join(ROOT, "study-cards/_schema.json"), "utf8")
);

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const file = process.argv[2];
if (!file) fail("Usage: node classroom/scripts/validate-card.mjs <card.json>");
const card = JSON.parse(fs.readFileSync(file, "utf8"));

for (const k of schema.required) {
  if (card[k] === undefined) fail(`${file}: missing ${k}`);
}
if (!card.structure?.format || typeof card.structure.timing_observable !== "boolean") {
  fail(`${file}: structure.format + timing_observable required`);
}
if (
  ["search_text", "display_static", "carousel_static"].includes(card.structure.format) &&
  card.structure.timing_observable !== false
) {
  fail(`${file}: non-video format must have timing_observable:false`);
}
if (!Array.isArray(card.what_not_to_copy) || card.what_not_to_copy.length < 1) {
  fail(`${file}: what_not_to_copy required`);
}
// media rejection
const blob = JSON.stringify(card);
if (/data:(image|video|audio)\//i.test(blob) || /"base64"/i.test(blob)) {
  fail(`${file}: media payload rejected`);
}
console.log(JSON.stringify({ ok: true, id: card.id, status: card.status }, null, 2));
