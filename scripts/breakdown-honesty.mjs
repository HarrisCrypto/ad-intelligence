/**
 * Claim / proof honesty for ad breakdowns.
 * Awards, quotes, and URLs must be checkable. Media payloads are rejected.
 * Observed-card honesty for the legacy lint lives in classroom/scripts/observed-honesty.mjs.
 */

const BANNED_HOSTS = [/(\.|^)archive\.org$/i, /(\.|^)login\./i];

function httpsUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return "must be https";
    if (BANNED_HOSTS.some((re) => re.test(url.hostname))) {
      return `host not allowed: ${url.hostname}`;
    }
    return null;
  } catch {
    return "invalid url";
  }
}

export function breakdownHonestyErrors(card) {
  const errs = [];
  const blob = JSON.stringify(card);
  if (/\[FILL/i.test(blob)) errs.push("unfilled [FILL] placeholder");
  if (/keyboard_arrow_right/i.test(blob)) errs.push("OCR junk keyboard_arrow_right");
  if (/data:(image|video|audio)\//i.test(blob)) errs.push("embedded media payload");
  if (/"base64"/i.test(blob)) errs.push("base64 payload");
  if (/\.mp4\b/i.test(blob) || /\.mov\b/i.test(blob)) {
    errs.push("media file reference — store a page URL, not a video file");
  }

  const official = httpsUrl(card.official_url || "");
  if (official) errs.push(`official_url ${official}`);

  if (card.award) {
    const evidence = httpsUrl(card.award.evidence_url || "");
    if (evidence) errs.push(`award.evidence_url ${evidence}`);
    if (!card.award.name || !card.award.category || card.award.year == null) {
      errs.push("award object missing name, year, or category — use null instead");
    }
  }

  for (const overlay of card.text_overlays || []) {
    const wording = overlay.wording || "";
    if (wording.length > 140) {
      errs.push("on-screen quote longer than 140 characters");
    }
  }

  const recipe = (card.rebuild_recipe || []).join("\n").toLowerCase();
  if (
    !recipe.includes("do not copy") ||
    !recipe.includes("logo") ||
    !recipe.includes("exact copy")
  ) {
    errs.push(
      "rebuild_recipe must say not to copy the brand's logos, characters, or exact copy"
    );
  }

  if (card.last_verified) {
    const verified = new Date(`${card.last_verified}T00:00:00Z`);
    const today = new Date();
    const todayUtc = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    );
    if (Number.isNaN(verified.getTime())) errs.push("last_verified is not a date");
    else if (verified > todayUtc) errs.push("last_verified is in the future");
  }

  return errs;
}
