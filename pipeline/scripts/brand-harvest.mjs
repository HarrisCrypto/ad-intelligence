#!/usr/bin/env node
/** Repo-root entry → skills/ad-intelligence/scripts/brand-harvest.mjs */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const target = path.join(
  root,
  "skills/ad-intelligence/scripts/brand-harvest.mjs"
);
const r = spawnSync(process.execPath, [target, ...process.argv.slice(2)], {
  stdio: "inherit",
});
process.exit(r.status ?? 1);
