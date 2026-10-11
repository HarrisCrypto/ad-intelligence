/**
 * Reference-ad substance gate.
 *
 * A measured video is not a reference ad unless:
 *  1. source.platform is a real ad library (not archive.org / footage dumps)
 *  2. duration is in the short-form band (5–90s)
 *  3. niche is derived from content with sufficient confidence
 *
 * archive.org is fine as *footage*; never as a reference ad.
 */

export const AD_LIBRARY_PLATFORMS = new Set([
  "meta",
  "facebook",
  "instagram",
  "tiktok",
  "google",
  "google_ads_transparency",
  "youtube_ads",
  "youtube",
  "award",
  "clio",
  "cannes",
  "adc",
  "dandad",
]);

/** Short-form reference ads only. */
export const REF_DURATION_MIN_S = 5;
export const REF_DURATION_MAX_S = 90;

/** Minimum niche_confidence to count toward video_coverage / patterns. */
export const MIN_NICHE_CONFIDENCE = 0.55;

const VIDEO_FORMATS = new Set([
  "ugc_video",
  "polished_video",
  "motion_graphics",
  "screen_recording",
  "talking_head",
]);

/** Positive content signals per niche (OCR / advertiser / domain). */
const NICHE_SIGNALS = {
  "home-services": [
    /\bhvac\b/i,
    /\bplumb/i,
    /\belectric/i,
    /\broof/i,
    /\bhandyman\b/i,
    /thumbtack|angi\.com|homeadvisor|porch\.com|taskrabbit/i,
  ],
  dental: [
    /\bdentist/i,
    /\bteeth\b/i,
    /\bwhitening\b/i,
    /\boral\b/i,
    /\bsmile\b/i,
    /quip|burstoral|smilebrilliant/i,
  ],
  saas: [
    /\bcrm\b/i,
    /\bsoftware\b/i,
    /\bdashboard\b/i,
    /\bworkflow\b/i,
    /\bapi\b/i,
    /hubspot|monday\.com|notion\.so|zapier|intercom/i,
  ],
  skincare: [
    /\bskincare\b/i,
    /\bacne\b/i,
    /\bserum\b/i,
    /\bmoisturizer\b/i,
    /curology|theordinary|drunkelephant/i,
  ],
  ecom: [
    /\bshop\b/i,
    /\bfree shipping\b/i,
    /\border now\b/i,
    /\badd to cart\b/i,
    /shopify|amazon\.com/i,
  ],
  beauty: [
    /\bmakeup\b/i,
    /\bbeauty\b/i,
    /\blipstick\b/i,
    /\bmascara\b/i,
    /sephora|ulta\.com/i,
  ],
  legal: [
    /\blawyer\b/i,
    /\battorney\b/i,
    /\blegal\b/i,
    /\binjury\b/i,
    /\bconsult/i,
  ],
  local: [
    /\blocal\b/i,
    /\bnear me\b/i,
    /\bbook now\b/i,
    /yelp\.com|nextdoor/i,
  ],
};

/** Brands/topics that contradict a claimed niche (archive contamination). */
const NICHE_CONTRADICTIONS = {
  "home-services": [
    /chevrolet|chevy|folgers|jeep|kellogg|us[_\\s-]*steel|airline|plane[_\\s-]*tal/i,
  ],
  dental: [/chevrolet|folgers|jeep|kellogg|us[_\\s-]*steel|airline|baggies/i],
  saas: [/chevrolet|folgers|jeep|kellogg|crest|toothpaste|baby[_\\s-]*bath/i],
  skincare: [/chevrolet|folgers|jeep|kellogg|us[_\\s-]*steel|airline/i],
  ecom: [/us[_\\s-]*steel|airline[_\\s-]*pilot|plane[_\\s-]*tal|freedoma?1952/i],
  beauty: [/chevrolet|jeep|us[_\\s-]*steel|airline|hvac|plumb/i],
  legal: [
    /chevrolet|folgers|jeep|kellogg|airline|plane[_\\s-]*tal|us[_\\s-]*steel|freedoma?1952|hit[_\\s-]*parade/i,
  ],
  local: [/us[_\\s-]*steel|airline[_\\s-]*pilot|plane[_\\s-]*tal|freedoma?1952/i],
};

export function normalizePlatform(raw) {
  const p = String(raw || "")
    .trim()
    .toLowerCase();
  if (!p) return "";
  if (p === "google" || p === "ads_transparency" || p === "gat") {
    return "google_ads_transparency";
  }
  if (p === "fb" || p === "facebook" || p === "instagram" || p === "ig") {
    return p === "instagram" || p === "ig" ? "instagram" : "meta";
  }
  if (p === "yt" || p === "youtube") return "youtube_ads";
  if (p === "archive" || p === "archive.org" || p === "prelinger") {
    return "archive.org";
  }
  return p;
}

export function isAdLibraryPlatform(platform) {
  const p = normalizePlatform(platform);
  if (p === "archive.org") return false;
  return AD_LIBRARY_PLATFORMS.has(p);
}

export function isVideoFormat(fmt) {
  return VIDEO_FORMATS.has(fmt);
}

function cardTextBlob(card) {
  const parts = [
    card.source?.url_or_library_id,
    card.source?.platform,
    card.look?.ocr_sample,
    ...(card.stats?.headline_chars || []).map(String),
    ...(card.shots || []).map((s) => s.on_screen_text || ""),
    card.hook?.first_second_description,
    card.offer_and_proof?.offer,
    card.offer_and_proof?.proof,
    card.cta?.primary,
    card.why_it_works,
    ...(card.tags || []),
  ];
  return parts.filter(Boolean).join("\n");
}

