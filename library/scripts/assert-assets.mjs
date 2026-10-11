#!/usr/bin/env node
/**
 * Correctness-and-motion aware materials gate.
 *
 *   node library/scripts/assert-assets.mjs --niche home-services
 *   node library/scripts/assert-assets.mjs --niche home-services --strict-footage
 *   node library/scripts/assert-assets.mjs --niche home-services --i2v-available
 *   node library/scripts/assert-assets.mjs --niche home-services --connected-i2v
 *
 * Returns buckets{P0,P1,P2}, achieved_rung, ad_grade_ok.
 * Uncovered P0 → must_disclose_before_generate:true.
 * Still or diagram under library/footage/ → hard fail (ad_grade_ok false).
 *
 * Exit 0 = audio OK and no hard basket poison (disclose may still be true).
 * Exit 1 = audio missing OR basket contains still/diagram poison (--strict or always for poison).
 * Exit 2 = audio OK but P0 gaps / not ad_grade (warn). --strict-footage → exit 1 on P0 gaps.
 */
import { spawnSync } from "node:child_process";
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
function flag(name) {
  return process.argv.includes(name);
}

const niche = arg("--niche", "home-services");
const strictFootage = flag("--strict-footage");
const i2vAvailable = flag("--i2v-available") || flag("--open-i2v");
const connectedI2v = flag("--connected-i2v");

const bucketsFile = path.join(LIB, "footage/buckets", `${niche}.json`);
const ledgerPath = path.join(LIB, "assets/license-ledger.json");
const footageDir = path.join(LIB, "footage", niche);

const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
const bucketDef = fs.existsSync(bucketsFile)
  ? JSON.parse(fs.readFileSync(bucketsFile, "utf8"))
  : { buckets: [] };

const AUDIO_NEED = {
  "home-services": { music_bed: 1, sfx_phone: 1, sfx_ui: 1, ambience: 1 },
  saas: { music_bed: 1, sfx_ui: 1, ambience: 1 },
};
const need = AUDIO_NEED[niche] || AUDIO_NEED["home-services"];

function exists(a) {
  return a?.path && fs.existsSync(path.join(ROOT, a.path));
}

const assets = ledger.assets || [];
const beds = assets.filter((a) => a.kind === "music_bed" && exists(a));
const sfx = assets.filter((a) => a.kind === "sfx" && exists(a));
const amb = assets.filter((a) => a.kind === "ambience" && exists(a));
const phoneSfx = sfx.filter(
  (a) => (a.tags || []).includes("phone") || (a.niches || []).includes(niche)
);
const uiSfx = sfx.filter((a) =>
  (a.tags || []).some((t) => ["ui", "click", "notification"].includes(t))
);

const audio_gaps = [];
if (beds.length < need.music_bed) {
  audio_gaps.push({ bucket: "music_bed", have: beds.length, need: need.music_bed });
}
if (phoneSfx.length < (need.sfx_phone || 0)) {
  audio_gaps.push({ bucket: "sfx_phone", have: phoneSfx.length, need: need.sfx_phone });
}
if (uiSfx.length < (need.sfx_ui || 0)) {
  audio_gaps.push({ bucket: "sfx_ui", have: uiSfx.length, need: need.sfx_ui });
}
if (amb.length < need.ambience) {
  audio_gaps.push({ bucket: "ambience", have: amb.length, need: need.ambience });
}

/** Poison in footage basket: stills or diagram-class rejects */
const basket_poison = [];
if (fs.existsSync(footageDir)) {
  for (const name of fs.readdirSync(footageDir)) {
    const abs = path.join(footageDir, name);
    if (!fs.statSync(abs).isFile()) continue;
    if (/\.(jpe?g|png|webp|gif)$/i.test(name)) {
      basket_poison.push({
        path: `library/footage/${niche}/${name}`,
        reason: "still_in_footage_slot",
        reject_classes: ["still_in_footage_slot"],
      });
    }
  }
}
for (const a of assets) {
  if (!a.path?.includes(`library/footage/${niche}/`)) continue;
  if (!exists(a)) continue;
  const classes = a.reject_classes || [];
  if (
    a.reject &&
    classes.some((c) =>
      [
        "diagram_schematic",
        "illustration",
        "chart_text_heavy",
        "still_in_footage_slot",
        "wrong_industry",
      ].includes(c)
    )
  ) {
    basket_poison.push({
      id: a.id,
      path: a.path,
      reason: "rejected_asset_in_footage_basket",
      reject_classes: classes,
    });
  }
  if (a.kind === "still" || a.media === "still" || /\.(jpe?g|png|webp)$/i.test(a.path)) {
    basket_poison.push({
      id: a.id,
      path: a.path,
      reason: "still_ledgered_under_footage",
      reject_classes: ["still_in_footage_slot"],
    });
  }
}

