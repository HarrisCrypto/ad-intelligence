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
const assertAssets = path.join(__dirname, "assert-assets.mjs");
const brand = process.argv.includes("--brand")
  ? process.argv[process.argv.indexOf("--brand") + 1]
  : "BRAND";

const gate = spawnSync(
  process.execPath,
  [assertAssets, "--niche", "home-services"],
  { encoding: "utf8" }
);
let materials = null;
try {
  materials = JSON.parse(gate.stdout || "{}");
} catch {
  materials = { message: gate.stderr || "assert-assets failed", audio_ok: false };
}
if (materials.audio_ok === false) {
  console.error(JSON.stringify(materials, null, 2));
  process.exit(1);
}

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
  gate: "3+2.6",
  brand,
  template: "tpl_home_services_missed_call",
  duration_s: 24,
  aspect: "9:16",
  materials_ceiling: materials.quality_ceiling,
  must_disclose_before_generate: !!materials.must_disclose_before_generate,
  audio_ids: {
    bed: "bed_wallpaper_km",
    ambience: "amb_room_tone_owned",
    sfx: ["sfx_phone_ring", "sfx_ui_click", "sfx_whoosh"],
  },
  grade: resolved.library.grade?.id,
  transition_default: resolved.library.transition_default?.id,
  ui_kit: kit?.id,
  ui_preview: "library/ui-kits/voice-agent-flat/preview.html",
  beats: resolved.timeline.map((b) => {
    const bucketGuess =
      /van|vehicle|truck/i.test(b.job || "")
        ? "hook_vehicle"
        : /phone|ring|missed/i.test(b.job || "")
          ? "hook_phone_ring"
          : /hand|tool/i.test(b.job || "")
            ? "problem_hands_tools"
            : /face|owner|tech/i.test(b.job || "")
              ? "person_face"
              : /ui|screen|app|book/i.test(b.job || "")
                ? "product_screen"
                : /house|site|bay|facility/i.test(b.job || "")
                  ? "place_job_site"
                  : null;
    let footage = null;
    if (bucketGuess) {
      const sel = spawnSync(
        process.execPath,
        [
          path.join(__dirname, "select-footage.mjs"),
          "--niche",
          "home-services",
          "--bucket",
          bucketGuess,
        ],
        { encoding: "utf8" }
      );
      try {
        footage = JSON.parse(sel.stdout || "{}");
      } catch {
        footage = { ok: false, gap: true };
      }
    }
    return {
      id: b.id,
      t: b.t,
      job: b.job,
      camera: b.camera,
      lighting: b.lighting || null,
      transition_out: b.transition_out,
      ui_state: b.ui_state || null,
      footage_bucket: bucketGuess,
      footage_pick: footage?.chosen
        ? { id: footage.chosen.id, why: footage.why }
        : footage?.gap
          ? { gap: true, why: footage.why, fallback: footage.fallback }
          : null,
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
    };
  }),
  next: [
    "DISCLOSE materials_ceiling if must_disclose_before_generate",
    "brand-harvest.mjs <url> → override kit palette if ASSET_VERIFIED",
    "select-footage.mjs by bucket — never filename; gaps → i2v vetted still or downgrade",
    "acquire-footage.mjs if P0 motion buckets missing",
    "Prefer USER_SUPPLIED product_screen + phone shoot for Higgsfield-level native",
    "Lay bed/sfx from audio_ids (attribution for CC-BY beds)",
    "pipeline/qa/run-qa.mjs on export",
  ],
  rule: "Select footage by bucket. Stills never fill footage slots. Emulate structure; never copy competitor assets.",
};

console.log(JSON.stringify(plan, null, 2));
