/**
 * Shared study + AdBlueprint validation (no external JSON-Schema deps).
 */
const BASIS = new Set([
  "synthesis",
  "ad-library",
  "named-campaign",
  "owned-ad",
]);

const STRUCTURE_FORMATS = new Set([
  "video_timed",
  "search_text",
  "display_static",
  "carousel_static",
  "unknown",
]);

const NON_VIDEO_FORMATS = new Set([
  "search_text",
  "display_static",
  "carousel_static",
]);

const BLUEPRINT_REQUIRED = [
  "id",
  "name",
  "platforms",
  "style",
  "funnel_stage",
  "duration_seconds",
  "hook",
  "body",
  "cta",
  "why_it_works",
  "output_contract",
];

/** Refuse embedded creatives / blobs — structured notes only. */
export function rejectMediaPayload(obj, { file = "study" } = {}) {
  const errors = [];
  let raw;
  try {
    raw = JSON.stringify(obj);
  } catch {
    return [`${file}: not serializable`];
  }
  if (/data:(image|video|audio)\//i.test(raw)) {
    errors.push(
      `${file}: embedded data: URI media forbidden — store structure notes only, never creatives`
    );
  }
  // Long base64-ish blobs (not normal prose / ids)
  if (/[A-Za-z0-9+/]{800,}={0,2}/.test(raw)) {
    errors.push(
      `${file}: large base64 blob detected — media bytes are forbidden in studies`
    );
  }
  const mediaKey =
    /^(media|video|image|thumbnail|frame|frames|asset_bytes|binary|blob|mp4|png|jpg|jpeg|webp|gif|screenshot_bytes)$/i;
  function walk(node, p) {
    if (!node || typeof node !== "object") return;
    for (const [k, v] of Object.entries(node)) {
      const path = p ? `${p}.${k}` : k;
      if (mediaKey.test(k)) {
        if (
          typeof v === "string" &&
          (v.length > 120 ||
            /^data:/i.test(v) ||
            /\.(mp4|mov|webm|mkv|avi|jpg|jpeg|png|webp|gif)\b/i.test(v))
        ) {
          errors.push(
            `${file}: media field \`${path}\` rejected — do not store creatives; describe structure only`
          );
        } else if (v && typeof v === "object") {
          errors.push(
            `${file}: media object \`${path}\` rejected — structured breakdowns only`
          );
        }
      }
      if (typeof v === "string") {
        if (
          /\.(mp4|mov|webm|mkv|avi)\b/i.test(v) &&
          /(https?:|\.\/|\/tmp\/|file:)/i.test(v)
        ) {
          errors.push(
            `${file}: media URL/path in \`${path}\` forbidden — no creative files in git/private studies`
          );
        }
      } else if (v && typeof v === "object") {
        walk(v, path);
      }
    }
  }
  walk(obj, "");
  return errors;
}

export function validateProvenance(prov, { requireObservedFields = false } = {}) {
  const errors = [];
  if (!prov || typeof prov !== "object") {
    errors.push("provenance missing — required { observed, basis, claim_firewall }");
    return errors;
  }
  if (typeof prov.observed !== "boolean") {
    errors.push("provenance.observed must be boolean");
  }
  if (!BASIS.has(prov.basis)) {
    errors.push(
      `provenance.basis must be one of ${[...BASIS].join("|")} (got ${prov.basis})`
    );
  }
  if (
    typeof prov.claim_firewall !== "string" ||
    prov.claim_firewall.trim().length < 20
  ) {
    errors.push("provenance.claim_firewall must be a ≥20 char honesty label");
  }
  if (prov.observed === true || prov.basis === "ad-library" || prov.basis === "named-campaign") {
    if (requireObservedFields || prov.observed === true) {
      if (!prov.observed_date && !prov.library_ids?.length) {
        errors.push(
          "observed/ad-library studies need provenance.observed_date or library_ids"
        );
      }
    }
  }
  if (prov.observed === true && prov.basis === "synthesis") {
    errors.push("provenance.observed:true cannot use basis:synthesis");
  }
  if (prov.observed === false && prov.basis !== "synthesis" && prov.basis !== "owned-ad") {
    // allow owned-ad unobserved drafts; ad-library/named should usually be observed
    if (prov.basis === "ad-library" || prov.basis === "named-campaign") {
      errors.push(`${prov.basis} basis should set observed:true after a real watch`);
    }
  }
  return errors;
}

