#!/usr/bin/env node
/**
 * Download archive.org / Prelinger media into private-cache as FOOTAGE only.
 *
 * Hard rule: archive.org is NOT an ad library. Cards written here get
 * provenance.reference_ok=false and never count toward video_coverage or
 * pacing patterns. Prefer GAT / Meta / TikTok for reference ads.
 *
 *   node classroom/ingest/fetch-archive-videos.mjs --niche home-services --confirm
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";
import http from "node:http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const SEEDS = JSON.parse(fs.readFileSync(path.join(__dirname, "seeds.json"), "utf8"));
const CACHE = path.join(ROOT, "classroom/private-cache/archive-video");
fs.mkdirSync(CACHE, { recursive: true });

function arg(n, d = null) {
  const i = process.argv.indexOf(n);
  return i >= 0 ? process.argv[i + 1] : d;
}

const onlyNiche = arg("--niche");
const autoConfirm = process.argv.includes("--confirm");
const floor = Number(arg("--floor", String(SEEDS.video_floor_per_niche || 5)));

function getJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(d));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        try {
          fs.unlinkSync(dest);
        } catch {}
        return download(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve(dest)));
    });
    req.on("error", reject);
  });
}

async function resolveMp4(itemId, preferred) {
  const meta = await getJson(`https://archive.org/metadata/${itemId}`);
  const files = (meta.files || []).filter((f) => /\.mp4$/i.test(f.name));
  if (!files.length) return null;
  let pick = preferred ? files.find((f) => f.name === preferred) : null;
  if (!pick) pick = files.find((f) => /512kb/i.test(f.name));
  if (!pick) {
    pick = files
      .filter((f) => Number(f.size) > 400000 && Number(f.size) < 25_000_000)
      .sort((a, b) => Number(a.size) - Number(b.size))[0];
  }
  if (!pick) pick = files.sort((a, b) => Number(a.size) - Number(b.size))[0];
  return {
    url: `https://archive.org/download/${itemId}/${pick.name}`,
    name: pick.name,
    size: Number(pick.size),
  };
}

function ingest(file, niche, id, sourceId) {
  const r = spawnSync(
    process.execPath,
    [
      path.join(ROOT, "classroom/ingest/ingest-ad.mjs"),
      file,
      "--niche",
      niche,
      "--id",
      id,
      "--format",
      "polished_video",
      "--platform",
      "archive.org",
      "--source-id",
      sourceId,
      "--rights",
      "annotation-only",
    ],
    { encoding: "utf8", cwd: ROOT, maxBuffer: 20 * 1024 * 1024 }
  );
  let j = {};
  try {
    j = JSON.parse(r.stdout || "{}");
  } catch {
    j = { err: r.stderr };
  }
  if (r.status !== 0) return { ok: false, ...j, stderr: r.stderr };
  if (autoConfirm && j.out) {
    const conf = spawnSync(
      process.execPath,
      [
        path.join(ROOT, "classroom/ingest/ingest-ad.mjs"),
        "--confirm",
        j.out,
        "--why",
        `Measured public commercial from archive.org/Prelinger (${sourceId}). Real audio+cuts; study assembly only.`,
        "--steal",
        "Cut rhythm from measured stats|Offer/endcard framing|Never copy marks or claims",
      ],
      { encoding: "utf8", cwd: ROOT }
    );
    if (conf.status !== 0) return { ok: false, error: "confirm_failed", stderr: conf.stderr };
  }
  return { ok: true, ...j };
}

async function main() {
  const log = {
    started: new Date().toISOString(),
    niches: {},
    footage: [],
    errors: [],
    note: "archive.org = footage only; never counts toward video_coverage",
  };
  const niches = onlyNiche
    ? { [onlyNiche]: SEEDS.niches[onlyNiche] }
    : SEEDS.niches;

  for (const [nid, conf] of Object.entries(niches || {})) {
    if (!conf) continue;
    log.niches[nid] = { attempted: 0, footage: 0 };
    const list = (conf.archive_video || []).filter((x) => !x.skip);
    for (const item of list) {
      if (log.niches[nid].footage >= floor) break;
      log.niches[nid].attempted++;
      try {
        const resolved = await resolveMp4(item.id, item.file);
        if (!resolved) {
          log.errors.push({ niche: nid, id: item.id, error: "no_mp4" });
          continue;
        }
        const maxMb = item.max_mb || 15;
        if (resolved.size > maxMb * 1024 * 1024) {
          log.errors.push({ niche: nid, id: item.id, error: "too_large", size: resolved.size, maxMb });
          continue;
        }
        const dest = path.join(CACHE, `${nid}_${item.id}.mp4`);
        if (!fs.existsSync(dest) || fs.statSync(dest).size < 100000) {
          console.error("DL", item.id);
          await download(resolved.url, dest);
        }
        const probe = spawnSync(
          "ffprobe",
          ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dest],
          { encoding: "utf8" }
        );
        if (probe.status !== 0 || !Number(probe.stdout)) {
          log.errors.push({ niche: nid, id: item.id, error: "not_video" });
          continue;
        }
        const cardId = `arc_${nid.replace(/-/g, "")}_${item.id}`
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "")
          .slice(0, 60);
        const r = ingest(dest, nid, cardId, `archive.org:${item.id}`);
        const cardPath = path.join(ROOT, "classroom/study-cards", nid, `${cardId}.json`);
        if (r.ok && fs.existsSync(cardPath)) {
          const card = JSON.parse(fs.readFileSync(cardPath, "utf8"));
          // Footage cache only — never reference_ok (substance gate).
          if (card.provenance?.reference_ok) {
            log.errors.push({
              niche: nid,
              id: item.id,
              error: "archive_must_not_be_reference",
            });
          } else if (card.provenance?.observed) {
            log.niches[nid].footage++;
            log.footage.push({
              niche: nid,
              id: cardId,
              source: item.id,
              lufs: card.audio?.loudness_lufs,
              reference_ok: false,
              reason: card.provenance?.reference_blocked_reason,
            });
          } else {
            log.errors.push({
              niche: nid,
              id: item.id,
              error: "honesty_blocked",
              reason: card.provenance?.observed_blocked_reason,
            });
          }
        } else {
          log.errors.push({ niche: nid, id: item.id, error: "ingest_failed", detail: r.stderr || r });
        }
      } catch (e) {
        log.errors.push({ niche: nid, id: item.id, error: String(e.message || e) });
      }
    }
  }

  log.finished = new Date().toISOString();
  const logPath = path.join(ROOT, "classroom/ingest/logs/last-archive-video.json");
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  console.log(
    JSON.stringify(
      {
        ok: true,
        log: logPath,
        niches: log.niches,
        footage: log.footage.length,
        reference_valid: 0,
        errors: log.errors.length,
        rule: "archive.org footage never satisfies video_coverage",
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
