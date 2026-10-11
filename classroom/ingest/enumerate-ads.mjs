#!/usr/bin/env node
/**
 * Google Ads Transparency enumerator (Playwright).
 * domain/keyword → advertisers (AR…) → creatives (CR…)
 *
 *   node classroom/ingest/enumerate-ads.mjs --niche home-services --limit 30
 *   node classroom/ingest/enumerate-ads.mjs --domain angi.com --limit 20
 *
 * Writes classroom/private-cache/enumerate-<ts>.json (gitignored) and prints path.
 * Never commits media. Throttled. Skips known-dead domains.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const SEEDS = JSON.parse(fs.readFileSync(path.join(__dirname, "seeds.json"), "utf8"));
const CACHE = path.join(ROOT, "classroom/private-cache");
fs.mkdirSync(CACHE, { recursive: true });

function arg(n, d = null) {
  const i = process.argv.indexOf(n);
  return i >= 0 ? process.argv[i + 1] : d;
}

const niche = arg("--niche");
const domainOnly = arg("--domain");
const limit = Number(arg("--limit", "40"));
const region = arg("--region", SEEDS.region || "US");
const headless = !process.argv.includes("--headed");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function nicheJobs() {
  if (domainOnly) {
    return [{ niche: niche || "unknown", domain: domainOnly }];
  }
  const jobs = [];
  const niches = niche ? { [niche]: SEEDS.niches[niche] } : SEEDS.niches;
  for (const [nid, conf] of Object.entries(niches || {})) {
    for (const d of conf.domains || []) {
      if ((SEEDS.skip_domains || []).includes(d)) continue;
      jobs.push({ niche: nid, domain: d });
    }
  }
  return jobs;
}

async function extractIdsFromPage(page) {
  const html = await page.content();
  const advertisers = [...new Set([...html.matchAll(/AR\d{10,}/g)].map((m) => m[0]))];
  const creatives = [...new Set([...html.matchAll(/CR\d{10,}/g)].map((m) => m[0]))];
  // Also from hrefs
  const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href") || ""));
  for (const h of hrefs) {
    const ar = h.match(/advertiser\/(AR\d+)/);
    const cr = h.match(/creative\/(CR\d+)/);
    if (ar) advertisers.push(ar[1]);
    if (cr) creatives.push(cr[1]);
  }
  return {
    advertisers: [...new Set(advertisers)],
    creatives: [...new Set(creatives)],
  };
}

async function listDomain(page, domain) {
  const url = `https://adstransparency.google.com/?region=${region}&domain=${encodeURIComponent(domain)}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await sleep(2500);
  // scroll to load more
  for (let i = 0; i < 4; i++) {
    await page.mouse.wheel(0, 1800);
    await sleep(800);
  }
  const body = await page.innerText("body").catch(() => "");
  if (/no ads found/i.test(body)) {
    return { url, advertisers: [], creatives: [], note: "No ads found" };
  }
  const ids = await extractIdsFromPage(page);
  return { url, ...ids, note: body.slice(0, 200) };
}

async function listAdvertiserCreatives(page, ar) {
  const url = `https://adstransparency.google.com/advertiser/${ar}?region=${region}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await sleep(2000);
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 2000);
    await sleep(700);
  }
  const ids = await extractIdsFromPage(page);
  return { url, creatives: ids.creatives, advertisers: ids.advertisers };
}

async function snapshotCreative(page, ar, cr, outDir) {
  const url = `https://adstransparency.google.com/advertiser/${ar}/creative/${cr}?region=${region}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await sleep(2500);
  const shot = path.join(outDir, `${cr}.png`);
  await page.screenshot({ path: shot, fullPage: false });
  // try capture video/image srcs
  const media = await page.evaluate(() => {
    const vids = [...document.querySelectorAll("video")].map((v) => v.currentSrc || v.src);
    const imgs = [...document.querySelectorAll("img")]
      .map((i) => i.src)
      .filter((s) => s && !/logo|icon|avatar|sprite/i.test(s) && s.startsWith("http"));
    const text = document.body?.innerText?.slice(0, 4000) || "";
    return { vids: vids.filter(Boolean), imgs: imgs.slice(0, 12), text };
  });
  // download first video if any
  let mediaPath = shot;
  let format_guess = "static_image";
  if (media.vids[0]) {
    format_guess = "ugc_video";
    const dest = path.join(outDir, `${cr}.mp4`);
    try {
      const res = await page.request.get(media.vids[0]);
      if (res.ok()) {
        fs.writeFileSync(dest, await res.body());
        mediaPath = dest;
      }
    } catch {
      /* keep screenshot */
    }
  } else if (media.imgs[0]) {
    format_guess = /text|search|headline/i.test(media.text) ? "text_search" : "static_image";
    const dest = path.join(outDir, `${cr}-asset.jpg`);
    try {
      const res = await page.request.get(media.imgs[0]);
      if (res.ok()) {
        fs.writeFileSync(dest, await res.body());
        mediaPath = dest;
      }
    } catch {
      /* screenshot */
    }
  } else if (/Sponsored|headline|description/i.test(media.text)) {
    format_guess = "text_search";
  }
  return {
    advertiser: ar,
    creative: cr,
    url,
    format_guess,
    media_path: mediaPath,
    page_text: media.text.slice(0, 2500),
    video_urls: media.vids,
    image_urls: media.imgs.slice(0, 5),
  };
}

