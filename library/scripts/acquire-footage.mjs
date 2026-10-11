#!/usr/bin/env node
/**
 * Video-first niche footage acquire — harvest wide, keep narrow, vet hard.
 *
 *   node library/scripts/acquire-footage.mjs --niche home-services
 *   node library/scripts/acquire-footage.mjs --niche home-services --bucket hook_vehicle --keep 3
 *
 * Sources: Coverr (CC0) → Mixkit → Wikimedia Commons video → Pexels/Pixabay when keyed.
 * Pipeline per candidate: download → vet-motion → vet-asset → tag facets → ledger.
 * Stills NEVER enter library/footage/.
 */
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIB = path.join(__dirname, "..");
const ROOT = path.join(LIB, "..");
const LEDGER_PATH = path.join(LIB, "assets/license-ledger.json");
const QA = path.join(__dirname, "qa");

const UA =
  "AdIntelligenceAssetBot/1.0 (+https://github.com/HarrisCrypto/ad-intelligence; footage-acquire; free-motion-only)";

function arg(name, def = null) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : def;
}
function flag(name) {
  return process.argv.includes(name);
}
function die(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}
function slug(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}
async function fetchJson(url, headers = {}) {
  const res = await fetch(url, { headers: { "User-Agent": UA, ...headers } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}
async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (!res.ok) throw new Error(`download ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 50_000) throw new Error(`too_small ${buf.length} ${url}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function loadLedger() {
  return JSON.parse(fs.readFileSync(LEDGER_PATH, "utf8"));
}
function saveLedger(ledger) {
  ledger.updated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2) + "\n");
}
function upsertLedger(entry) {
  const ledger = loadLedger();
  const i = ledger.assets.findIndex((a) => a.id === entry.id);
  if (i >= 0) ledger.assets[i] = entry;
  else ledger.assets.push(entry);
  saveLedger(ledger);
}
function removeLedgerIds(ids) {
  const set = new Set(ids);
  const ledger = loadLedger();
  ledger.assets = ledger.assets.filter((a) => !set.has(a.id));
  saveLedger(ledger);
}

function runVetMotion(abs) {
  const r = spawnSync(process.execPath, [path.join(QA, "vet-motion.mjs"), "--json", abs], {
    encoding: "utf8",
    maxBuffer: 5 * 1024 * 1024,
  });
  try {
    return JSON.parse(r.stdout || "{}");
  } catch {
    return { ok: false, reason: "vet_motion_parse", stderr: r.stderr };
  }
}
function runVetAsset({ abs, niche, bucket, title, query }) {
  const r = spawnSync(
    process.execPath,
    [
      path.join(QA, "vet-asset.mjs"),
      "--file",
      abs,
      "--niche",
      niche,
      "--bucket",
      bucket,
      "--title",
      title || "",
      "--query",
      query || "",
    ],
    { encoding: "utf8", maxBuffer: 5 * 1024 * 1024 }
  );
  try {
    return JSON.parse(r.stdout || "{}");
  } catch {
    return { ok: false, reject: true, reason: "vet_asset_parse", stderr: r.stderr };
  }
}

function phashFrame(abs) {
  const raw = spawnSync(
    "ffmpeg",
    [
      "-v",
      "error",
      "-ss",
      "00:00:01",
      "-i",
      abs,
      "-vf",
      "scale=8:8,format=gray",
      "-frames:v",
      "1",
      "-f",
      "rawvideo",
      "-",
    ],
    { encoding: "buffer" }
  );
  const buf = raw.stdout || Buffer.alloc(0);
  if (buf.length < 64) return null;
  let mean = 0;
  for (let i = 0; i < 64; i++) mean += buf[i];
  mean /= 64;
  let bits = "";
  for (let i = 0; i < 64; i++) bits += buf[i] >= mean ? "1" : "0";
  return crypto.createHash("sha1").update(bits).digest("hex").slice(0, 16);
}

function hammingHex(a, b) {
  if (!a || !b || a.length !== b.length) return 64;
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    const x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    d += x.toString(2).replace(/0/g, "").length;
  }
  return d;
}

