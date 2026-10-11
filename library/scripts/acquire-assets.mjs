#!/usr/bin/env node
/**
 * Free-first asset acquisition → library/footage|sound + license ledger.
 *
 *   node library/scripts/acquire-assets.mjs --source wikimedia --query "HVAC technician" --tag hvac-tech
 *   PEXELS_API_KEY=… node library/scripts/acquire-assets.mjs --source pexels --query "phone desk" --tag desk-phone
 *   PIXABAY_API_KEY=… node library/scripts/acquire-assets.mjs --source pixabay --query "work van" --tag van
 *
 * Safe by default: Public domain / CC0 / CC BY only (Wikimedia). Ledger required.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIB = path.join(__dirname, "..");
const ROOT = path.join(LIB, "..");
const LEDGER_PATH = path.join(LIB, "assets/license-ledger.json");
const SOURCES = JSON.parse(
  fs.readFileSync(path.join(LIB, "assets/sources.json"), "utf8")
);

const UA =
  "AdIntelligenceAssetBot/1.0 (+https://github.com/HarrisCrypto/ad-intelligence; asset-acquire; safe-license-only)";

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

function licenseOk(lic, { allowSa = false } = {}) {
  const allow = new Set(SOURCES.license_allowlist.map((x) => x.toLowerCase()));
  const caution = new Set(SOURCES.license_caution.map((x) => x.toLowerCase()));
  const n = String(lic || "").toLowerCase();
  if (allow.has(n)) return true;
  if (n.includes("public domain") || n.includes("cc0") || n.startsWith("cc by ")) {
    if (n.includes("sa") && !allowSa) return false;
    if (n.includes("nc") || n.includes("nd")) return false;
    return !n.includes("sa") || allowSa;
  }
  if (allowSa && caution.has(n)) return true;
  return false;
}

function trademarkRisky(title = "") {
  return /\b(amazon|fedex|ups|usps|walmart|mcdonald|coca-?cola|apple logo)\b/i.test(
    title
  );
}

async function fetchJson(url, headers = {}) {
  const res = await fetch(url, { headers: { "User-Agent": UA, ...headers } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function loadLedger() {
  return JSON.parse(fs.readFileSync(LEDGER_PATH, "utf8"));
}
function saveLedger(ledger) {
  fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2) + "\n");
}
function upsertLedger(entry) {
  const ledger = loadLedger();
  const i = ledger.assets.findIndex((a) => a.id === entry.id);
  if (i >= 0) ledger.assets[i] = entry;
  else ledger.assets.push(entry);
  ledger.updated = new Date().toISOString().slice(0, 10);
  saveLedger(ledger);
}

async function acquireWikimedia({ query, tag, niche, limit, allowSa, video }) {
  if (video) {
    die(
      "Wikimedia stills path refuses --video. Use: node library/scripts/acquire-footage.mjs --niche " +
        (niche || "home-services")
    );
  }
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: String(Math.min(20, limit * 4)),
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "1280",
    format: "json",
  });
  const data = await fetchJson(
    `https://commons.wikimedia.org/w/api.php?${params}`
  );
  const pages = Object.values(data.query?.pages || {});
  const picked = [];
  for (const p of pages) {
    if (picked.length >= limit) break;
    const info = (p.imageinfo || [])[0] || {};
    const meta = info.extmetadata || {};
    const lic = meta.LicenseShortName?.value || "";
    const mime = info.mime || "";
    if (!mime.startsWith("image/")) continue;
    if (!licenseOk(lic, { allowSa })) continue;
    if (trademarkRisky(p.title || "")) continue;
    const url = info.thumburl || info.url;
    if (!url) continue;
    const id = `ft_${slug(tag || query)}_${p.pageid}`;
    const ext = mime.includes("png") ? "png" : "jpg";
    // Stills never enter library/footage/ — i2v seeds only
    const rel = `library/stills/${niche || "general"}/${id}.${ext}`;
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs)) {
      picked.push({ id, path: rel, skipped: "exists" });
      continue;
    }
    const bytes = await download(url, abs);
    const artist = String(meta.Artist?.value || "Wikimedia Commons")
      .replace(/<[^>]+>/g, "")
      .slice(0, 120);
    const entry = {
      id,
      path: rel,
      kind: "still",
      media: "still",
      motion: "none",
      motion_confirmed: false,
      reject: true,
      reject_classes: ["still_in_footage_slot"],
      niche_fit: "low",
      license: lic,
      attribution: `${p.title} — ${artist} (${lic}). Via Wikimedia Commons.`,
      source_url: info.descriptionurl || url,
      allowed_use: ["commercial", "paid_social", "organic"],
      niches: niche ? [niche] : [],
      tags: [tag || slug(query), "wikimedia", "still", "i2v_seed_only"],
      bytes,
      width: info.thumbwidth || info.width,
      height: info.thumbheight || info.height,
      verified_via: "agent_runtime",
      query,
    };
    upsertLedger(entry);
    picked.push(entry);
  }
  return picked;
}

async function acquirePexels({ query, tag, niche, limit, video }) {
  if (!video) {
    die(
      "Footage acquisition requires --video (stills are never eligible for footage slots). Prefer: node library/scripts/acquire-footage.mjs --niche " +
        (niche || "home-services")
    );
  }
  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    die(
      "PEXELS_API_KEY not set. Get a free key at https://www.pexels.com/api/ — or use acquire-footage.mjs (Coverr/Mixkit)"
    );
  }
  const endpoint = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${limit}`;
  const data = await fetchJson(endpoint, { Authorization: key });
  const items = data.videos || [];
  const picked = [];
  for (const item of items.slice(0, limit)) {
    const file = (item.video_files || [])
      .filter((f) => f.file_type === "video/mp4")
      .sort((a, b) => (b.height || 0) - (a.height || 0))[0];
    if (!file) continue;
    const url = file.link;
    const w = file.width;
    const h = file.height;
    const photographer = item.user?.name || "Pexels";
    const pageUrl = item.url;
    const id = `vid_pexels_${item.id}_${slug(tag || query)}`;
    const rel = `library/footage/${niche || "general"}/${id}.mp4`;
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) await download(url, abs);
    // Hard gates
    const motion = JSON.parse(
      spawnSync(
        process.execPath,
        [path.join(__dirname, "qa/vet-motion.mjs"), "--json", abs],
        { encoding: "utf8" }
      ).stdout || "{}"
    );
    if (!motion.ok) {
      try {
        fs.unlinkSync(abs);
      } catch {
        /* ignore */
      }
      continue;
    }
    const entry = {
      id,
      path: rel,
      kind: "video",
      media: "video",
      motion: motion.motion,
      motion_confirmed: true,
      reject: false,
      reject_classes: [],
      orientation: motion.orientation,
      license: "Pexels-License",
      attribution: `${photographer} — via Pexels (${pageUrl})`,
      source_url: pageUrl,
      source: "pexels",
      allowed_use: ["commercial", "paid_social", "organic"],
      niches: niche ? [niche] : [],
      tags: [tag || slug(query), "pexels", "video", "motion_confirmed"],
      width: w,
      height: h,
      duration_s: motion.duration_s,
      verified_via: "agent_runtime",
      query,
    };
    upsertLedger(entry);
    picked.push(entry);
  }
  return picked;
}

