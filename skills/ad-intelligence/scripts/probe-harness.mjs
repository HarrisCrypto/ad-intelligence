#!/usr/bin/env node
/**
 * Probe what THIS runtime can do and recommend a pipeline rung.
 * Agents should still fill the Tool card for MCP/image/video they see in-session.
 *
 * Usage:
 *   node scripts/probe-harness.mjs
 *   node scripts/probe-harness.mjs --json
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const jsonMode = process.argv.includes("--json");

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function canFetch() {
  try {
    const r = spawnSync(
      process.execPath,
      [
        "-e",
        "fetch('https://example.com',{signal:AbortSignal.timeout(5000)}).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))",
      ],
      { timeout: 8000, encoding: "utf8" }
    );
    return r.status === 0;
  } catch {
    return false;
  }
}

function probeHardware() {
  const cores = os.cpus()?.length || null;
  const totalMemGb = Math.round((os.totalmem() / 1024 ** 3) * 10) / 10;
  let gpu = { present: false, detail: "none" };
  const nvsmi = spawnSync("nvidia-smi", ["-L"], { encoding: "utf8" });
  if (nvsmi.status === 0 && (nvsmi.stdout || "").trim()) {
    gpu = { present: true, detail: (nvsmi.stdout || "").trim().split("\n")[0] };
  }
  const ffmpeg = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
  const ffmpegOk = ffmpeg.status === 0;
  const repoRoot = path.join(ROOT, "../..");
  const typography = fs.existsSync(
    path.join(repoRoot, "library/typography/fallback-map.json")
  );
  let voice_tier_default = "V1_cpu_tts";
  let ceiling =
    "Clean brand-correct motion possible; not top-tier cinema without GPU gen video";
  if (!gpu.present) {
    voice_tier_default = "V1_cpu_tts";
    ceiling =
      "CPU-only: prefer screen-record/UI kits + CapCut; generative video limited; state this to the user in step 1";
  } else {
    voice_tier_default = "V2_or_V3_if_clone_available";
    ceiling = "GPU present — generative video + higher voice tiers viable if tools connected";
  }
  return {
    cores,
    ram_gb: totalMemGb,
    gpu,
    ffmpeg: ffmpegOk,
    typography_library: typography,
    voice_tier_default,
    quality_ceiling: ceiling,
  };
}

const files = {
  skill: exists("SKILL.md"),
  one_shot: exists("prompts/one-shot.md"),
  context_pack: exists("prompts/context-pack.md"),
  skeleton: exists("references/package-skeleton.md"),
  attention_lab: exists("examples/visual/attention-lab.html"),
  lint: exists("scripts/lint-package.mjs"),
  retrieve: exists("scripts/retrieve.mjs"),
  brief_from_url: exists("scripts/brief-from-url.mjs"),
  brand_harvest: exists("scripts/brand-harvest.mjs"),
};

const network = canFetch();
const shell = true; // if this script runs, shell/node works
const hardware = probeHardware();

// MCP / gen tools cannot be detected from Node — agent must declare
const agentMustDeclare = [
  "image_gen_tools",
  "video_gen_tools",
  "mcp_seedance_or_higgsfield",
  "browser_tool",
  "harness_name",
  "voice_tier_selected",
];

let rung = "package-only";
let rationale = "Shell/node present; declare gen tools to upgrade rung";
if (shell && files.lint && files.retrieve) {
  rung = "assembler_or_handoff_candidate";
  rationale =
    "Mechanical loop available. If MCP Seedance/Higgsfield live → connected; else if user has those tools → handoff; else assembler / package-only. " +
    hardware.quality_ceiling;
}

const discovery = {
  cursor: ".cursor/skills/ad-intelligence",
  claude_code: ".claude/skills/ad-intelligence",
  agents_md: "AGENTS.md (repo root)",
  github_copilot: ".github/skills/ad-intelligence",
  agents_dir: ".agents/skills/ad-intelligence",
  context_pack: "skills/ad-intelligence/prompts/context-pack.md",
  context_pack_lite: "skills/ad-intelligence/prompts/context-pack-lite.md",
  offline_retrieve: "skills/ad-intelligence/references/retrieve-offline-compact.json",
  no_shell_lint: "skills/ad-intelligence/prompts/no-shell-lint-checklist.md",
};

const next = [
  "Fill HARNESS TOOL CARD (prompts/harness-equalization.md) — include hardware + ceiling",
  "Pick rung: connected | handoff | assembler | package-only",
  files.brief_from_url && network
    ? "URL brief? node scripts/brief-from-url.mjs <url>"
    : "URL brief? gather via prompts/brief-from-url.md",
  files.brand_harvest && network
    ? "Brand harvest (Gate 2.5): node scripts/brand-harvest.mjs <url> — lock consistency from ASSET_VERIFIED"
    : "Brand harvest: paste site facts; never invent palette/mascot",
  "Provision fonts: library/typography (Anton/Poppins/Inter Tight OFL)",
  "node scripts/start-package.mjs --out packages/<brand>-ad.md",
  "node scripts/retrieve.mjs --niche <n> --platform <p> --limit 5 --compact — open gold_fixtures",
  "Open examples/visual/attention-lab.html + research URLs",
  "Fill Concept ≥6 beats Craft → node scripts/lint-package.mjs … until ok:true",
  "Finish-the-cut + pipeline/qa/run-qa.mjs on the export",
];

const payload = {
  skill_root: ROOT,
  runtime: {
    node: process.version,
    shell,
    network_fetch: network,
    hardware,
  },
  files_ok: files,
  files_missing: Object.entries(files)
    .filter(([, v]) => !v)
    .map(([k]) => k),
  recommended_rung_hint: rung,
  rationale,
  agent_must_declare: agentMustDeclare,
  discovery_paths: discovery,
  equalization_doc: "prompts/harness-equalization.md",
  library: {
    typography: "library/typography/",
    sound: "library/sound/",
  },
  next,
  tool_card_template: {
    harness: null,
    shell_node: shell,
    network_fetch: network,
    hardware,
    image_gen: null,
    video_gen: null,
    mcp_ads_video: null,
    browser: null,
    voice_tier: hardware.voice_tier_default,
    chosen_rung: null,
    quality_ceiling: hardware.quality_ceiling,
    equalization_note: null,
  },
};

if (jsonMode) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  console.log("Ad Intelligence — harness probe\n");
  console.log(`Node: ${payload.runtime.node}`);
  console.log(`Network fetch: ${network ? "yes" : "no"}`);
  console.log(
    `Hardware: ${hardware.cores} cores · ${hardware.ram_gb} GB RAM · GPU ${hardware.gpu.present ? hardware.gpu.detail : "none"} · ffmpeg ${hardware.ffmpeg ? "yes" : "no"}`
  );
  console.log(`Voice tier default: ${hardware.voice_tier_default}`);
  console.log(`Ceiling: ${hardware.quality_ceiling}`);
  console.log(`Files missing: ${payload.files_missing.length ? payload.files_missing.join(", ") : "none"}`);
  console.log(`\nRung hint: ${rung}`);
  console.log(`Why: ${rationale}`);
  console.log("\nDeclare in-session tools (cannot auto-detect):");
  for (const k of agentMustDeclare) console.log(`  - ${k}`);
  console.log("\nDiscovery paths:");
  for (const [k, v] of Object.entries(discovery)) console.log(`  ${k}: ${v}`);
  console.log("\nNext:");
  next.forEach((n, i) => console.log(`  ${i + 1}. ${n}`));
  console.log("\nDoc: prompts/harness-equalization.md");
  console.log("JSON: node scripts/probe-harness.mjs --json");
}

if (payload.files_missing.length) process.exitCode = 1;
