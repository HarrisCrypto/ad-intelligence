#!/usr/bin/env node
/**
 * Build a single pasteable context pack for any LLM.
 * Usage:
 *   node scripts/build-context-pack.mjs                  # stdout
 *   node scripts/build-context-pack.mjs --write           # prompts/context-pack.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function extract(md, re) {
  const m = md.match(re);
  return m ? m[0].trim() : "";
}

const beauty = read("examples/beauty-dtc-dual-track.md");
const craftExcerpt = [
  extract(beauty, /### Concept[\s\S]*?(?=### Consistency)/i),
  extract(beauty, /### Timed script[\s\S]*?(?=### Shot list)/i),
  extract(beauty, /### Craft system[\s\S]*?(?=### Render plan)/i),
  extract(beauty, /#### Unit U1 — paste-ready prompt[\s\S]*?(?=#### Unit U1 — mcp|### Render log)/i),
].join("\n\n");

const craftRules = `# Craft defaults (compressed)

## AD-DEFAULTS to refuse (unless brief forces + you explain)
- Smiling person holding product to camera
- Floating product + particles / god-rays
- Logo-first open or whoosh logo sting in 0–3s
- “Tired of X? Meet Y.”
- Drone skyline for local “#1”
- Neon / holographic SaaS cockpit with invented %
- Cream+serif+terracotta or purple-glow AI-default looks
- Invented review counts / ROAS
- Image collage + crappy slogan (no cut/timing/shots)

## Hook / edit
- 0–3s muted-first; brand cue via product/place/color OK; logo sting only on endcard
- ≥6 timed-script rows for ~24s; EXACT on-screen/VO words in quotes
- Captions carry the story muted; one CTA; product hold ≥1.2s; endcard ≥2.5s
- Pick an attention model (am_*) and match its timing sheet

## Craft lint (must pass)
- ≥2 #HEX; real font names (no -style/-like); motion; E1; 9:16+1:1
- No cinematic/stunning/8k/sleek/nice in craft/prompts
- No “only when supplied” / ASSUMED in paid primary or captions
- No leftover [[BRACKETS]]
`;

const attentionBrief = `# Attention + any niche + harness

- Probe: node scripts/probe-harness.mjs → prompts/harness-equalization.md
- View models: examples/visual/attention-lab.html
- Public libraries: references/ad-libraries.md (Meta, TikTok, X, YouTube, LinkedIn)
- URL briefs: prompts/brief-from-url.md
- Emulate: prompts/emulate-attention-model.md
- Angles: references/angle-axes.md
- Hair/shampoo → beauty · Food → food_bev · AI/voice agent → saas + voice gold
- retrieve.mjs returns attention_models + research URLs — use them
- Equalize tools: connected | handoff | assembler | package-only — never fake MCP jobs
`;

const parts = [
  "# Ad Intelligence — CONTEXT PACK (v3.12)\n\n",
  "_Paste into system context. Then follow the one-shot sequence._\n",
  "_Repo: https://github.com/HarrisCrypto/ad-intelligence_\n",
  "\n---\n## 1) ONE-SHOT\n\n",
  read("prompts/one-shot.md"),
  "\n---\n## 2) HARNESS EQUALIZATION\n\n",
  read("prompts/harness-equalization.md"),
  "\n---\n## 3) ATTENTION + ANY NICHE\n\n",
  attentionBrief,
  "\n---\n## 4) CRAFT DEFAULTS\n\n",
  craftRules,
  "\n---\n## 5) PACKAGE SKELETON\n\n",
  read("references/package-skeleton.md"),
  "\n---\n## 6) GOLD DENSITY EXCERPT (beauty — match this specificity)\n\n",
  craftExcerpt,
  "\n---\n## 7) COMMANDS\n\n",
  "```bash\n",
  "cd skills/ad-intelligence\n",
  "node scripts/probe-harness.mjs\n",
  "node scripts/agent-ready.mjs\n",
  "node scripts/start-package.mjs --out packages/<brand>-ad.md\n",
  "node scripts/retrieve.mjs --niche <n> --platform <p> --limit 5 --compact\n",
  "node scripts/lint-package.mjs packages/<brand>-ad.md\n",
  "# open examples/visual/attention-lab.html\n",
  "```\n",
];

const out = parts.join("");
if (process.argv.includes("--write")) {
  const dest = path.join(ROOT, "prompts", "context-pack.md");
  fs.writeFileSync(dest, out);
  console.error(`Wrote ${dest} (${out.length} bytes)`);
} else {
  process.stdout.write(out);
}
