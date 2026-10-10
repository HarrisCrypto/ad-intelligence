#!/usr/bin/env node
/**
 * Retrieve confirmed study cards for a niche/platform.
 * Usage: node classroom/scripts/retrieve-cards.mjs --niche home-services --platform meta --limit 5
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CARDS = path.join(__dirname, "..", "study-cards");

function args(argv) {
  const o = { niche: null, platform: null, limit: 5, includeDraft: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--niche") o.niche = argv[++i];
    else if (argv[i] === "--platform") o.platform = argv[++i];
    else if (argv[i] === "--limit") o.limit = Number(argv[++i]);
    else if (argv[i] === "--include-draft") o.includeDraft = true;
  }
  return o;
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith(".json") && ent.name !== "_schema.json") out.push(p);
  }
  return out;
}

const q = args(process.argv);
const cards = walk(CARDS)
  .map((f) => {
    try {
      return JSON.parse(fs.readFileSync(f, "utf8"));
    } catch {
      return null;
    }
  })
  .filter(Boolean)
  .filter((c) => (q.includeDraft ? true : c.status === "confirmed"));

function score(c) {
  let s = 0;
  if (q.niche && (c.niche === q.niche || (c.tags || []).includes(q.niche))) s += 5;
  if (q.platform && c.source?.platform === q.platform) s += 3;
  if ((c.tags || []).includes("technique")) s += 1;
  if (c.gold_fixture) s += 2;
  return s;
}

const ranked = cards
  .map((c) => ({ c, s: score(c) }))
  .filter((x) => x.s > 0 || !q.niche)
  .sort((a, b) => b.s - a.s)
  .slice(0, q.limit)
  .map((x) => x.c);

console.log(
  JSON.stringify(
    {
      query: q,
      count: ranked.length,
      cards: ranked.map((c) => ({
        id: c.id,
        niche: c.niche,
        format: c.format,
        structure: c.structure,
        hook: c.hook,
        stats: c.stats,
        steal: c.steal,
        what_not_to_copy: c.what_not_to_copy,
        gold_fixture: c.gold_fixture || null,
        linked_study_id: c.linked_study_id || null,
        why_it_works: c.why_it_works,
        status: c.status,
      })),
      rule: "Open steal + stats before writing beats. Emulate structure; never copy assets.",
    },
    null,
    2
  )
);
