#!/usr/bin/env node
/**
 * Precompute compact retrieve slices so no-shell harnesses don't invent pattern ids.
 * Usage: node scripts/build-offline-retrieve.mjs [--write]
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DEST = path.join(ROOT, "references", "retrieve-offline-compact.json");

const QUERIES = [
  { niche: "beauty", platform: "tiktok" },
  { niche: "shampoo", platform: "tiktok" },
  { niche: "food", platform: "instagram" },
  { niche: "saas", platform: "meta" },
  { niche: "voice ai", platform: "meta" },
  { niche: "local-services", platform: "meta" },
  { niche: "ecommerce", platform: "tiktok" },
  { niche: "fitness", platform: "tiktok" },
  { niche: "fintech", platform: "meta" },
  { niche: "apps", platform: "tiktok" },
];

function retrieve(niche, platform) {
  const r = spawnSync(
    process.execPath,
    [
      path.join(ROOT, "scripts", "retrieve.mjs"),
      "--niche",
      niche,
      "--platform",
      platform,
      "--limit",
      "5",
      "--compact",
    ],
    { encoding: "utf8", cwd: ROOT }
  );
  if (!r.stdout) throw new Error(`retrieve failed for ${niche}: ${r.stderr}`);
  return JSON.parse(r.stdout);
}

const by_query = {};
for (const q of QUERIES) {
  const key = `${q.niche}|${q.platform}`;
  const j = retrieve(q.niche, q.platform);
  by_query[key] = {
    query: q,
    resolved: j.resolved,
    picks: j.picks,
    attention_models: j.attention_models
      ? {
          primary: j.attention_models.primary,
          challenger: j.attention_models.challenger,
          models: (j.attention_models.models || []).slice(0, 4).map((m) => ({
            id: m.id,
            name: m.name,
            why_stops_scroll: m.why_stops_scroll,
            pattern_ids: m.pattern_ids,
            ideal_seconds: m.ideal_seconds,
            timing: m.timing,
            anti_slop: m.anti_slop,
          })),
          research: j.attention_models.research,
        }
      : null,
    studies: j.studies
      ? {
          primary: j.studies.primary,
          challenger: j.studies.challenger,
          count: j.studies.count,
          human_build_os: j.studies.human_build_os,
          join: j.studies.join
            ? {
                rule: j.studies.join.rule,
                pattern_study_conflict: j.studies.join.pattern_study_conflict,
                conflict_resolution: j.studies.join.conflict_resolution,
              }
            : null,
          items: (j.studies.items || []).slice(0, 2).map((s) => ({
            id: s.id,
            class: s.class,
            title: s.title,
            provenance: s.provenance,
            when_to_emulate: s.when_to_emulate,
            steal: s.steal,
            never_copy: s.never_copy,
            structure: s.structure,
            human_build: s.human_build,
            attention_model_ids: s.attention_model_ids,
            pattern_ids: s.pattern_ids,
          })),
        }
      : null,
    results: (j.results || []).slice(0, 5).map((r) => ({
      id: r.id,
      name: r.name,
      production_tier: r.production_tier,
      virality_posture: r.virality_posture,
    })),
  };
}

const out = {
  id: "retrieve-offline-compact",
  version: "1.1.0",
  updated: new Date().toISOString().slice(0, 10),
  purpose:
    "Compact retrieve slices for harnesses without shell. Prefer live retrieve.mjs when available. Never invent pattern ids or study ids.",
  how_to_use:
    "Match niche|platform key (or closest). Paste picks + attention_models + studies into package Retrieval. Then one-shot (study → emulate → human_build).",
  by_query,
};

if (process.argv.includes("--write") || !process.argv.includes("--stdout")) {
  fs.writeFileSync(DEST, JSON.stringify(out, null, 2) + "\n");
  console.error(
    `Wrote ${DEST} (${Object.keys(by_query).length} queries, ${Buffer.byteLength(JSON.stringify(out))} bytes)`
  );
}
if (process.argv.includes("--stdout")) {
  process.stdout.write(JSON.stringify(out, null, 2));
}
