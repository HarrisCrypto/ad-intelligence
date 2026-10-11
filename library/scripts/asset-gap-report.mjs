#!/usr/bin/env node
/**
 * Per-niche asset-gap report — makes the materials ceiling visible.
 *
 *   node library/scripts/asset-gap-report.mjs --niche home-services
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIB = path.join(__dirname, "..");
const ROOT = path.join(LIB, "..");

function arg(name, def = null) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : def;
}

const niche = arg("--niche", "home-services");
const ledger = JSON.parse(
  fs.readFileSync(path.join(LIB, "assets/license-ledger.json"), "utf8")
);

const REQUIRED = {
  "home-services": {
    music_bed: 1,
    sfx_phone: 1,
    sfx_ui: 1,
    ambience: 1,
    footage_tags: [
      "after-hours phone on desk",
      "tradesperson hands / tools",
      "work van or bay",
      "real facility exterior",
      "owner/talking-head UGC",
    ],
  },
  saas: {
    music_bed: 1,
    sfx_ui: 1,
    ambience: 1,
    footage_tags: ["real hands on laptop", "office desk practical light", "phone notification moment"],
  },
};

const need = REQUIRED[niche] || REQUIRED["home-services"];
const assets = ledger.assets || [];

function exists(a) {
  return fs.existsSync(path.join(ROOT, a.path));
}

const beds = assets.filter((a) => a.kind === "music_bed" && exists(a));
const sfx = assets.filter((a) => a.kind === "sfx" && exists(a));
const amb = assets.filter((a) => a.kind === "ambience" && exists(a));
const footage = assets.filter((a) => a.kind === "footage" && exists(a));

const phoneSfx = sfx.filter((a) => (a.tags || []).includes("phone") || (a.niches || []).includes(niche));
const uiSfx = sfx.filter((a) => (a.tags || []).some((t) => ["ui", "click", "notification"].includes(t)));

const gaps = [];
if (beds.length < need.music_bed) {
  gaps.push({
    bucket: "music_bed",
    have: beds.length,
    need: need.music_bed,
    note: "No licensed bed → cannot claim music; SFX-only or USER_SUPPLIED",
  });
}
if (phoneSfx.length < (need.sfx_phone || 0)) {
  gaps.push({
    bucket: "sfx_phone",
    have: phoneSfx.length,
    need: need.sfx_phone,
    note: "Missed-call spots need ring/busy SFX",
  });
}
if (uiSfx.length < (need.sfx_ui || 0)) {
  gaps.push({
    bucket: "sfx_ui",
    have: uiSfx.length,
    need: need.sfx_ui,
  });
}
if (amb.length < need.ambience) {
  gaps.push({ bucket: "ambience", have: amb.length, need: need.ambience });
}

const TAG_ALIASES = {
  "after-hours phone on desk": ["desk-phone", "phone", "smartphone", "desk"],
  "tradesperson hands / tools": ["trades-hands", "hands", "tools", "technician", "wrench"],
  "work van or bay": ["work-van", "van", "bay", "hvac-bay", "truck"],
  "real facility exterior": ["facility", "hvac-tech", "hvac-bay", "outdoor unit", "building"],
  "owner/talking-head UGC": ["owner-ugc", "portrait", "talking", "person"],
  "real hands on laptop": ["laptop-hands", "laptop", "typing"],
  "office desk practical light": ["office-desk", "office", "desk"],
  "phone notification moment": ["desk-phone", "notification", "smartphone"],
};

const footageGaps = [];
for (const tag of need.footage_tags || []) {
  const aliases = TAG_ALIASES[tag] || tag.toLowerCase().split(/[\s/]+/).filter(Boolean);
  const hit = footage.some((a) => {
    const blob = `${(a.tags || []).join(" ")} ${a.id} ${a.path} ${a.query || ""}`.toLowerCase();
    return aliases.some((al) => blob.includes(String(al).toLowerCase()));
  });
  if (!hit) {
    footageGaps.push({
      missing: tag,
      note: "No ledgered footage — run fill-niche-gaps.mjs or USER_SUPPLIED shoot",
    });
  }
}

const ceiling =
  footageGaps.length >= 3
    ? "designed_cards_on_void — NOT elite FB/TikTok native; disclose materials ceiling before generate"
    : footageGaps.length > 0
      ? "hybrid_gen_plus_stock — photographable moments incomplete; lower virality posture"
      : "full_native_eligible — footage buckets covered (still prefer real shoot)";

const report = {
  niche,
  ok: gaps.length === 0 && footageGaps.length === 0,
  quality_ceiling: ceiling,
  counts: {
    music_beds: beds.length,
    sfx: sfx.length,
    phone_sfx: phoneSfx.length,
    ambience: amb.length,
    footage: footage.length,
  },
  audio_gaps: gaps,
  footage_gaps: footageGaps,
  have_audio_ids: [...beds, ...sfx, ...amb].map((a) => a.id),
  next_actions: [
    ...(footageGaps.length
      ? [
          "Seed library/footage/ from Pexels/Pixabay/Mixkit with license-ledger rows",
          "Or shoot 30s phone clip: ringing phone + van/bay + hands — highest leverage",
        ]
      : []),
    "Run assert-assets.mjs before compose for this niche",
    "See docs/PHASE-2.6-ASSET-REALISM.md",
  ],
  rule: "Studying more ads will not fill footage_gaps. Materials unlock the look.",
};

console.log(JSON.stringify(report, null, 2));
process.exit(report.ok ? 0 : 2);
