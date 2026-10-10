#!/usr/bin/env node
/**
 * Build a single pasteable context pack for any LLM (no progressive-read hope).
 * Usage: node scripts/build-context-pack.mjs > /tmp/ad-intelligence-context-pack.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

const parts = [
  "# Ad Intelligence — CONTEXT PACK (paste into system/user)\n",
  "_Generated for one-shot quality. Follow prompts/one-shot.md exactly._\n",
  "\n---\n## 1) ONE-SHOT PLAYBOOK\n\n",
  read("prompts/one-shot.md"),
  "\n---\n## 2) HARNESS RULES\n\n",
  read("prompts/harness-system-prompt.md"),
  "\n---\n## 3) PACKAGE SKELETON (copy & fill)\n\n",
  read("references/package-skeleton.md"),
  "\n---\n## 4) GOLD CRAFT EXCERPT (match this density)\n\n",
  "From examples/beauty-dtc-dual-track.md — Craft system + unit prompt shape:\n\n",
  extractCraftAndPrompt(read("examples/beauty-dtc-dual-track.md")),
  "\n---\n## 5) COMMANDS\n\n",
  "```bash\n",
  "cd skills/ad-intelligence   # or repo skill root\n",
  "node scripts/retrieve.mjs --niche <niche> --platform <platform> --limit 5\n",
  "node scripts/start-package.mjs --out packages/my-brand-ad.md\n",
  "node scripts/lint-package.mjs packages/my-brand-ad.md\n",
  "```\n",
  "\nRepo: https://github.com/HarrisCrypto/ad-intelligence\n",
];

function extractCraftAndPrompt(md) {
  const craft = md.match(/### Craft system[\s\S]*?(?=### Render plan)/i);
  const prompt = md.match(/#### Unit U1 — paste-ready prompt[\s\S]*?(?=#### Unit U1 — mcp|### Render log)/i);
  return `${craft ? craft[0].trim() : ""}\n\n${prompt ? prompt[0].trim() : ""}`;
}

process.stdout.write(parts.join(""));
