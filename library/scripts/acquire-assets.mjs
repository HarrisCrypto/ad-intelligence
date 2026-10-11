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

async function acquireWikimedia({ query, tag, niche, limit, allowSa }) {
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
    const rel = `library/footage/${niche || "general"}/${id}.${ext}`;
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
      kind: "footage",
      media: "still",
      license: lic,
      attribution: `${p.title} — ${artist} (${lic}). Via Wikimedia Commons.`,
      source_url: info.descriptionurl || url,
      allowed_use: ["commercial", "paid_social", "organic"],
      niches: niche ? [niche] : [],
      tags: [tag || slug(query), "wikimedia", "still"],
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
  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    die(
      "PEXELS_API_KEY not set. Get a free key at https://www.pexels.com/api/ — or use --source wikimedia"
    );
  }
  const endpoint = video
    ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${limit}`
    : `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${limit}`;
  const data = await fetchJson(endpoint, { Authorization: key });
  const items = video ? data.videos || [] : data.photos || [];
  const picked = [];
  for (const item of items.slice(0, limit)) {
    let url, w, h, ext, photographer, pageUrl;
    if (video) {
      const file = (item.video_files || [])
        .filter((f) => f.file_type === "video/mp4")
        .sort((a, b) => (b.height || 0) - (a.height || 0))[0];
      if (!file) continue;
      url = file.link;
      w = file.width;
      h = file.height;
      ext = "mp4";
      photographer = item.user?.name || "Pexels";
      pageUrl = item.url;
    } else {
      url = item.src?.large2x || item.src?.large || item.src?.original;
      w = item.width;
      h = item.height;
      ext = "jpg";
      photographer = item.photographer;
      pageUrl = item.url;
    }
    const id = `ft_pexels_${item.id}_${slug(tag || query)}`;
    const rel = `library/footage/${niche || "general"}/${id}.${ext}`;
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) await download(url, abs);
    const entry = {
      id,
      path: rel,
      kind: "footage",
      media: video ? "video" : "still",
      license: "Pexels-License",
      attribution: `${photographer} — via Pexels (${pageUrl})`,
      source_url: pageUrl,
      allowed_use: ["commercial", "paid_social", "organic"],
      niches: niche ? [niche] : [],
      tags: [tag || slug(query), "pexels", video ? "video" : "still"],
      width: w,
      height: h,
      verified_via: "agent_runtime",
      query,
    };
    upsertLedger(entry);
    picked.push(entry);
  }
  return picked;
}

async function acquirePixabay({ query, tag, niche, limit, video }) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) {
    die(
      "PIXABAY_API_KEY not set. Free key: https://pixabay.com/api/docs/ — or --source wikimedia"
    );
  }
  const base = video
    ? "https://pixabay.com/api/videos/"
    : "https://pixabay.com/api/";
  const url = `${base}?key=${key}&q=${encodeURIComponent(query)}&per_page=${limit}`;
  const data = await fetchJson(url);
  const hits = data.hits || [];
  const picked = [];
  for (const hit of hits.slice(0, limit)) {
    let fileUrl, ext, w, h;
    if (video) {
      const v = hit.videos?.medium || hit.videos?.small || hit.videos?.tiny;
      if (!v?.url) continue;
      fileUrl = v.url;
      ext = "mp4";
      w = v.width;
      h = v.height;
    } else {
      fileUrl = hit.largeImageURL || hit.webformatURL;
      ext = "jpg";
      w = hit.imageWidth;
      h = hit.imageHeight;
    }
    const id = `ft_pixabay_${hit.id}_${slug(tag || query)}`;
    const rel = `library/footage/${niche || "general"}/${id}.${ext}`;
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) await download(fileUrl, abs);
    const entry = {
      id,
      path: rel,
      kind: "footage",
      media: video ? "video" : "still",
      license: "Pixabay-License",
      attribution: `Pixabay #${hit.id} — ${hit.user || "contributor"} (${hit.pageURL})`,
      source_url: hit.pageURL,
      allowed_use: ["commercial", "paid_social", "organic"],
      niches: niche ? [niche] : [],
      tags: [tag || slug(query), "pixabay", video ? "video" : "still"],
      width: w,
      height: h,
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
  const video = flag("--video");
  const repo = arg("--repo");
  const repoPath = arg("--path", "");
  const license = arg("--license", "CC0");

  if (!query && source !== "github") {
    die(
      "Usage: acquire-assets.mjs --source wikimedia|pexels|pixabay|github --query \"…\" [--tag t] [--niche home-services] [--limit 2] [--video]"
    );
  }

  let picked = [];
  if (source === "wikimedia") {
    picked = await acquireWikimedia({ query, tag, niche, limit, allowSa });
  } else if (source === "pexels") {
    picked = await acquirePexels({ query, tag, niche, limit, video });
  } else if (source === "pixabay") {
    picked = await acquirePixabay({ query, tag, niche, limit, video });
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
        count: picked.length,
        assets: picked.map((a) => ({
          id: a.id,
          path: a.path,
          license: a.license,
          tags: a.tags,
        })),
        next: [
          "node library/scripts/asset-gap-report.mjs --niche " + niche,
          "Prefer i2v on stills via gen-recipes + alternative-model-routing when video needed",
        ],
      },
      null,
      2
    )
  );
  process.exit(picked.length ? 0 : 2);
}

main().catch((e) => die(String(e.stack || e)));