async function searchCoverr(query, limit) {
  const html = await fetchText(`https://coverr.co/s?q=${encodeURIComponent(query)}`);
  const urls = [...html.matchAll(/https:\/\/cdn\.coverr\.co\/videos\/([^"'\\s]+)\/360p\.mp4/g)].map(
    (m) => m[1]
  );
  const uniq = [...new Set(urls)].filter((id) => !id.startsWith("user-ai-generation"));
  return uniq.slice(0, limit).map((id) => ({
    source: "coverr",
    id,
    title: id.replace(/^coverr-?(premium-)?/, "").replace(/-/g, " "),
    pageUrl: `https://coverr.co/videos/${id}`,
    // Prefer 1080p download; falls back in download step
    urls: [
      `https://cdn.coverr.co/videos/${id}/1080p.mp4?download=true`,
      `https://cdn.coverr.co/videos/${id}/720p.mp4?download=true`,
      `https://cdn.coverr.co/videos/${id}/360p.mp4`,
    ],
    license: "CC0",
  }));
}

async function searchMixkit(category, limit) {
  const html = await fetchText(`https://mixkit.co/free-stock-video/${encodeURIComponent(category)}/`);
  const ids = [...html.matchAll(/https:\/\/assets\.mixkit\.co\/videos\/(\d+)\/\1-360\.mp4/g)].map(
    (m) => m[1]
  );
  const uniq = [...new Set(ids)];
  return uniq.slice(0, limit).map((id) => ({
    source: "mixkit",
    id,
    title: `mixkit ${category} ${id}`,
    pageUrl: `https://mixkit.co/free-stock-video/`,
    urls: [
      `https://assets.mixkit.co/videos/${id}/${id}-1080.mp4`,
      `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`,
      `https://assets.mixkit.co/videos/${id}/${id}-360.mp4`,
    ],
    license: "Mixkit-License",
  }));
}

async function searchWikimediaVideo(query, limit) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `${query} filetype:video`,
    gsrnamespace: "6",
    gsrlimit: String(Math.min(20, limit * 3)),
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    format: "json",
  });
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  const pages = Object.values(data.query?.pages || {});
  const out = [];
  for (const p of pages) {
    const info = (p.imageinfo || [])[0] || {};
    if (!(info.mime || "").startsWith("video/")) continue;
    const lic = info.extmetadata?.LicenseShortName?.value || "";
    const ok =
      /cc0|public domain|cc by [^n]/i.test(lic) && !/nc|nd/i.test(lic);
    if (!ok) continue;
    out.push({
      source: "wikimedia",
      id: String(p.pageid),
      title: p.title || query,
      pageUrl: info.descriptionurl || info.url,
      urls: [info.url],
      license: lic || "CC BY 4.0",
    });
    if (out.length >= limit) break;
  }
  return out;
}

async function searchPexelsVideo(query, limit) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];
  const data = await fetchJson(
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${limit}`,
    { Authorization: key }
  );
  return (data.videos || []).map((v) => {
    const files = (v.video_files || [])
      .filter((f) => f.file_type === "video/mp4")
      .sort((a, b) => (b.height || 0) - (a.height || 0));
    return {
      source: "pexels",
      id: String(v.id),
      title: v.url,
      pageUrl: v.url,
      urls: files.map((f) => f.link),
      license: "Pexels-License",
    };
  });
}

async function searchPixabayVideo(query, limit) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return [];
  const data = await fetchJson(
    `https://pixabay.com/api/videos/?key=${key}&q=${encodeURIComponent(query)}&per_page=${limit}`
  );
  return (data.hits || []).map((h) => {
    const order = ["large", "medium", "small", "tiny"];
    const urls = [];
    for (const k of order) if (h.videos?.[k]?.url) urls.push(h.videos[k].url);
    return {
      source: "pixabay",
      id: String(h.id),
      title: h.pageURL,
      pageUrl: h.pageURL,
      urls,
      license: "Pixabay-License",
    };
  });
}