async function acquirePixabay({ query, tag, niche, limit, video }) {
  if (!video) {
    die(
      "Footage acquisition requires --video. Prefer: node library/scripts/acquire-footage.mjs --niche " +
        (niche || "home-services")
    );
  }
  const key = process.env.PIXABAY_API_KEY;
  if (!key) {
    die(
      "PIXABAY_API_KEY not set. Free key: https://pixabay.com/api/docs/ — or acquire-footage.mjs"
    );
  }
  const url = `https://pixabay.com/api/videos/?key=${key}&q=${encodeURIComponent(query)}&per_page=${limit}`;
  const data = await fetchJson(url);
  const hits = data.hits || [];
  const picked = [];
  for (const hit of hits.slice(0, limit)) {
    const v = hit.videos?.large || hit.videos?.medium || hit.videos?.small;
    if (!v?.url) continue;
    const fileUrl = v.url;
    const w = v.width;
    const h = v.height;
    const id = `vid_pixabay_${hit.id}_${slug(tag || query)}`;
    const rel = `library/footage/${niche || "general"}/${id}.mp4`;
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) await download(fileUrl, abs);
    const motion = JSON.parse(
      spawnSync(
        process.execPath,
        [path.join(__dirname, "qa/vet-motion.mjs"), "--json", abs],
        { encoding: "utf8" }
      ).stdout || "{}"
    );
    if (!motion.ok) {
      try {
        fs.unlinkSync(abs);
      } catch {
        /* ignore */
      }
      continue;
    }
    const entry = {
      id,
      path: rel,
      kind: "video",
      media: "video",
      motion: motion.motion,
      motion_confirmed: true,
      reject: false,
      reject_classes: [],
      orientation: motion.orientation,
      license: "Pixabay-License",
      attribution: `Pixabay #${hit.id} — ${hit.user || "contributor"} (${hit.pageURL})`,
      source_url: hit.pageURL,
      source: "pixabay",
      allowed_use: ["commercial", "paid_social", "organic"],
      niches: niche ? [niche] : [],
      tags: [tag || slug(query), "pixabay", "video", "motion_confirmed"],
      width: w,
      height: h,
      duration_s: motion.duration_s,
      verified_via: "agent_runtime",
      query,
    };
    upsertLedger(entry);
    picked.push(entry);
  }
  return picked;
}

