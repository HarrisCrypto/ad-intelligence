#!/usr/bin/env node
/**
 * Rebuild index.json from breakdowns/*.json.
 * Usage: node scripts/build-index.mjs [--check]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "breakdowns");
const outPath = path.join(root, "index.json");

export function loadBreakdowns() {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => {
      const file = path.join(dir, name);
      const card = JSON.parse(fs.readFileSync(file, "utf8"));
      return { file: `breakdowns/${name}`, card };
    });
}

export function searchText(card) {
  const bits = [
    card.id,
    card.brand,
    card.advertiser,
    card.platform,
    card.niche,
    card.goal,
    card.format,
    card.hook_0_3s,
    card.pacing,
    card.voiceover,
    card.cta,
    card.emotional_angle,
    card.why_it_worked,
    ...(card.story_beats || []),
    ...(card.cinematic_qualities || []),
    ...(card.text_overlays || []).map((t) => t.wording),
    card.award?.name,
    card.award?.category,
  ];
  return bits.filter(Boolean).join("\n");
}

export function buildIndex(items = loadBreakdowns()) {
  return {
    generated_from: "breakdowns/*.json",
    generator: "scripts/build-index.mjs",
    count: items.length,
    breakdowns: items.map(({ file, card }) => ({
      id: card.id,
      file,
      brand: card.brand,
      advertiser: card.advertiser,
      platform: card.platform,
      niche: card.niche,
      goal: card.goal,
      year: card.year,
      format: card.format,
      aspect_ratio: card.aspect_ratio,
      length_s: card.length_s,
      award: card.award
        ? {
            name: card.award.name,
            year: card.award.year,
            category: card.award.category,
          }
        : null,
      official_url: card.official_url,
      hook_0_3s: card.hook_0_3s,
      search_text: searchText(card),
    })),
  };
}

function main() {
  const index = buildIndex();
  const json = `${JSON.stringify(index, null, 2)}\n`;
  if (process.argv.includes("--check")) {
    const current = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf8") : "";
    if (current !== json) {
      console.error("index.json is stale. Run: node scripts/build-index.mjs");
      process.exit(1);
    }
    console.log(JSON.stringify({ ok: true, count: index.count, check: "index" }));
    return;
  }
  fs.writeFileSync(outPath, json);
  console.log(JSON.stringify({ ok: true, count: index.count, wrote: "index.json" }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