async function main() {
  const jobs = nicheJobs();
  const browser = await chromium.launch({
    headless,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1400, height: 900 },
  });
  const page = await context.newPage();

  const out = {
    started: new Date().toISOString(),
    region,
    attempted: [],
    creatives: [],
    errors: [],
  };
  const seenCr = new Set();
  const shotDir = path.join(CACHE, `enumerate-${Date.now()}`);
  fs.mkdirSync(shotDir, { recursive: true });

  for (const job of jobs) {
    if (out.creatives.length >= limit) break;
    try {
      const listed = await listDomain(page, job.domain);
      out.attempted.push({ ...job, ...listed, advertisers_n: listed.advertisers.length });
      await sleep(1200);
      const ars = listed.advertisers.slice(0, 4);
      for (const ar of ars) {
        if (out.creatives.length >= limit) break;
        const adv = await listAdvertiserCreatives(page, ar);
        await sleep(1000);
        for (const cr of adv.creatives) {
          if (seenCr.has(cr)) continue;
          seenCr.add(cr);
          if (out.creatives.length >= limit) break;
          try {
            const snap = await snapshotCreative(page, ar, cr, shotDir);
            out.creatives.push({ niche: job.niche, domain: job.domain, ...snap });
            await sleep(900);
          } catch (e) {
            out.errors.push({ ar, cr, error: String(e.message || e) });
          }
        }
      }
      // also snapshot creatives found on domain page even without AR walk
      for (const cr of listed.creatives.slice(0, 8)) {
        if (seenCr.has(cr) || out.creatives.length >= limit) continue;
        // need AR — try parse from hrefs on current domain page
        const pair = listed.advertisers[0];
        if (!pair) continue;
        seenCr.add(cr);
        try {
          const snap = await snapshotCreative(page, pair, cr, shotDir);
          out.creatives.push({ niche: job.niche, domain: job.domain, ...snap });
          await sleep(900);
        } catch (e) {
          out.errors.push({ cr, error: String(e.message || e) });
        }
      }
    } catch (e) {
      out.errors.push({ domain: job.domain, error: String(e.message || e) });
    }
  }

  await browser.close();
  out.finished = new Date().toISOString();
  out.counts = {
    domains: out.attempted.length,
    creatives: out.creatives.length,
    errors: out.errors.length,
  };
  const outPath = path.join(shotDir, "enumerate.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  // also copy summary into cache root for mass-ingest
  const latest = path.join(CACHE, "enumerate-latest.json");
  fs.writeFileSync(latest, JSON.stringify(out, null, 2));
  console.log(JSON.stringify({ ok: true, out: outPath, latest, counts: out.counts }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
