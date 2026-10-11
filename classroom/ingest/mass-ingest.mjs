#!/usr/bin/env node
/**
 * Batch ingest from enumerate-latest.json (or --from path).
 * Fetches already snapshotted media in private-cache → ingest-ad.mjs → confirm drafts.
 *
 *   node classroom/ingest/mass-ingest.mjs
 *   node classroom/ingest/mass-ingest.mjs --from classroom/private-cache/enumerate-latest.json --limit 25
 *
 * Writes run log to classroom/private-cache/mass-ingest-log-<ts>.json and
 * classroom/ingest/logs/last-mass-ingest.json (annotations only).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");

function arg(n, d = null) {
  const i = process.argv.indexOf(n);
  return i >= 0 ? process.argv[i + 1] : d;
}

const from =
  arg("--from") ||
  path.join(ROOT, "classroom/private-cache/enumerate-latest.json");
const limit = Number(arg("--limit", "40"));
const autoConfirm = process.argv.includes("--confirm");

if (!fs.existsSync(from)) {
  console.error(`Missing enumerate file: ${from}. Run enumerate-ads.mjs first.`);
  process.exit(1);
}

const enumData = JSON.parse(fs.readFileSync(from, "utf8"));
const creatives = (enumData.creatives || []).slice(0, limit);

const log = {
  started: new Date().toISOString(),
  source: "google_ads_transparency",
  from,
  attempted: 0,
  accepted: 0,
  rejected: 0,
  by_niche: {},
  by_format: {},
  cards: [],
  errors: [],
};

function parseTextFromPage(pageText, cr) {
  const lines = String(pageText || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  // Heuristic: pick short lines as headlines
  const headlines = lines
    .filter((l) => l.length >= 8 && l.length <= 40 && !/^(Ad|Sponsored|About|See)/i.test(l))
    .slice(0, 3);
  const descriptions = lines
    .filter((l) => l.length > 40 && l.length < 120)
    .slice(0, 2);
  if (!headlines.length && lines[0]) headlines.push(lines[0].slice(0, 40));
  const rsa = {
    platform: "google",
    url_or_library_id: `google:${cr}`,
    headlines: headlines.length ? headlines : [`Ad ${cr}`],
    descriptions: descriptions.length ? descriptions : ["See advertiser creative in Ads Transparency."],
    cta: "learn more",
    offer: headlines[0] || cr,
    proof: "[PLACEHOLDER]",
  };
  const p = path.join(ROOT, "classroom/private-cache", `${cr}-rsa.json`);
  fs.writeFileSync(p, JSON.stringify(rsa, null, 2));
  return p;
}

for (const c of creatives) {
  log.attempted++;
  const niche = c.niche || "home-services";
  const id = `gat_${(c.creative || "x").toLowerCase()}`;
  const formatGuess = c.format_guess || "static_image";
  let format = formatGuess;
  if (format === "text") format = "text_search";
  if (format === "image") format = "static_image";
  if (format === "video") format = "ugc_video";

  try {
    let r;
    const media = c.media_path;
    const isVideo =
      media &&
      /\.(mp4|mov|webm)$/i.test(media) &&
      fs.existsSync(media);
    const isImage =
      media &&
      /\.(png|jpg|jpeg|webp)$/i.test(media) &&
      fs.existsSync(media);

    if (format === "text_search" || (!isVideo && !isImage)) {
      const rsaPath = parseTextFromPage(c.page_text, c.creative);
      r = spawnSync(
        process.execPath,
        [
          path.join(ROOT, "classroom/ingest/ingest-ad.mjs"),
          "--text-ad",
          rsaPath,
          "--niche",
          niche,
          "--id",
          id,
          "--format",
          "text_search",
          "--platform",
          "google",
          "--source-id",
          c.url || `google:${c.advertiser}/${c.creative}`,
          "--rights",
          "annotation-only",
        ],
        { encoding: "utf8", cwd: ROOT, maxBuffer: 10 * 1024 * 1024 }
      );
      format = "text_search";
    } else {
      r = spawnSync(
        process.execPath,
        [
          path.join(ROOT, "classroom/ingest/ingest-ad.mjs"),
          media,
          "--niche",
          niche,
          "--id",
          id,
          "--format",
          isVideo ? "ugc_video" : "static_image",
          "--platform",
          "google",
          "--source-id",
          c.url || `google:${c.advertiser}/${c.creative}`,
          "--rights",
          "annotation-only",
        ],
        { encoding: "utf8", cwd: ROOT, maxBuffer: 10 * 1024 * 1024 }
      );
      format = isVideo ? "ugc_video" : "static_image";
    }

    let j = {};
    try {
      j = JSON.parse(r.stdout || "{}");
    } catch {
      j = { raw: r.stdout, err: r.stderr };
    }
    if (r.status !== 0) {
      log.rejected++;
      log.errors.push({ id, error: r.stderr || j });
      continue;
    }

    // Load card — only count if observed:true survived honesty
    const cardPath = j.out;
    const card = JSON.parse(fs.readFileSync(cardPath, "utf8"));
    if (!card.provenance?.observed) {
      log.rejected++;
      log.errors.push({
        id,
        error: "honesty_blocked",
        reason: card.provenance?.observed_blocked_reason,
      });
      continue;
    }

    if (autoConfirm) {
      const why = `Measured from Google Ads Transparency creative ${c.creative} (${c.domain || ""}). Stats from ingest tooling; emulate structure only.`;
      const conf = spawnSync(
        process.execPath,
        [
          path.join(ROOT, "classroom/ingest/ingest-ad.mjs"),
          "--confirm",
          cardPath,
          "--why",
          why,
          "--steal",
          "Structure/pacing/copy pattern only|Never copy pixels or trademarks",
        ],
        { encoding: "utf8", cwd: ROOT }
      );
      if (conf.status !== 0) {
        log.errors.push({ id, error: "confirm_failed", detail: conf.stderr });
      }
    }

    log.accepted++;
    log.by_niche[niche] = (log.by_niche[niche] || 0) + 1;
    log.by_format[format] = (log.by_format[format] || 0) + 1;
    log.cards.push({
      id,
      niche,
      format,
      creative: c.creative,
      advertiser: c.advertiser,
      url: c.url,
      observed: true,
    });
  } catch (e) {
    log.rejected++;
    log.errors.push({ id, error: String(e.message || e) });
  }
}

log.finished = new Date().toISOString();
const logDir = path.join(ROOT, "classroom/ingest/logs");
fs.mkdirSync(logDir, { recursive: true });
const logPath = path.join(logDir, "last-mass-ingest.json");
fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
const priv = path.join(
  ROOT,
  "classroom/private-cache",
  `mass-ingest-log-${Date.now()}.json`
);
fs.writeFileSync(priv, JSON.stringify(log, null, 2));
console.log(JSON.stringify({ ok: true, log: logPath, summary: {
  attempted: log.attempted,
  accepted: log.accepted,
  rejected: log.rejected,
  by_niche: log.by_niche,
  by_format: log.by_format,
} }, null, 2));
