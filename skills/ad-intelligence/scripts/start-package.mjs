#!/usr/bin/env node
/**
 * Start a one-shot package from the skeleton.
 * Usage: node scripts/start-package.mjs --out packages/my-brand-ad.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const out = arg("--out", "packages/new-ad.md");
const abs = path.isAbsolute(out) ? out : path.join(ROOT, out);
const skeleton = fs.readFileSync(
  path.join(ROOT, "references", "package-skeleton.md"),
  "utf8"
);

fs.mkdirSync(path.dirname(abs), { recursive: true });
if (fs.existsSync(abs) && !process.argv.includes("--force")) {
  console.error(`Refusing to overwrite ${abs} (pass --force)`);
  process.exit(2);
}
fs.writeFileSync(abs, skeleton);
console.log(
  JSON.stringify(
    {
      ok: true,
      wrote: abs,
      next: [
        `node scripts/retrieve.mjs --niche <niche> --platform <platform> --limit 5`,
        `Fill every [[BRACKET]] in ${out}`,
        `node scripts/lint-package.mjs ${out}`,
        `Fix until lint ok:true — see prompts/one-shot.md`,
      ],
    },
    null,
    2
  )
);