async function downloadFirst(urls, dest) {
  let last;
  for (const u of urls) {
    try {
      const bytes = await download(u, dest);
      return { bytes, url: u };
    } catch (e) {
      last = e;
    }
  }
  throw last || new Error("no_urls");
}

function scoreCandidate(motion, asset, abs) {
  let s = 0;
  if (motion.motion === "high") s += 30;
  else if (motion.motion === "medium") s += 20;
  else if (motion.motion === "low") s += 8;
  if (motion.orientation === "portrait") s += 15;
  if ((motion.height || 0) >= 1080) s += 20;
  else if ((motion.height || 0) >= 720) s += 12;
  if (asset.niche_fit === "high") s += 25;
  else if (asset.niche_fit === "med") s += 12;
  if (asset.people === "face" || asset.people === "hands_only") s += 8;
  if ((motion.duration_s || 0) >= 3 && (motion.duration_s || 0) <= 20) s += 5;
  try {
    s += Math.min(10, Math.floor(fs.statSync(abs).size / (500 * 1024)));
  } catch {
    /* ignore */
  }
  return s;
}

async function harvestBucket({ niche, bucket, keep, harvest }) {
  const staging = path.join(ROOT, "library/footage/_staging", niche, bucket.id);
  const destDir = path.join(ROOT, "library/footage", niche);
  fs.mkdirSync(staging, { recursive: true });
  fs.mkdirSync(destDir, { recursive: true });

  const candidates = [];
  const qCoverr = bucket.queries?.coverr || [];
  const qMix = bucket.queries?.mixkit || [];
  const qWiki = bucket.queries?.wikimedia_video || [];
  const qPex = bucket.queries?.pexels || [];

  for (const q of qCoverr.slice(0, 4)) {
    try {
      candidates.push(
        ...(await searchCoverr(q, Math.ceil(harvest / 3))).map((c) => ({ ...c, query: q }))
      );
    } catch (e) {
      console.error("coverr", q, e.message);
    }
  }
  for (const q of qMix.slice(0, 3)) {
    try {
      candidates.push(
        ...(await searchMixkit(q, Math.ceil(harvest / 4))).map((c) => ({ ...c, query: q }))
      );
    } catch (e) {
      console.error("mixkit", q, e.message);
    }
  }
  for (const q of qWiki.slice(0, 2)) {
    try {
      candidates.push(
        ...(await searchWikimediaVideo(q, 4)).map((c) => ({ ...c, query: q }))
      );
    } catch (e) {
      console.error("wiki", q, e.message);
    }
  }
  for (const q of qPex.slice(0, 2)) {
    try {
      candidates.push(...(await searchPexelsVideo(q, 6)).map((c) => ({ ...c, query: q })));
      candidates.push(...(await searchPixabayVideo(q, 6)).map((c) => ({ ...c, query: q })));
    } catch (e) {
      console.error("keyed", q, e.message);
    }
  }

  // Dedupe by source+id
  const seen = new Set();
  const uniq = [];
  for (const c of candidates) {
    const k = `${c.source}:${c.id}`;
    if (seen.has(k)) continue;
    seen.add(k);
    uniq.push(c);
  }
  const harvestList = uniq.slice(0, harvest);

  const passed = [];
  const rejected = [];
  const hashes = [];

  for (const c of harvestList) {
    const tmp = path.join(staging, `${c.source}_${slug(c.id)}.mp4`);
    try {
      await downloadFirst(c.urls, tmp);
    } catch (e) {
      rejected.push({ id: c.id, source: c.source, reason: `download:${e.message}` });
      continue;
    }

    const motion = runVetMotion(tmp);
    if (!motion.ok || !motion.motion_confirmed) {
      rejected.push({
        id: c.id,
        source: c.source,
        reason: motion.reason || "motion_fail",
        reject_classes: motion.reject_classes,
      });
      try {
        fs.unlinkSync(tmp);
      } catch {
        /* ignore */
      }
      continue;
    }

    const subject = runVetAsset({
      abs: tmp,
      niche,
      bucket: bucket.id,
      title: c.title,
      query: c.query,
    });
    if (!subject.ok || subject.reject) {
      rejected.push({
        id: c.id,
        source: c.source,
        reason: "subject_fail",
        reject_classes: subject.reject_classes,
        niche_fit: subject.niche_fit,
      });
      try {
        fs.unlinkSync(tmp);
      } catch {
        /* ignore */
      }
      continue;
    }

    const hash = phashFrame(tmp);
    if (hash && hashes.some((h) => hammingHex(h, hash) <= 6)) {
      rejected.push({ id: c.id, source: c.source, reason: "duplicate", reject_classes: ["duplicate"] });
      try {
        fs.unlinkSync(tmp);
      } catch {
        /* ignore */
      }
      continue;
    }
    if (hash) hashes.push(hash);

    const score = scoreCandidate(motion, subject, tmp);
    passed.push({ c, tmp, motion, subject, hash, score });
  }

  passed.sort((a, b) => b.score - a.score);
  const keepers = passed.slice(0, keep);
  const kept = [];

  for (const p of keepers) {
    const id = `vid_${niche.replace(/-/g, "")}_${bucket.id}_${p.c.source}_${slug(p.c.id)}`.slice(
      0,
      80
    );
    const rel = `library/footage/${niche}/${id}.mp4`;
    const abs = path.join(ROOT, rel);
    fs.renameSync(p.tmp, abs);
    const entry = {
      id,
      path: rel,
      kind: "video",
      media: "video",
      bucket: bucket.id,
      subject: p.subject.subject || bucket.subject,
      shot_type: p.subject.shot_type || bucket.shot_type || [],
      motion: p.motion.motion,
      motion_confirmed: true,
      must_depict: bucket.must_depict,
      depicts_verified: p.subject.depicts_verified,
      people: p.subject.people || "unknown",
      niche_fit: p.subject.niche_fit,
      orientation: p.motion.orientation,
      reject: false,
      reject_classes: [],
      license: p.c.license,
      attribution: `${p.c.title} — via ${p.c.source} (${p.c.license}). ${p.c.pageUrl}`,
      source_url: p.c.pageUrl,
      source: p.c.source,
      allowed_use: ["commercial", "paid_social", "organic"],
      niches: [niche],
      tags: [bucket.id, bucket.priority, p.c.source, "video", "motion_confirmed"],
      phash: p.hash,
      width: p.motion.width,
      height: p.motion.height,
      duration_s: p.motion.duration_s,
      query: p.c.query,
      select_why: `score=${p.score}; motion=${p.motion.motion}; fit=${p.subject.niche_fit}; ${p.motion.orientation}`,
      verified_via: "agent_runtime",
    };
    upsertLedger(entry);
    kept.push(entry);
  }

  // Cleanup staging leftovers
  for (const p of passed.slice(keep)) {
    try {
      fs.unlinkSync(p.tmp);
    } catch {
      /* ignore */
    }
  }

  return {
    bucket: bucket.id,
    priority: bucket.priority,
    harvested: harvestList.length,
    passed: passed.length,
    kept: kept.length,
    kept_ids: kept.map((k) => k.id),
    rejected: rejected.length,
    reject_sample: rejected.slice(0, 8),
    gap: kept.length < (bucket.priority === "P0" ? 1 : 1),
  };
}

