#!/usr/bin/env node
/**
 * Handoff deliverable: paste-ready gen-pack.md for Higgsfield / Seedance / Kling / peers.
 *
 * A handoff run is NOT complete without this file.
 *
 *   node scripts/write-gen-pack.mjs --out packages/hvac-ad/gen-pack.md --niche home-services
 *   node scripts/write-gen-pack.mjs --out packages/hvac-ad/gen-pack.md --niche home-services \
 *     --tool higgsfield --aspect 9:16 --package packages/hvac-ad.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPO = path.join(ROOT, "../..");

function arg(n, d = null) {
  const i = process.argv.indexOf(n);
  return i >= 0 ? process.argv[i + 1] : d;
}

const out = arg("--out");
const niche = arg("--niche", "home-services");
const toolOverride = arg("--tool");
const aspectOverride = arg("--aspect");
const packagePath = arg("--package");
const brand = arg("--brand", "BRAND");

if (!out) {
  console.error(
    "Usage: write-gen-pack.mjs --out <package>/gen-pack.md --niche <niche> [--tool higgsfield] [--package pkg.md]"
  );
  process.exit(1);
}

const recipesPath = path.join(REPO, "library/realism/gen-recipes.json");
const recipesFile = JSON.parse(fs.readFileSync(recipesPath, "utf8"));
let recipes = (recipesFile.recipes || []).filter(
  (r) => !niche || r.niche === niche || (r.niches || []).includes(niche)
);
if (!recipes.length) recipes = recipesFile.recipes || [];

const negatives = (recipesFile.global_negatives || []).join(", ");

/** Optional: pull beat labels from package timed script */
let beats = [];
if (packagePath) {
  const abs = path.isAbsolute(packagePath)
    ? packagePath
    : path.join(ROOT, packagePath);
  if (fs.existsSync(abs)) {
    const md = fs.readFileSync(abs, "utf8");
    const m = md.match(/### Timed script[\s\S]*?(?=### |\n## )/i);
    if (m) {
      for (const line of m[0].split("\n")) {
        if (/^\|/.test(line) && !/t_start|---/.test(line)) {
          const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
          if (cells.length >= 3) beats.push({ t: cells[0], vo: cells[2] || cells[1] });
        }
      }
    }
  }
}

const lines = [];
lines.push(`# Gen pack — handoff (${niche})`);
lines.push("");
lines.push(`Brand: ${brand}`);
lines.push(`Niche: ${niche}`);
lines.push(`Rung: **handoff**`);
lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
lines.push("");
lines.push(
  "Run each shot in Higgsfield / Seedance / Kling (or the tool named below). Drop exported clips into `classroom/private-cache/` or the package media folder, then finish in CapCut per `finish-the-cut.md`."
);
lines.push("");
lines.push("## Global negatives");
lines.push("");
lines.push(negatives);
lines.push("");
lines.push("## Shots");
lines.push("");

recipes.forEach((r, i) => {
  const tool = toolOverride || r.tool || recipesFile.default_tool || "higgsfield";
  const aspect = aspectOverride || r.aspect || "9:16";
  const mode = r.mode || "t2v";
  const beat = beats[i];
  lines.push(`### Shot ${i + 1} — \`${r.id}\``);
  lines.push("");
  lines.push(`| Field | Value |`);
  lines.push(`| --- | --- |`);
  lines.push(`| Job | ${r.shot_job || r.id} |`);
  lines.push(`| Tool / model | **${tool}** |`);
  lines.push(`| Mode | ${mode} |`);
  lines.push(`| Aspect | ${aspect} |`);
  lines.push(`| Duration | ${r.duration_s}s |`);
  lines.push(`| Camera | ${r.camera || "cam_phone_native"} |`);
  lines.push(`| Lighting | ${r.lighting || "practical / daylight"} |`);
  if (r.ref_image) lines.push(`| Ref image | ${r.ref_image} |`);
  else lines.push(`| Ref image | _(none — t2v; attach brand/product still if you have one)_ |`);
  if (beat) lines.push(`| Beat cue | ${beat.t} — ${beat.vo} |`);
  lines.push("");
  lines.push("**Paste-ready prompt:**");
  lines.push("");
  lines.push("```");
  lines.push(String(r.prompt).trim());
  lines.push("");
  lines.push(`Negatives: ${negatives}`);
  lines.push("```");
  lines.push("");
  if (r.still_prompt && mode === "i2v") {
    lines.push("**Keyframe (generate still first):**");
    lines.push("");
    lines.push("```");
    lines.push(String(r.still_prompt).trim());
    lines.push("```");
    lines.push("");
    lines.push("**i2v motion:**");
    lines.push("");
    lines.push("```");
    lines.push(String(r.i2v_prompt || "").trim());
    lines.push("```");
    lines.push("");
  }
  lines.push("---");
  lines.push("");
});

lines.push("## After generate");
lines.push("");
lines.push("1. Export mp4 per shot (keep filenames `shot-01-…mp4`).");
lines.push("2. Place in package media / CapCut bin.");
lines.push("3. Hard-cut between setups; burn captions/CTA/audio in post.");
lines.push("4. Do **not** substitute stock to skip this pack when rung is handoff.");
lines.push("");
lines.push("## Completeness");
lines.push("");
lines.push(
  "Handoff is incomplete without this file. See `fm_skipped_handoff` in `classroom/known-failure-modes.md`."
);
lines.push("");

// Resolve relative to process cwd (repo root when invoked from workspace).
const absOut = path.isAbsolute(out) ? out : path.resolve(process.cwd(), out);
fs.mkdirSync(path.dirname(absOut), { recursive: true });
fs.writeFileSync(absOut, lines.join("\n"));

console.log(
  JSON.stringify(
    {
      ok: true,
      wrote: absOut,
      shots: recipes.length,
      niche,
      rule: "handoff rung requires gen-pack.md — paste into Higgsfield/Seedance/Kling",
    },
    null,
    2
  )
);
