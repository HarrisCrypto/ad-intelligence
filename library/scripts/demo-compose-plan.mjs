#!/usr/bin/env node
/**
 * Gate 3 demo: emit a compose/render plan from the home-services template.
 * Proves toolbox ids resolve and timeline is executable (no media gen).
 *
 *   node library/scripts/demo-compose-plan.mjs
 *   node library/scripts/demo-compose-plan.mjs --brand Oply
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = path.join(__dirname, "resolve-toolbox.mjs");
const brand = process.argv.includes("--brand")
  ? process.argv[process.argv.indexOf("--brand") + 1]
  : "BRAND";

const r = spawnSync(process.execPath, [resolve, "--template", "tpl_home_services_missed_call"], {
  encoding: "utf8",
});
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}
const resolved = JSON.parse(r.stdout);
const kit = resolved.library.ui_kit;
const plan = {
  ok: true,
  gate: "3",
  brand,
  template: "tpl_home_services_missed_call",
  duration_s: 24,
  aspect: "9:16",
  grade: resolved.library.grade?.id,
  transition_default: resolved.library.transition_default?.id,
  ui_kit: kit?.id,
  ui_preview: "library/ui-kits/voice-agent-flat/preview.html",
  beats: resolved.timeline.map((b) => ({
    id: b.id,
    t: b.t,
    job: b.job,
    camera: b.camera,
    lighting: b.lighting || null,
    transition_out: b.transition_out,
    ui_state: b.ui_state || null,
    caption: b.caption_preset
      ? {
          id: b.caption_preset.id,
          family: b.caption_preset.family,
          max_words: b.caption_preset.max_words,
          safe_zone: b.caption_preset.safe_zone,
        }
      : null,
    gen_note:
      b.ui_state && kit
        ? kit.prompt_template
            .replace("{{brand}}", brand)
            .replace("{{surface}}", kit.palette.surface)
            .replace("{{panel}}", kit.palette.panel)
            .replace("{{accent}}", kit.palette.accent)
            .replace("{{state_block}}", JSON.stringify(kit.states_spec[b.ui_state]))
        : b.job,
  })),
  next: [
    "brand-harvest.mjs <url> → override kit palette if ASSET_VERIFIED",
    "retrieve-cards.mjs --niche home-services",
    "Generate stills per beat gen_note; assemble with tr_hard_cut",
    "pipeline/qa/run-qa.mjs on export",
  ],
  rule: "Emulate structure from study cards; never copy competitor assets.",
};

console.log(JSON.stringify(plan, null, 2));