async function purgeLegacyStills(niche) {
  const dir = path.join(ROOT, "library/footage", niche);
  const stillDir = path.join(ROOT, "library/stills", niche);
  fs.mkdirSync(stillDir, { recursive: true });
  const REJECT_IDS = new Set([
    "ft_hvac-bay_5986482", // refrigeration diagram
    "ft_owner-ugc_119788762", // Swedish fruit market
    "ft_work-van_26730610", // plain white car
    "ft_work-van_40739440", // plain white car
  ]);
  const removed = [];
  const retagged = [];
  if (!fs.existsSync(dir)) return { removed, retagged };

  const ledger = loadLedger();
  const next = [];
  for (const a of ledger.assets) {
    if (!a.path?.includes(`library/footage/${niche}/`)) {
      next.push(a);
      continue;
    }
    const abs = path.join(ROOT, a.path);
    if (REJECT_IDS.has(a.id) || /\.(jpe?g|png|webp)$/i.test(a.path)) {
      if (REJECT_IDS.has(a.id)) {
        if (fs.existsSync(abs)) fs.unlinkSync(abs);
        removed.push(a.id);
        continue;
      }
      // Move remaining stills out of footage/ — never eligible for footage slots
      if (fs.existsSync(abs)) {
        const dest = path.join(stillDir, path.basename(a.path));
        fs.renameSync(abs, dest);
        a.path = `library/stills/${niche}/${path.basename(a.path)}`;
      }
      a.kind = "still";
      a.media = "still";
      a.reject = true;
      a.reject_classes = ["still_in_footage_slot"];
      a.motion_confirmed = false;
      a.motion = "none";
      a.niche_fit = "low";
      a.tags = [...new Set([...(a.tags || []), "still", "i2v_seed_only"])];
      retagged.push(a.id);
      next.push(a);
      continue;
    }
    next.push(a);
  }
  ledger.assets = next;
  saveLedger(ledger);
  return { removed, retagged };
}

