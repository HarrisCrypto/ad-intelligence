#!/usr/bin/env node
/**
 * Human assembly plan — study card shots → footage buckets → CapCut timeline.
 *
 *   node library/scripts/assemble-plan.mjs --card hvac-missed-call-void-01
 *   node library/scripts/assemble-plan.mjs --card hvac-missed-call-void-01 --niche home-services
 *
 * Encodes how practitioners pull B-roll by job, then lay audio + type in post.
 * Never substitutes stills into footage slots.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const CARDS = path.join(ROOT, "classroom/study-cards");

function arg(name, def = null) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : def;
}

const cardId = arg("--card", "hvac-missed-call-void-01");
const niche = arg("--niche", "home-services");

function findCard(id) {
  for (const dir of [path.join(CARDS, niche), CARDS, path.join(CARDS, "technique")]) {
    if (!fs.existsSync(dir)) continue;
    const direct = path.join(dir, `${id}.json`);
    if (fs.existsSync(direct)) return direct;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!ent.isFile() || !ent.name.endsWith(".json")) continue;
      const p = path.join(dir, ent.name);
      try {
        const j = JSON.parse(fs.readFileSync(p, "utf8"));
        if (j.id === id) return p;
      } catch {
        /* skip */
      }
    }
  }
  return null;
}

/** Map study-card shot → footage bucket (human job language) */
function inferBucket(shot) {
  if (shot.footage_bucket) return shot.footage_bucket;
  const blob = `${shot.purpose || ""} ${shot.subject || ""} ${shot.shot_type || ""} ${shot.recipe || ""} ${shot.how_this_shot_was_made || ""}`.toLowerCase();
  if (shot.shot_type === "endcard" || /endcard|cta/.test(blob)) return null;
  if (shot.shot_type === "screen" || /ui|answered|booked|confirm|app|screen/.test(blob)) {
    if (/book|confirm|schedule|calendar/.test(blob)) return "result_booking";
    return "product_screen";
  }
  if (/phone|ring|missed|after-hours|call void/.test(blob)) return "hook_phone_ring";
  if (/van|truck|bay|vehicle|geo/.test(blob)) return "hook_vehicle";
  if (/hand|tool|wrench|repair|plumber work/.test(blob)) return "problem_hands_tools";
  if (/face|owner|worker|technician|talking/.test(blob)) return "person_face";
  if (/house|site|facility|suburban|driveway|residential/.test(blob)) return "place_job_site";
  if (/cost|bill|invoice|money|empty calendar|dark shop/.test(blob)) return "money_or_cost";
  return null;
}

function selectBucket(bucket) {
  if (!bucket) return null;
  const r = spawnSync(
    process.execPath,
    [path.join(__dirname, "select-footage.mjs"), "--niche", niche, "--bucket", bucket],
    { encoding: "utf8" }
  );
  try {
    return JSON.parse(r.stdout || "{}");
  } catch {
    return { ok: false, gap: true, why: "select-footage parse failed" };
  }
}

const cardPath = findCard(cardId);
if (!cardPath) {
  console.error(JSON.stringify({ ok: false, error: `card not found: ${cardId}` }));
  process.exit(1);
}
const card = JSON.parse(fs.readFileSync(cardPath, "utf8"));

const assert = spawnSync(
  process.execPath,
  [path.join(__dirname, "assert-assets.mjs"), "--niche", niche],
  { encoding: "utf8" }
);
let materials = {};
try {
  materials = JSON.parse(assert.stdout || "{}");
} catch {
  materials = {};
}

const timeline = [];
const gaps = [];
for (const shot of card.shots || []) {
  const bucket = inferBucket(shot);
  const pick = bucket ? selectBucket(bucket) : null;
  const row = {
    t: [shot.t_start, shot.t_end],
    purpose: shot.purpose,
    shot_type: shot.shot_type || null,
    footage_bucket: bucket,
    picture: pick?.chosen
      ? {
          id: pick.chosen.id,
          path: pick.chosen.path,
          motion: pick.chosen.motion,
          why: pick.why,
        }
      : bucket
        ? { gap: true, why: pick?.why || "no eligible video", fallback: pick?.fallback }
        : {
            post: "CapCut endcard / UI kit / type — not a footage bucket",
            how: shot.how_this_shot_was_made || null,
            asset_ids: shot.asset_ids || [],
          },
    audio_hint: shot.sfx || null,
    on_screen_text: shot.on_screen_text || null,
    recipe: shot.recipe || null,
    human_rule: bucket
      ? "Hard-cut from previous setup; do not Ken-Burns a still into this slot"
      : "Post owns type/logo/CTA",
  };
  if (bucket && pick?.gap) gaps.push({ purpose: shot.purpose, bucket });
  timeline.push(row);
}

const plan = {
  ok: gaps.length === 0 && materials.audio_ok !== false,
  gate: "human-assembly",
  card: card.id,
  niche,
  duration_s: card.duration_s,
  aspect: card.aspect || "9:16",
  study: card.linked_study_id || null,
  materials_ceiling: materials.quality_ceiling || card.materials_ceiling,
  must_disclose_before_generate: !!materials.must_disclose_before_generate,
  assembly_order: [
    "0 study structure",
    "1 select footage by bucket (this plan)",
    "2 lock UI kit / product sheet",
    "3 place picture on timeline",
    "4 lay audio (ring/VO/bed)",
    "5 fill holes with i2v or connected gen only",
    "6 burn type/logo/CTA in CapCut",
    "7 export + render-qa + human-build log",
  ],
  timeline,
  gaps,
  audio_ids: card.audio
    ? {
        bed: card.audio.bed_id || null,
        ambience: card.audio.ambience_id || null,
        sfx: card.audio.sfx_ids || [],
        attribution: card.audio.attribution_required || [],
      }
    : null,
  capcut_notes: [
    "Hard cuts between phone / vehicle / UI setups",
    "Muted-first captions ≤8 words on open",
    "One CTA ≥3s safe-zone on endcard",
    "Never ask model to render endcard kerning",
  ],
  next: [
    "Fill human-build-log.template.md with real receipts",
    "prompts/finish-the-cut.md — cover every second + audio",
    gaps.length
      ? "acquire-footage.mjs for gap buckets OR i2v vetted still OR disclose lower ceiling"
      : "Optional: Seedance/Higgsfield for identity-locked UI hero units only",
  ],
  rule: "Humans assemble by shot job. Stills never fill footage slots. Studies steal structure — this plan steals the hands on the timeline.",
};

console.log(JSON.stringify(plan, null, 2));
process.exit(plan.ok ? 0 : 2);