/**
 * Derive niche signals from card content. Does not trust the assigned label.
 * Returns { niche, niche_confidence, evidence, contradictions }.
 */
export function deriveNiche(card, claimedNiche = card?.niche) {
  const blob = cardTextBlob(card);
  const scores = {};
  const evidence = {};
  for (const [niche, res] of Object.entries(NICHE_SIGNALS)) {
    let s = 0;
    const hits = [];
    for (const re of res) {
      if (re.test(blob)) {
        s += 1;
        hits.push(String(re));
      }
    }
    scores[niche] = s;
    if (hits.length) evidence[niche] = hits;
  }

  const claimed = claimedNiche || null;
  const contradictions = [];
  if (claimed && NICHE_CONTRADICTIONS[claimed]) {
    for (const re of NICHE_CONTRADICTIONS[claimed]) {
      if (re.test(blob)) contradictions.push(String(re));
    }
  }
  // Also scan source id for archive brand names
  const src = String(card.source?.url_or_library_id || "");
  if (claimed && NICHE_CONTRADICTIONS[claimed]) {
    for (const re of NICHE_CONTRADICTIONS[claimed]) {
      if (re.test(src) && !contradictions.includes(String(re))) {
        contradictions.push(String(re));
      }
    }
  }

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const best = ranked[0];
  const bestNiche = best && best[1] > 0 ? best[0] : null;
  const bestScore = best ? best[1] : 0;

  let confidence = 0;
  if (bestScore >= 2) confidence = Math.min(1, 0.45 + bestScore * 0.2);
  else if (bestScore === 1) confidence = 0.4;

  // Domain/platform from real ad libraries: bump if claimed matches best
  if (isAdLibraryPlatform(card.source?.platform) && claimed && bestNiche === claimed) {
    confidence = Math.max(confidence, 0.7);
  }
  if (contradictions.length) {
    confidence = Math.min(confidence, 0.15);
  }
  // archive.org never yields a trustworthy niche assignment for reference use
  if (normalizePlatform(card.source?.platform) === "archive.org") {
    confidence = 0;
  }

  return {
    niche: bestNiche || claimed || null,
    niche_confidence: +confidence.toFixed(3),
    evidence,
    contradictions,
    scores,
  };
}

/**
 * Substance errors for reference eligibility (video formats).
 * Non-video formats: only platform check (still reject archive as "reference ad").
 */
export function referenceSubstanceErrors(card) {
  const errs = [];
  const platform = normalizePlatform(card?.source?.platform);
  if (!platform) {
    errs.push("missing source.platform");
  } else if (!isAdLibraryPlatform(platform)) {
    errs.push(
      `platform:${platform || card?.source?.platform} is not an ad library (archive.org/footage/owned ≠ reference ad)`
    );
  }

  if (!isVideoFormat(card?.format)) {
    return errs;
  }

  const dur = card.duration_s;
  if (dur == null || Number.isNaN(Number(dur))) {
    errs.push("duration_s missing");
  } else if (Number(dur) < REF_DURATION_MIN_S || Number(dur) > REF_DURATION_MAX_S) {
    errs.push(
      `duration_s:${dur} outside short-form band ${REF_DURATION_MIN_S}-${REF_DURATION_MAX_S}s`
    );
  }

  const derived = card.niche_derived || deriveNiche(card);
  const conf =
    card.niche_confidence != null
      ? Number(card.niche_confidence)
      : derived.niche_confidence;
  if (!(conf >= MIN_NICHE_CONFIDENCE)) {
    errs.push(
      `niche_confidence:${conf} < ${MIN_NICHE_CONFIDENCE}` +
        (derived.contradictions?.length
          ? ` (contradictions: ${derived.contradictions.join(",")})`
          : "")
    );
  }
  if (
    derived.niche &&
    card.niche &&
    derived.niche !== card.niche &&
    conf < MIN_NICHE_CONFIDENCE
  ) {
    errs.push(`niche_mismatch:claimed=${card.niche},derived=${derived.niche}`);
  }

  return errs;
}

/** Observed + measured honesty is separate; this is reference substance. */
export function isValidReferenceVideo(card) {
  if (!card || !isVideoFormat(card.format)) return false;
  if (card.provenance?.observed !== true) return false;
  return referenceSubstanceErrors(card).length === 0;
}

export function isValidReferenceCard(card) {
  if (!card || card.provenance?.observed !== true) return false;
  return referenceSubstanceErrors(card).length === 0;
}

/** Attach niche_confidence + substance block onto a card (mutates). */
export function applyReferenceSubstance(card) {
  const derived = deriveNiche(card);
  card.niche_derived = derived.niche;
  card.niche_confidence = derived.niche_confidence;
  card.niche_evidence = {
    evidence: derived.evidence,
    contradictions: derived.contradictions,
  };
  const errs = referenceSubstanceErrors(card);
  card.provenance = card.provenance || {};
  card.provenance.reference_ok = errs.length === 0;
  card.provenance.reference_blocked_reason = errs.length ? errs.join("; ") : null;
  card.measured_by = card.measured_by || {};
  card.measured_by.substance_errors = errs;
  return { card, errors: errs, derived };
}
