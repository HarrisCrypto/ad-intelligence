/**
 * Hard rule: observed:true means measured from real ad media.
 * Video: loudness > -60 LUFS, shot_count >= 1, duration > 0.
 * No-video: measured OCR/text stats; loudness/shot timing may be null.
 */

export const MIN_LUFS = -60;

const NO_VIDEO = new Set([
  "search_text",
  "display_static",
  "carousel_static",
  "text_search",
  "static_image",
  "carousel",
]);

function isNoVideo(card) {
  return (
    NO_VIDEO.has(card.format) ||
    NO_VIDEO.has(card.structure?.format)
  );
}

export function observedHonestyErrors(card) {
  const errs = [];
  if (card.provenance?.observed !== true) return errs;

  if (card.stats?.stats_source !== "measured") {
    errs.push('stats.stats_source must be "measured"');
  }
  if (card.provenance.media_committed === true) {
    errs.push("media_committed must not be true");
  }
  const tooling = card.measured_by?.tooling || card.provenance?.basis;
  if (!tooling || (Array.isArray(tooling) && tooling.length === 0)) {
    errs.push("measured_by.tooling (or provenance.basis) required");
  }

  if (isNoVideo(card)) {
    const hasText =
      (card.stats?.ocr_line_count || 0) > 0 ||
      (Array.isArray(card.stats?.headline_chars) &&
        card.stats.headline_chars.length > 0) ||
      (card.look?.ocr_sample && String(card.look.ocr_sample).trim().length > 0) ||
      (card.shots || []).some((s) => s.on_screen_text && s.source === "measured");
    if (!hasText) errs.push("no-video observed card needs measured OCR/text");
    return errs;
  }

  const lufs = card.audio?.loudness_lufs ?? card.stats?.loudness_lufs;
  if (lufs == null || Number(lufs) <= MIN_LUFS) {
    errs.push(
      `video observed requires loudness_lufs > ${MIN_LUFS} (got ${lufs}) — digital silence / placeholder`
    );
  }
  const shots = card.stats?.shot_count;
  if (shots == null || Number(shots) < 1) {
    errs.push(`video observed requires shot_count >= 1 (got ${shots})`);
  }
  const dur = card.duration_s;
  if (dur == null || Number(dur) <= 0) {
    errs.push(`video observed requires duration_s > 0 (got ${dur})`);
  }
  return errs;
}

export function isGenuinelyObserved(card) {
  return (
    card?.provenance?.observed === true &&
    observedHonestyErrors(card).length === 0
  );
}