function eligible(a, bucketId) {
  if (!exists(a)) return false;
  if (a.reject === true) return false;
  if (a.motion_confirmed !== true) return false;
  if (!["high", "med"].includes(a.niche_fit)) return false;
  const kindOk = a.kind === "video" || (a.kind === "footage" && a.media === "video");
  if (!kindOk) return false;
  if (/\.(jpe?g|png|webp)$/i.test(a.path)) return false;
  if (a.bucket !== bucketId) return false;
  return a.niches?.includes(niche) || (a.tags || []).includes(niche);
}

/** Place-expecting buckets count as “real place” for the 60% person/hands/place rule */
const PLACE_BUCKETS = new Set(["hook_vehicle", "place_job_site"]);
const PERSON_PEOPLE = new Set(["face", "hands_only", "group"]);

function isAdGrade(a, bucket) {
  if (!a || !a.motion_confirmed) return { ok: false, reasons: ["no_motion"] };
  if (!["high", "medium"].includes(a.motion)) {
    return { ok: false, reasons: ["motion_too_low"] };
  }
  const reasons = [];
  const fitOk =
    a.niche_fit === "high" ||
    (a.niche_fit === "med" && bucket.id === "product_screen");
  if (!fitOk) reasons.push("subject_fit_weak");

  const expectsPresence =
    ["person_face", "problem_hands_tools", "hook_phone_ring"].includes(bucket.id) ||
    PLACE_BUCKETS.has(bucket.id);
  const hasPresence =
    PERSON_PEOPLE.has(a.people) ||
    PLACE_BUCKETS.has(bucket.id) ||
    bucket.id === "product_screen"; // UI hands/phone ok at med
  if (expectsPresence && !hasPresence && a.people === "none" && !PLACE_BUCKETS.has(bucket.id)) {
    reasons.push("missing_person_hands_or_place");
  }

  const bad = (a.reject_classes || []).length > 0 || a.reject === true;
  if (bad) reasons.push("reject_classes");

  const cliche = (a.tags || []).some((t) => /cliche|stock-cliche/i.test(t));
  if (cliche) reasons.push("stock_cliche");

  // watermark / logo clutter from prior vet
  if ((a.reject_classes || []).includes("logo_trademark")) reasons.push("logo_clutter");

  return { ok: reasons.length === 0, reasons };
}

function pickBucket(bucket) {
  const pool = assets
    .filter((a) => eligible(a, bucket.id))
    .sort((a, b) => {
      const fit = { high: 2, med: 1 }[a.niche_fit] - { high: 2, med: 1 }[b.niche_fit];
      if (fit) return -fit;
      const mot =
        { high: 3, medium: 2, low: 1 }[a.motion] - { high: 3, medium: 2, low: 1 }[b.motion];
      if (mot) return -mot;
      return (b.height || 0) - (a.height || 0);
    });
  if (!pool.length) {
    return {
      covered: false,
      missing: [bucket.id],
      picks: [],
      ad_grade_picks: 0,
    };
  }
  const top = pool.slice(0, 3);
  const graded = top.map((a) => {
    const g = isAdGrade(a, bucket);
    return {
      id: a.id,
      path: a.path,
      motion: a.motion,
      niche_fit: a.niche_fit,
      people: a.people,
      ad_grade: g.ok,
      ad_grade_reasons: g.reasons,
      source: a.source,
      verified_via: a.verified_via,
    };
  });
  return {
    covered: true,
    missing: [],
    picks: graded,
    ad_grade_picks: graded.filter((g) => g.ad_grade).length,
    best: graded[0],
  };
}

const byPri = { P0: [], P1: [], P2: [] };
for (const b of bucketDef.buckets || []) {
  const pri = b.priority || "P2";
  if (!byPri[pri]) byPri[pri] = [];
  byPri[pri].push({ ...b, eval: pickBucket(b) });
}

function summarize(list) {
  const covered = list.filter((b) => b.eval.covered).map((b) => b.id);
  const missing = list.filter((b) => !b.eval.covered).map((b) => b.id);
  const adGrade = list
    .filter((b) => b.eval.covered && b.eval.best?.ad_grade)
    .map((b) => b.id);
  return {
    covered,
    missing,
    ad_grade: adGrade,
    count_covered: covered.length,
    count_total: list.length,
  };
}

const buckets = {
  P0: summarize(byPri.P0),
  P1: summarize(byPri.P1),
  P2: summarize(byPri.P2),
};

