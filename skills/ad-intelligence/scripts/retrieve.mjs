#!/usr/bin/env node
/**
 * Retrieve ad blueprints by platform / style / funnel / niche / tier / virality / job.
 *
 * Usage:
 *   node retrieve.mjs --niche beauty --tag viral --limit 5
 *   node retrieve.mjs --production high_production --virality brand_film
 *   node retrieve.mjs --platform tiktok --job "pov trend skit"
 *   node retrieve.mjs --list
 *   node retrieve.mjs --list-niches
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_ROOT = path.join(__dirname, "..", "database");
const INDEX_PATH = path.join(DB_ROOT, "index.json");

function parseArgs(argv) {
  const out = { limit: 5, list: false, listNiches: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--list") out.list = true;
    else if (a === "--list-niches") out.listNiches = true;
    else if (a === "--platform" && next) {
      out.platform = next;
      i++;
    } else if (a === "--style" && next) {
      out.style = next;
      i++;
    } else if (a === "--funnel" && next) {
      out.funnel_stage = next;
      i++;
    } else if (a === "--niche" && next) {
      out.niche = next;
      i++;
    } else if (a === "--job" && next) {
      out.job = next;
      i++;
    } else if (a === "--tag" && next) {
      out.tag = next;
      i++;
    } else if ((a === "--production" || a === "--tier") && next) {
      out.production_tier = next;
      i++;
    } else if (a === "--virality" && next) {
      out.virality_posture = next;
      i++;
    } else if (a === "--limit" && next) {
      out.limit = Number(next) || 5;
      i++;
    } else if (a === "--id" && next) {
      out.id = next;
      i++;
    }
  }
  return out;
}

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function scoreEntry(entry, q) {
  let score = 0;
  const hay = [
    entry.id,
    entry.style,
    entry.funnel_stage,
    entry.production_tier,
    entry.virality_posture,
    ...(entry.platforms || []),
    ...(entry.niches || []),
    ...(entry.tags || []),
  ]
    .join(" ")
    .toLowerCase();

  if (q.id && entry.id === q.id) return 1000;

  if (q.platform && q.platform !== "any") {
    if ((entry.platforms || []).includes(q.platform)) score += 5;
    else score -= 2;
  }
  if (q.style) {
    const s = q.style.toLowerCase();
    if (
      entry.style === q.style ||
      (entry.style || "").includes(s) ||
      entry.id.includes(s.replace(/_/g, "-"))
    )
      score += 6;
  }
  if (q.funnel_stage && q.funnel_stage !== "any") {
    if (entry.funnel_stage === q.funnel_stage) score += 4;
  }
  if (q.production_tier && q.production_tier !== "any") {
    if (entry.production_tier === q.production_tier) score += 6;
    else if (
      q.production_tier.includes("high") &&
      (entry.tags || []).includes("high-production")
    )
      score += 4;
  }
  if (q.virality_posture && q.virality_posture !== "any") {
    if (entry.virality_posture === q.virality_posture) score += 6;
  }
  if (q.tag) {
    const t = q.tag.toLowerCase();
    if ((entry.tags || []).some((x) => x.toLowerCase().includes(t))) score += 8;
    if (t === "viral" && (entry.tags || []).includes("viral")) score += 4;
  }
  if (q.niche) {
    const n = q.niche.toLowerCase();
    if (
      (entry.niches || []).some(
        (x) => x.toLowerCase().includes(n) || n.includes(x.toLowerCase())
      )
    )
      score += 6;
    if (hay.includes(n)) score += 2;
  }
  if (q.job) {
    for (const token of q.job.toLowerCase().split(/\s+/).filter(Boolean)) {
      if (hay.includes(token)) score += 2;
    }
  }
  return score;
}

function main() {
  const q = parseArgs(process.argv);
  const index = loadJson(INDEX_PATH);

  if (q.list) {
    console.log(
      JSON.stringify(
        index.patterns.map((p) => ({
          id: p.id,
          style: p.style,
          funnel_stage: p.funnel_stage,
          production_tier: p.production_tier,
          virality_posture: p.virality_posture,
          platforms: p.platforms,
          niches: p.niches,
          tags: p.tags,
        })),
        null,
        2
      )
    );
    return;
  }

  if (q.listNiches) {
    console.log(JSON.stringify(index.niches, null, 2));
    return;
  }

  const hasFilter = Boolean(
    q.platform ||
      q.style ||
      q.funnel_stage ||
      q.niche ||
      q.job ||
      q.id ||
      q.tag ||
      q.production_tier ||
      q.virality_posture
  );

  const ranked = index.patterns
    .map((p) => ({ entry: p, score: scoreEntry(p, q) }))
    .filter((x) => (hasFilter ? x.score > 0 : true))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(Math.max(q.limit, 1), 15));

  const picks = ranked.length
    ? ranked
    : index.patterns.slice(0, q.limit).map((p) => ({ entry: p, score: 0 }));

  const results = picks.map(({ entry, score }) => {
    const full = loadJson(path.join(DB_ROOT, entry.file));
    return { score, blueprint: full };
  });

  let nichePack = null;
  if (q.niche) {
    const nicheHit = index.niches.find(
      (n) =>
        n.id === q.niche ||
        q.niche.toLowerCase().includes(n.id) ||
        n.id.includes(q.niche.toLowerCase())
    );
    if (nicheHit) nichePack = loadJson(path.join(DB_ROOT, nicheHit.file));
  }

  const viralOs = loadJson(
    path.join(DB_ROOT, "trends/viral-operating-system.json")
  );

  console.log(
    JSON.stringify(
      {
        query: q,
        count: results.length,
        results,
        niche: nichePack,
        viral_os_summary: {
          id: viralOs.id,
          trend_classes: viralOs.trend_classes.map((t) => t.id),
          file: "database/trends/viral-operating-system.json",
        },
        anti_patterns_file: "database/anti-patterns.json",
        hooks_file: "database/hooks/library.json",
        flows_file: "database/flows/library.json",
      },
      null,
      2
    )
  );
}

main();
