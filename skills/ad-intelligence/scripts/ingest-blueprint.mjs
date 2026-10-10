#!/usr/bin/env node
/**
 * Produce a validated private study from notes / AdBlueprint / study JSON.
 *
 * Usage:
 *   node scripts/ingest-blueprint.mjs path/to/notes.json [--write]
 *   node scripts/ingest-blueprint.mjs ../../ingest/sample-ingest.json --write
 *
 * Validates against study rules (+ AdBlueprint required fields when blueprint-shaped).
 * Writes to studies/private/<id>.json (gitignored). Never invents metrics.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  blueprintToStudy,
  isBlueprintShape,
  isStudyShape,
  validateBlueprint,
  validateStudy,
} from "./lib/validate-study.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PRIV = path.join(ROOT, "studies", "private");

function parseArgs(argv) {
  const out = { write: false, file: null, force: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--write") out.write = true;
    else if (a === "--force") out.force = true;
    else if (!a.startsWith("-") && !out.file) out.file = a;
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.file) {
    console.error(
      "Usage: node scripts/ingest-blueprint.mjs <json> [--write] [--force]"
    );
    process.exit(2);
  }
  const abs = path.resolve(process.cwd(), args.file);
  if (!fs.existsSync(abs)) {
    console.error(`File not found: ${abs}`);
    process.exit(2);
  }
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch (e) {
    console.error(`JSON parse failed: ${e.message}`);
    process.exit(2);
  }

  let study;
  let kind;
  const errors = [];

  if (isBlueprintShape(raw)) {
    kind = "blueprint";
    errors.push(...validateBlueprint(raw, { file: path.basename(abs) }));
    if (!errors.length) study = blueprintToStudy(raw);
  } else if (isStudyShape(raw)) {
    kind = "study";
    if (!raw.provenance) {
      errors.push("study missing provenance { observed, basis, claim_firewall }");
    }
    errors.push(...validateStudy(raw, { file: path.basename(abs) }));
    study = { ...raw, private: true };
  } else {
    console.error(
      JSON.stringify(
        {
          ok: false,
          errors: [
            "Unrecognized shape — need AdBlueprint (hook/body/cta) or study (structure/steal/human_build) with provenance",
          ],
        },
        null,
        2
      )
    );
    process.exit(2);
  }

  if (errors.length) {
    console.error(JSON.stringify({ ok: false, kind, errors }, null, 2));
    process.exit(1);
  }

  // Final study validation after normalize
  const post = validateStudy(study, { file: study.id });
  if (post.length) {
    console.error(JSON.stringify({ ok: false, kind, errors: post }, null, 2));
    process.exit(1);
  }

  const dest = path.join(PRIV, `${study.id}.json`);
  const result = {
    ok: true,
    kind,
    id: study.id,
    provenance: study.provenance,
    dest: path.relative(ROOT, dest),
    written: false,
    note: "Private file is gitignored. Retrieve loads studies/private/*.json and fails loudly on invalid files.",
  };

  if (args.write) {
    fs.mkdirSync(PRIV, { recursive: true });
    if (fs.existsSync(dest) && !args.force) {
      console.error(
        JSON.stringify(
          { ok: false, errors: [`exists: ${dest} (pass --force)`] },
          null,
          2
        )
      );
      process.exit(1);
    }
    fs.writeFileSync(dest, JSON.stringify(study, null, 2) + "\n");
    result.written = true;
  }

  console.log(JSON.stringify(result, null, 2));
  if (!args.write) {
    console.error("(dry-run — pass --write to save under studies/private/)");
  }
}

main();
