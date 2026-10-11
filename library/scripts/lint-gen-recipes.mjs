#!/usr/bin/env node
/**
 * Fail if any gen recipe is missing paste-ready fields.
 *
 *   node library/scripts/lint-gen-recipes.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const file = path.join(ROOT, "library/realism/gen-recipes.json");

const REQUIRED = ["id", "tool", "prompt", "aspect", "duration_s", "camera", "mode"];

const raw = JSON.parse(fs.readFileSync(file, "utf8"));
const recipes = raw.recipes || [];
const failures = [];

if (!recipes.length) failures.push({ error: "no recipes" });

for (const r of recipes) {
  for (const k of REQUIRED) {
    const v = r[k];
    if (v == null || v === "" || (typeof v === "string" && !v.trim())) {
      failures.push({ id: r.id || "?", field: k, error: "empty" });
    }
  }
  if (r.duration_s != null && !(Number(r.duration_s) > 0 && Number(r.duration_s) <= 30)) {
    failures.push({ id: r.id, field: "duration_s", error: "must be 0–30s short clip" });
  }
  if (r.prompt && String(r.prompt).trim().length < 40) {
    failures.push({ id: r.id, field: "prompt", error: "too short to be paste-ready" });
  }
}

const ok = failures.length === 0;
console.log(
  JSON.stringify(
    {
      gate: "lint-gen-recipes",
      ok,
      n: recipes.length,
      required: REQUIRED,
      failures,
      rule: "Every recipe needs tool + prompt + aspect + duration_s + camera + mode — empty fields fail.",
    },
    null,
    2
  )
);
process.exit(ok ? 0 : 1);