async function main() {
  const niche = arg("--niche", "home-services");
  const onlyBucket = arg("--bucket");
  const dry = flag("--dry-run");
  const skipPurge = flag("--skip-purge");
  const bucketsFile = path.join(LIB, "footage/buckets", `${niche}.json`);
  if (!fs.existsSync(bucketsFile)) die(`No bucket def: ${bucketsFile}`);
  const def = JSON.parse(fs.readFileSync(bucketsFile, "utf8"));
  const keep = Number(arg("--keep", String(def.keep_per_bucket?.min || 3)));
  const harvest = Number(
    arg("--harvest", String(def.harvest_candidates_per_bucket || 16))
  );

  let purge = { removed: [], retagged: [] };
  if (!skipPurge && !dry) purge = await purgeLegacyStills(niche);

  const buckets = (def.buckets || []).filter((b) => !onlyBucket || b.id === onlyBucket);
  const reports = [];
  for (const bucket of buckets) {
    if (dry) {
      reports.push({ bucket: bucket.id, dry: true, queries: bucket.queries });
      continue;
    }
    console.error(`… harvesting ${niche}/${bucket.id} (harvest=${harvest}, keep=${keep})`);
    reports.push(await harvestBucket({ niche, bucket, keep, harvest }));
  }

  // Gap report via select
  const select = spawnSync(
    process.execPath,
    [path.join(__dirname, "select-footage.mjs"), "--niche", niche, "--report"],
    { encoding: "utf8" }
  );
  let selection = {};
  try {
    selection = JSON.parse(select.stdout || "{}");
  } catch {
    selection = { parse_error: true, raw: select.stdout };
  }

  console.log(
    JSON.stringify(
      {
        ok: reports.every((r) => !r.gap || r.kept > 0),
        niche,
        purge,
        buckets: reports,
        selection,
        rule: "Stills never fill footage slots. Gaps downgrade ceiling — never substitute.",
        next: [
          `node library/scripts/assert-assets.mjs --niche ${niche} --strict-footage`,
          `node library/scripts/select-footage.mjs --niche ${niche} --bucket hook_vehicle`,
        ],
      },
      null,
      2
    )
  );
}

main().catch((e) => die(String(e.stack || e)));
