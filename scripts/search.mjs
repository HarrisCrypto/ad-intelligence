#!/usr/bin/env node
/**
 * Filter the generated index.
 *   node scripts/search.mjs --platform tiktok --niche home-services --goal conversion --keyword ring
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function arg(name) {
  const i = process.argv.indexOf(name);
  if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--")) {
    return process.argv[i + 1];
  }
  const eq = process.argv.find((a) => a.startsWith(`${name}=`));
  return eq ? eq.slice(name.length + 1) : null;
}

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(
    "Usage: node scripts/search.mjs [--platform P] [--niche N] [--goal G] [--keyword Q]"
  );
  process.exit(0);
}

const indexPath = path.join(root, "index.json");
if (!fs.existsSync(indexPath)) {
  console.error("index.json missing. Run: node scripts/build-index.mjs");
  process.exit(1);
}
const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const platform = arg("--platform");
const niche = arg("--niche");
const goal = arg("--goal");
const keyword = (arg("--keyword") || arg("--q") || "").toLowerCase();

const hits = (index.breakdowns || []).filter((row) => {
  if (platform && row.platform !== platform) return false;
  if (niche && row.niche !== niche) return false;
  if (goal && row.goal !== goal) return false;
  if (keyword && !String(row.search_text || "").toLowerCase().includes(keyword)) return false;
  return true;
}).map(({ search_text, ...row }) => row);

console.log(JSON.stringify({ count: hits.length, hits }, null, 2));
