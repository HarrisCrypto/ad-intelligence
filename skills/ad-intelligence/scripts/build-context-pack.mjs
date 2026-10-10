#!/usr/bin/env node
/**
 * Build a pasteable context pack for any LLM.
 * Usage:
 *   node scripts/build-context-pack.mjs                  # stdout (full)
 *   node scripts/build-context-pack.mjs --write          # prompts/context-pack.md
 *   node scripts/build-context-pack.mjs --lite           # stdout lite
 *   node scripts/build-context-pack.mjs --lite --write   # prompts/context-pack-lite.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const lite = process.argv.includes("--lite");
const doWrite = process.argv.includes("--write");

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
].join("\n\n");

const craftRules = `# Craft defaults (compressed)

## Refuse
- Smiling hold-to-camera · floating product+particles · logo-first 0–3s
- “Tired of X? Meet Y.” · drone #1 · neon SaaS % · purple-glow AI
- Invented reviews/ROAS · image collage + slogan

## Must
- Attention model am_* · Concept + Not the default because…
- ≥6 timed rows · EXACT quoted VO · one CTA · muted-first
- Craft: ≥2 #HEX · real fonts · motion · E1 · 9:16+1:1
- No leftover [[BRACKETS]] · never invent lint JSON or job ids
`;

const liteParts = [
  "# Ad Intelligence — CONTEXT PACK LITE (v3.13)\n\n",
  "_Small-window paste. Prefer full pack if context allows._\n",
  "_Repo: https://github.com/HarrisCrypto/ad-intelligence_\n\n",
  "## Sequence\n",
  "1. Tool card → rung (connected|handoff|assembler|package-only)\n",
  "2. Offline retrieve: references/retrieve-offline-compact.json (or live retrieve if shell)\n",
  "3. Attention model → Concept → ≥6 exact-VO beats → Craft → fill skeleton\n",
  "4. Finish the cut (prompts/finish-the-cut.md) — generate UI if needed; no stall\n",
  "5. No shell → prompts/no-shell-lint-checklist.md (never fake ok:true)\n\n",
  "---\n## ONE-SHOT\n\n",
  read("prompts/one-shot.md"),
  "\n---\n## FINISH THE CUT\n\n",
  read("prompts/finish-the-cut.md"),
  "\n---\n## CRAFT\n\n",
  craftRules,
  "\n---\n## NO-SHELL LINT\n\n",
  read("prompts/no-shell-lint-checklist.md"),
  "\n---\n## SKELETON\n\n",
  read("references/package-skeleton.md"),
  "\n---\n## GOLD DENSITY (match this)\n\n",
  craftExcerpt,
  "\n---\n## OFFLINE RETRIEVE\n\n",
  "_Use committed_ `references/retrieve-offline-compact.json` _— pick closest niche|platform key._\n",
];

const fullParts = [
  "# Ad Intelligence — CONTEXT PACK (v3.13)\n\n",
  "_Paste into system context. Then follow the one-shot sequence._\n",
  "_Repo: https://github.com/HarrisCrypto/ad-intelligence_\n",
  "_Lite pack: node scripts/build-context-pack.mjs --lite_\n",
  "\n---\n## 1) ONE-SHOT\n\n",
  read("prompts/one-shot.md"),
  "\n---\n## 2) FINISH THE CUT\n\n",
  read("prompts/finish-the-cut.md"),
  "\n---\n## 3) HARNESS EQUALIZATION\n\n",
  read("prompts/harness-equalization.md"),
  "\n---\n## 4) NO-SHELL LINT\n\n",
  read("prompts/no-shell-lint-checklist.md"),
  "\n---\n## 5) ATTENTION + HARNESS\n\n",
  "- Probe: node scripts/probe-harness.mjs\n",
  "- Lab: examples/visual/attention-lab.html\n",
  "- Libraries: references/ad-libraries.md\n",
  "- Generated UI: references/generated-ui-authenticity.md\n",
  "- Offline retrieve: references/retrieve-offline-compact.json\n",
  "- Angles: references/angle-axes.md\n",
  "\n---\n## 6) CRAFT DEFAULTS\n\n",
  craftRules,
  "\n---\n## 7) PACKAGE SKELETON\n\n",
  read("references/package-skeleton.md"),
  "\n---\n## 8) GOLD DENSITY EXCERPT\n\n",
  craftExcerpt,
  "\n---\n## 9) COMMANDS\n\n",
  "```bash\n",
  "cd skills/ad-intelligence\n",
  "node scripts/probe-harness.mjs\n",
  "node scripts/agent-ready.mjs\n",
  "node scripts/start-package.mjs --out packages/<brand>-ad.md\n",
  "node scripts/retrieve.mjs --niche <n> --platform <p> --limit 5 --compact\n",
  "node scripts/lint-package.mjs packages/<brand>-ad.md\n",
  "```\n",
];

const out = (lite ? liteParts : fullParts).join("");
if (doWrite) {
  const dest = path.join(
    ROOT,
    "prompts",
    lite ? "context-pack-lite.md" : "context-pack.md"
  );
  fs.writeFileSync(dest, out);
  console.error(`Wrote ${dest} (${out.length} bytes)`);
} else {
  process.stdout.write(out);
}
