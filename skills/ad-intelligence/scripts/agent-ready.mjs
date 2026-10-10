#!/usr/bin/env node
/**
 * One command: prove the skill is loadable and print the one-shot path.
 * Usage: node scripts/agent-ready.mjs
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function run(script, args = []) {
  return spawnSync(process.execPath, [path.join(ROOT, "scripts", script), ...args], {
    encoding: "utf8",
    cwd: ROOT,
  });
}

const probe = run("probe-harness.mjs", ["--json"]);
if (probe.status && probe.status !== 0 && !probe.stdout) {
  console.error(probe.stderr || "probe failed");
  process.exit(1);
}
const p = JSON.parse(probe.stdout);
const gates = run("demo-quality-gates.mjs");

console.log("Ad Intelligence — agent ready\n");
console.log(`Skill root: ${ROOT}`);
console.log(`Probe rung hint: ${p.recommended_rung_hint}`);
console.log(`Network: ${p.runtime.network_fetch ? "yes" : "no"}`);
console.log(`Gates: ${gates.status === 0 ? "PASS" : "FAIL"}`);
if (gates.status !== 0) console.log(gates.stdout || gates.stderr);
console.log(`
ANY HARNESS PATH
1) node scripts/probe-harness.mjs          # equalize tools → rung
2) Read prompts/harness-equalization.md   # fill tool card
3) URL? node scripts/brief-from-url.mjs <url>
4) Follow prompts/one-shot.md             # concept → beats → craft → lint
5) Open examples/visual/attention-lab.html

NO SHELL? Paste prompts/context-pack-lite.md + use references/retrieve-offline-compact.json
         + prompts/no-shell-lint-checklist.md (never fake ok:true).

Discovery: .cursor/skills · .claude/skills · .agents/skills · .github/skills · AGENTS.md
`);

process.exitCode = gates.status === 0 && p.files_missing.length === 0 ? 0 : 1;