async function acquireGithub({ repo, repoPath, license, tag, niche }) {
  if (!repo) die("--repo owner/name required for --source github");
  const api = `https://api.github.com/repos/${repo}/contents/${repoPath || ""}`;
  const data = await fetchJson(api, {
    Accept: "application/vnd.github+json",
  });
  const files = Array.isArray(data) ? data : [data];
  const picked = [];
  for (const f of files) {
    if (f.type !== "file") continue;
    if (!/\.(png|jpe?g|webp|mp3|wav|mp4|webm)$/i.test(f.name)) continue;
    const id = `gh_${slug(repo)}_${slug(f.name)}`;
    const rel = `library/footage/${niche || "general"}/${id}${path.extname(f.name)}`;
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) await download(f.download_url, abs);
    const entry = {
      id,
      path: rel,
      kind: /\.(mp3|wav)$/i.test(f.name) ? "sfx" : "footage",
      license: license || "SEE-REPO-LICENSE",
      attribution: `${repo} / ${f.path} — verify LICENSE in repo`,
      source_url: f.html_url || f.download_url,
      allowed_use: ["commercial", "organic"],
      niches: niche ? [niche] : [],
      tags: [tag || "github", "github-pack"],
      verified_via: "agent_runtime",
    };
    upsertLedger(entry);
    picked.push(entry);
  }
  return picked;
}

async function main() {
  const source = arg("--source", "wikimedia");
  const query = arg("--query");
  const tag = arg("--tag", query ? slug(query) : "asset");
  const niche = arg("--niche", "home-services");
  const limit = Number(arg("--limit", "2"));
  const allowSa = flag("--allow-sa");
  // Video is the default for footage-capable sources; --still opt-in for i2v seeds only
  const still = flag("--still");
  const video = flag("--video") || (!still && (source === "pexels" || source === "pixabay"));
  const repo = arg("--repo");
  const repoPath = arg("--path", "");
  const license = arg("--license", "CC0");

  if (!query && source !== "github") {
    die(
      "Usage: acquire-assets.mjs --source wikimedia|pexels|pixabay|github --query \"…\" [--tag t] [--niche home-services] [--limit 2] [--video|--still]\n" +
        "Prefer acquire-footage.mjs for niche bucket coverage (Coverr/Mixkit + motion/subject gates)."
    );
  }

  let picked = [];
  if (source === "wikimedia") {
    picked = await acquireWikimedia({ query, tag, niche, limit, allowSa, video: false });
  } else if (source === "pexels") {
    picked = await acquirePexels({ query, tag, niche, limit, video: true });
  } else if (source === "pixabay") {
    picked = await acquirePixabay({ query, tag, niche, limit, video: true });
  } else if (source === "github") {
    picked = await acquireGithub({ repo, repoPath, license, tag, niche });
  } else {
    die(`Unknown source: ${source}. See library/assets/sources.json`);
  }

  console.log(
    JSON.stringify(
      {
        ok: picked.length > 0,
        source,
        query,
        niche,
        video: source === "wikimedia" ? false : true,
        count: picked.length,
        assets: picked.map((a) => ({
          id: a.id,
          path: a.path,
          kind: a.kind,
          license: a.license,
          motion_confirmed: a.motion_confirmed,
          tags: a.tags,
        })),
        next: [
          "node library/scripts/acquire-footage.mjs --niche " + niche,
          "node library/scripts/select-footage.mjs --niche " + niche + " --report",
          "node library/scripts/asset-gap-report.mjs --niche " + niche,
        ],
        rule: "Stills never fill footage slots. Use acquire-footage.mjs for bucket coverage.",
      },
      null,
      2
    )
  );
  process.exit(picked.length ? 0 : 2);
}

main().catch((e) => die(String(e.stack || e)));