const p0Total = byPri.P0.length || 1;
const p0Covered = buckets.P0.count_covered;
const p0AdGrade = buckets.P0.ad_grade.length;
const p0AdGradeRatio = p0Covered ? p0AdGrade / p0Covered : 0;

const userSuppliedP0 = byPri.P0.every((b) => {
  if (!b.eval.covered) return false;
  return b.eval.best?.verified_via === "user_supplied" || b.eval.best?.source === "user_supplied";
});

let achieved_rung;
if (basket_poison.length) {
  achieved_rung = "designed_cards_on_void";
} else if (userSuppliedP0 && p0Covered === p0Total) {
  achieved_rung = "user_supplied_business";
} else if (p0Covered === p0Total && p0AdGradeRatio >= 0.6) {
  achieved_rung = "competent_native_eligible";
} else if (p0Covered === p0Total) {
  achieved_rung = "stock_motion_partial"; // covered but not ad_grade enough
} else if (p0Covered > 0) {
  achieved_rung = "stock_motion_partial";
} else {
  achieved_rung = "designed_cards_on_void";
}

// Elevate rung when i2v can fill gaps (explicit wire)
let i2v_rung = null;
if (buckets.P0.missing.length || achieved_rung === "stock_motion_partial") {
  if (connectedI2v) i2v_rung = "connected_i2v";
  else if (i2vAvailable) i2v_rung = "open_i2v";
}

const ad_grade_ok =
  basket_poison.length === 0 &&
  buckets.P0.missing.length === 0 &&
  p0AdGradeRatio >= 0.6 &&
  audio_gaps.length === 0;

const p0Missing = buckets.P0.missing.length > 0;
const must_disclose_before_generate =
  p0Missing ||
  basket_poison.length > 0 ||
  audio_gaps.length > 0 ||
  !ad_grade_ok;

const quality_ceiling =
  achieved_rung === "user_supplied_business"
    ? "top_decile_eligible — real business footage locked"
    : achieved_rung === "competent_native_eligible"
      ? "competent_native_eligible — free motion stock on-message (not top-decile without USER_SUPPLIED)"
      : achieved_rung === "stock_motion_partial"
        ? "stock_motion_partial — disclose; prefer i2v / USER_SUPPLIED shoot"
        : "designed_cards_on_void — disclose before generate";

const out = {
  gate: "assert-assets",
  niche,
  audio_ok: audio_gaps.length === 0,
  audio_gaps,
  buckets,
  basket_poison,
  ad_grade_ok,
  ad_grade_rule:
    "P0 all covered + ≥60% of covered P0 picks ad_grade + no still/diagram in footage basket",
  p0_ad_grade_ratio: Number(p0AdGradeRatio.toFixed(3)),
  achieved_rung,
  i2v_rung,
  i2v_guidance: i2v_rung
    ? i2v_rung === "connected_i2v"
      ? "Fill gaps with Seedance/Higgsfield; name tool in render plan; still never substitutes footage slot"
      : "Fill gaps with Wan/LTX/Grok/Kling i2v on vetted stills in library/stills/; never raw stills on timeline"
    : buckets.P0.missing.length === 0
      ? "P0 covered — optional i2v only for identity-locked product_screen upgrades"
      : "Pass --connected-i2v or --i2v-available when those tools exist in-session",
  quality_ceiling,
  must_disclose_before_generate,
  footage_complete: !p0Missing && basket_poison.length === 0,
  honest_ceiling:
    "Free CC0/Mixkit reaches competent_native_eligible. Top-decile needs real business footage → then i2v → then best vetted stock.",
  message:
    audio_gaps.length > 0
      ? "BLOCK: required audio assets missing — do not invent a music bed"
      : basket_poison.length
        ? "FAIL: still or diagram in footage basket — remove before generate"
        : p0Missing
          ? `DISCLOSE: P0 missing ${buckets.P0.missing.join(", ")} — achieved_rung=${achieved_rung}`
          : ad_grade_ok
            ? `OK: ad_grade_ok · achieved_rung=${achieved_rung}`
            : `DISCLOSE: covered but not ad_grade (≥60% P0) — achieved_rung=${achieved_rung}`,
  next: [
    "library/footage/rungs.md",
    "node library/scripts/assemble-plan.mjs --card hvac-missed-call-void-01",
    "node library/scripts/prove-footage-gates.mjs",
  ],
};

console.log(JSON.stringify(out, null, 2));

if (audio_gaps.length) process.exit(1);
if (basket_poison.length) process.exit(1);
if (p0Missing && strictFootage) process.exit(1);
if (p0Missing || !ad_grade_ok) process.exit(2);
process.exit(0);
