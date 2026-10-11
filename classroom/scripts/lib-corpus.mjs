/**
 * Shared corpus helpers — niches/formats as data.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

export const NICHES = JSON.parse(
  fs.readFileSync(path.join(ROOT, "niches.json"), "utf8")
);
export const FORMATS = JSON.parse(
  fs.readFileSync(path.join(ROOT, "formats.json"), "utf8")
);

export function resolveFormat(raw) {
  if (!raw) return null;
  if (FORMATS.formats.some((f) => f.id === raw)) return raw;
  return FORMATS.legacy_aliases[raw] || raw;
}

export function formatMeta(id) {
  const resolved = resolveFormat(id);
  return FORMATS.formats.find((f) => f.id === resolved) || null;
}

export function isNoVideoFormat(formatOrStructure) {
  const meta = formatMeta(formatOrStructure);
  if (meta) return meta.no_video;
  return ["search_text", "display_static", "carousel_static", "text_search", "static_image", "carousel"].includes(
    formatOrStructure
  );
}

export function canonicalNiche(id) {
  for (const n of NICHES.niches) {
    if (n.id === id || (n.aliases || []).includes(id)) return n.id;
  }
  return id;
}

export function walkCards(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkCards(p, out);
    else if (ent.name.endsWith(".json") && ent.name !== "_schema.json") out.push(p);
  }
  return out;
}

export function loadCards(cardsDir = path.join(ROOT, "study-cards")) {
  return walkCards(cardsDir)
    .map((f) => {
      try {
        return { file: f, card: JSON.parse(fs.readFileSync(f, "utf8")) };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

export function nicheCoverage(nicheId, cards) {
  const niche = canonicalNiche(nicheId);
  const forNiche = cards.filter(
    (c) => c.niche === niche || (c.tags || []).includes(niche)
  );
  const observed = forNiche.filter((c) => c.provenance?.observed === true);
  const formats = [...new Set(observed.map((c) => resolveFormat(c.format)))];
  const noVideo = observed.filter((c) => isNoVideoFormat(c.format) || isNoVideoFormat(c.structure?.format));
  const floor = NICHES.floor;
  const missing = [];
  if (observed.length < floor.min_observed_cards) {
    missing.push(`observed_cards:${observed.length}<${floor.min_observed_cards}`);
  }
  if (formats.length < floor.min_formats) {
    missing.push(`formats:${formats.length}<${floor.min_formats}`);
  }
  if (floor.require_no_video_format && noVideo.length < 1) {
    missing.push("no_video_format:missing");
  }
  const ok = missing.length === 0;
  return {
    niche,
    total_cards: forNiche.length,
    observed_count: observed.length,
    formats,
    format_count: formats.length,
    no_video_count: noVideo.length,
    floor,
    floor_ok: ok,
    missing,
    ceiling: ok
      ? `learning from ${observed.length} real ads across ${formats.length} formats (${formats.join(", ")})`
      : `below floor — ${missing.join("; ")}; structure may be inferred from synthesis only`,
    achieved_rung: ok
      ? "observed_corpus_eligible"
      : observed.length > 0
        ? "observed_partial"
        : "synthesis_only",
  };
}
