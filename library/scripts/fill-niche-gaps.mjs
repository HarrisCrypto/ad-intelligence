#!/usr/bin/env node
/**
 * Fill niche footage gaps with real moving clips (never stills).
 *
 *   node library/scripts/fill-niche-gaps.mjs --niche home-services
 *   node library/scripts/fill-niche-gaps.mjs --niche home-services --keep 3
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function arg(name, def = null) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : def;
}

const niche = arg("--niche", "home-services");
const keep = arg("--keep", "3");
const harvest = arg("--harvest", "16");

const r = spawnSync(
  process.execPath,
  [
    path.join(__dirname, "acquire-footage.mjs"),
    "--niche",
    niche,
    "--keep",
    keep,
    "--harvest",
    harvest,
  ],
  { encoding: "utf8", env: process.env, maxBuffer: 20 * 1024 * 1024 }
);

let body;
try {
  body = JSON.parse(r.stdout || "{}");
} catch {
  body = { ok: false, error: r.stderr || r.stdout };
}

const gap = spawnSync(
  process.execPath,
  [path.join(__dirname, "asset-gap-report.mjs"), "--niche", niche],
  { encoding: "utf8" }
);
let after;
try {
  after = JSON.parse(gap.stdout || "{}");
} catch {
  after = {};
}

console.log(
  JSON.stringify(
    {
      ok: !!body.ok && (after.footage_gaps || []).length === 0,
      acquire: body,
      after,
      rule: "Video-only footage path. Gaps downgrade ceiling — never substitute stills.",
    },
    null,
    2
  )
);
process.exit(r.status === 0 && (after.footage_gaps || []).length === 0 ? 0 : 2);