export function validateStudy(study, { file = "study" } = {}) {
  const errors = [];
  if (!study || typeof study !== "object") {
    return [`${file}: not an object`];
  }
  errors.push(...rejectMediaPayload(study, { file }));
  for (const k of [
    "id",
    "title",
    "platforms",
    "niches",
    "structure",
    "steal",
    "never_copy",
    "why_it_works",
    "human_build",
    "provenance",
  ]) {
    if (study[k] === undefined || study[k] === null) {
      errors.push(`${file}: missing ${k}`);
    }
  }
  if (study.id && !/^[a-z0-9][a-z0-9_-]*$/.test(study.id)) {
    errors.push(`${file}: invalid id`);
  }
  if (!Array.isArray(study.platforms) || !study.platforms.length) {
    errors.push(`${file}: platforms[] required`);
  }
  if (!Array.isArray(study.niches) || !study.niches.length) {
    errors.push(`${file}: niches[] required`);
  }
  if (!study.structure?.hook_0_3 || !Array.isArray(study.structure?.beats) || study.structure.beats.length < 2) {
    errors.push(`${file}: structure.hook_0_3 + ≥2 beats required`);
  }
  const fmt = study.structure?.format;
  if (!STRUCTURE_FORMATS.has(fmt)) {
    errors.push(
      `${file}: structure.format required (video_timed|search_text|display_static|carousel_static|unknown)`
    );
  }
  if (typeof study.structure?.timing_observable !== "boolean") {
    errors.push(`${file}: structure.timing_observable boolean required`);
  }
  if (NON_VIDEO_FORMATS.has(fmt)) {
    if (study.structure.timing_observable !== false) {
      errors.push(
        `${file}: format=${fmt} requires timing_observable:false (no video seconds inventable)`
      );
    }
    // Beats must not look like video timecodes
    for (const b of study.structure.beats || []) {
      if (/\d+\s*[-–]\s*\d+\s*s|\b\d+\s*s\b/i.test(String(b.t || ""))) {
        errors.push(
          `${file}: format=${fmt} beat.t "${b.t}" looks like video seconds — use headline/description/sitelink labels`
        );
        break;
      }
    }
  }
  if (fmt === "video_timed" && study.structure.timing_observable === false) {
    errors.push(
      `${file}: format=video_timed with timing_observable:false — use search_text/display_static/unknown instead`
    );
  }
  if (!Array.isArray(study.human_build) || study.human_build.length < 1) {
    errors.push(`${file}: human_build[] playbook required`);
  }
  errors.push(
    ...validateProvenance(study.provenance, {
      requireObservedFields: study.provenance?.observed === true,
    }).map((e) => `${file}: ${e}`)
  );
  return errors;
}

export function validateBlueprint(bp, { file = "blueprint" } = {}) {
  const errors = [];
  if (!bp || typeof bp !== "object") return [`${file}: not an object`];
  errors.push(...rejectMediaPayload(bp, { file }));
  for (const k of BLUEPRINT_REQUIRED) {
    if (bp[k] === undefined || bp[k] === null) errors.push(`${file}: missing ${k}`);
  }
  if (bp.hook && typeof bp.hook === "object") {
    for (const k of [
      "window_seconds",
      "visual",
      "audio_or_vo",
      "text_overlay",
      "pattern_interrupt",
    ]) {
      if (!bp.hook[k]) errors.push(`${file}: hook.${k} required`);
    }
  }
  if (!Array.isArray(bp.body?.beats) || bp.body.beats.length < 2) {
    errors.push(`${file}: body.beats ≥2 required`);
  }
  if (!Array.isArray(bp.why_it_works) || bp.why_it_works.length < 2) {
    errors.push(`${file}: why_it_works ≥2 required`);
  }
  if (!bp.output_contract?.deliverables) {
    errors.push(`${file}: output_contract.deliverables required`);
  }
  // Provenance required on ingest for claim-firewall honesty
  if (!bp.provenance) {
    errors.push(
      `${file}: provenance required on ingest { observed, basis, claim_firewall }`
    );
  } else {
    errors.push(
      ...validateProvenance(bp.provenance).map((e) => `${file}: ${e}`)
    );
  }
  return errors;
}

/** Map AdBlueprint → study shape for retrieve join. */
export function blueprintToStudy(bp) {
  const beats = (bp.body?.beats || []).map((b) => ({
    t: b.t,
    job: b.purpose,
    note: b.visual,
  }));
  return {
    id: bp.id.startsWith("study_") ? bp.id : `study_${bp.id}`,
    class: "other",
    title: bp.name,
    private: true,
    platforms: bp.platforms || [],
    niches: bp.niches || [],
    pattern_ids: bp.pattern_ids || [],
    attention_model_ids: bp.attention_model_ids || [],
    when_to_emulate: ["Private observed/synthesis breakdown — check provenance"],
    when_not: ["If provenance.basis is synthesis, do not cite as proof"],
    structure: {
      format: bp.structure?.format || bp.format || "video_timed",
      timing_observable:
        typeof bp.structure?.timing_observable === "boolean"
          ? bp.structure.timing_observable
          : (bp.format || bp.structure?.format) === "search_text" ||
              (bp.format || bp.structure?.format) === "display_static"
            ? false
            : true,
      duration_s: bp.duration_seconds?.ideal || bp.duration_seconds?.max || null,
      hook_0_3: bp.hook?.pattern_interrupt || bp.hook?.visual || "",
      beats,
    },
    steal: (bp.why_it_works || []).slice(0, 4),
    never_copy: [
      "Verbatim competitor lines",
      "Their logos/reviews",
      "Invented CTR/ROAS",
      ...(bp.anti_patterns || []).slice(0, 3),
    ],
    why_it_works: bp.why_it_works || [],
    human_build: [
      {
        step: 1,
        action: "Emulate structure from this private breakdown for THIS brand",
        tools: ["emulate-attention-model", "human-build-os"],
      },
      {
        step: 2,
        action: "Fill human-build log artifact; finish-the-cut; lint",
        tools: ["human-build-log", "finish-the-cut", "lint-package"],
      },
    ],
    provenance: bp.provenance,
    research_where: bp.research_where || {
      libraries: bp.provenance?.library_ids || [],
      what_to_note: bp.source_notes || "",
    },
    source_notes: bp.source_notes || "",
    from_blueprint: bp.id,
  };
}

export function isBlueprintShape(obj) {
  return Boolean(obj?.hook?.visual && obj?.body?.beats && obj?.cta && obj?.name);
}

export function isStudyShape(obj) {
  return Boolean(obj?.structure?.beats && obj?.steal && obj?.human_build);
}
