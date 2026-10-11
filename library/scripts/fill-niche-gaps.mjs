#!/usr/bin/env node
/**
 * Read asset-gap-report and acquire free stills for missing footage tags.
 * Prefers Pexels when PEXELS_API_KEY is set; else Wikimedia.
 *
 *   node library/scripts/fill-niche-gaps.mjs --niche home-services --limit 1
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
const limit = arg("--limit", "1");
const prefer = process.env.PEXELS_API_KEY
  ? "pexels"
  : process.env.PIXABAY_API_KEY
    ? "pixabay"
    : "wikimedia";

const QUERIES = {
  "home-services": [
    { missingIncludes: "phone", query: "smartphone on wooden desk night lamp", tag: "desk-phone" },
    { missingIncludes: "hands", query: "technician hands tools repair", tag: "trades-hands" },
    { missingIncludes: "van", query: "white work van street daylight", tag: "work-van" },
    { missingIncludes: "facility", query: "HVAC technician working outdoor unit", tag: "hvac-bay" },
    { missingIncludes: "talking-head", query: "person talking on phone portrait natural light", tag: "owner-ugc" },
  ],
  saas: [
    { missingIncludes: "laptop", query: "hands typing laptop desk", tag: "laptop-hands" },
    { missingIncludes: "office", query: "office desk window light computer", tag: "office-desk" },
    { missingIncludes: "phone", query: "smartphone notification desk", tag: "desk-phone" },
  ],
};

const gap = spawnSync(
  process.execPath,
  [path.join(__dirname, "asset-gap-report.mjs"), "--niche", niche],
  { encoding: "utf8" }
);
let report;
try {
  report = JSON.parse(gap.stdout || "{}");
} catch {
  console.error(gap.stderr || gap.stdout);
  process.exit(1);
}

const missing = (report.footage_gaps || []).map((g) => g.missing.toLowerCase());
const plan = QUERIES[niche] || QUERIES["home-services"];
const todo = plan.filter((p) =>
  missing.some((m) => m.includes(p.missingIncludes))
);

const results = [];
for (const job of todo) {
  const args = [
    path.join(__dirname, "acquire-assets.mjs"),
    "--source",
    prefer,
    "--query",
    job.query,
    "--tag",
    job.tag,
    "--niche",
    niche,
    "--limit",
    limit,
  ];
  // Wikimedia PD/CC-BY pool is thin for some queries — allow SA with attribution
  if (prefer === "wikimedia") args.push("--allow-sa");
  const r = spawnSync(process.execPath, args, {
    encoding: "utf8",
    env: process.env,
  });
  let body;
  try {
    body = JSON.parse(r.stdout || "{}");
  } catch {
    body = { ok: false, error: r.stderr || r.stdout };
  }
  results.push({ job, exit: r.status, body });
}

const gap2 = spawnSync(
  process.execPath,
  [path.join(__dirname, "asset-gap-report.mjs"), "--niche", niche],
  { encoding: "utf8" }
);
let after;
try {
  after = JSON.parse(gap2.stdout || "{}");
} catch {
  after = {};
}

console.log(
  JSON.stringify(
    {
      niche,
      source_used: prefer,
      attempted: results.length,
      results: results.map((r) => ({
        tag: r.job.tag,
        ok: r.body.ok,
        count: r.body.count,
        ids: (r.body.assets || []).map((a) => a.id),
      })),
      ceiling_before: report.quality_ceiling,
      ceiling_after: after.quality_ceiling,
      footage_gaps_remaining: after.footage_gaps || [],
      tip:
        prefer === "wikimedia"
          ? "Set PEXELS_API_KEY for higher-quality free stock (https://www.pexels.com/api/)"
          : "Pexels/Pixabay keyed — re-run to deepen the pack",
    },
    null,
    2
  )
);
