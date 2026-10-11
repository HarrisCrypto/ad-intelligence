#!/usr/bin/env node
/**
 * Google Ads Transparency enumerator — FORMAT PASSES (not All formats).
 *
 *   node classroom/ingest/enumerate-ads.mjs --format VIDEO --niche home-services --limit 20
 *   node classroom/ingest/enumerate-ads.mjs --formats VIDEO,IMAGE,TEXT --limit 40
 *
 * Uses ?format=VIDEO|IMAGE|TEXT URL param + Ad format filter button.
 * Also walks /advertiser/<AR> "See all ads".
 * Video creatives: records Format from UI, youtube_id from ytimg, downloads media when possible.
 * Media → classroom/private-cache/ (gitignored). Checkpoint/resume via enumerate-checkpoint.json.
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
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const niche = arg("--niche");
const domainOnly = arg("--domain");
const limit = Number(arg("--limit", "40"));
const region = arg("--region", SEEDS.region || "US");
const headless = !process.argv.includes("--headed");
const formatsArg = arg("--formats") || arg("--format") || "VIDEO";
const FORMATS = formatsArg.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
const checkpointPath = path.join(CACHE, "enumerate-checkpoint.json");

function nicheJobs() {
  if (domainOnly) return [{ niche: niche || "unknown", domain: domainOnly }];
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

function loadCheckpoint() {
  if (!fs.existsSync(checkpointPath)) return { seen: [], creatives: [] };
  try {
    return JSON.parse(fs.readFileSync(checkpointPath, "utf8"));
  } catch {
    return { seen: [], creatives: [] };
  }
}

function saveCheckpoint(state) {
  fs.writeFileSync(checkpointPath, JSON.stringify(state, null, 2));
}

async function selectFormat(page, format) {
  // Prefer URL param; also sync UI filter
  const btn = page.locator('[aria-label*="Ad format filter"]').first();
  if (!(await btn.count())) return false;
  const aria = (await btn.getAttribute("aria-label")) || "";
  if (new RegExp(format, "i").test(aria) && !/All formats/i.test(aria)) return true;
  await btn.click();
  await sleep(600);
  const opt = page.locator('material-select-item[role="option"]').filter({
    hasText: new RegExp(format, "i"),
  }).first();
  if (await opt.count()) {
    await opt.click();
    await sleep(400);
    const apply = page.locator('material-button').filter({ hasText: /^Apply$/i }).first();
    if (await apply.count()) {
      try {
        await apply.click({ timeout: 1500 });
      } catch {}
    }
    await sleep(1500);
    return true;
  }
  return false;
}

async function extractIds(page) {
  const html = await page.content();
  const advertisers = [...new Set([...html.matchAll(/AR\d{10,}/g)].map((m) => m[0]))];
  const creatives = [...new Set([...html.matchAll(/CR\d{10,}/g)].map((m) => m[0]))];
  const hrefs = await page.$$eval("a[href]", (as) =>
    as.map((a) => a.getAttribute("href") || "")
  );
  const pairs = [];
  for (const h of hrefs) {
    const m = h.match(/advertiser\/(AR\d+)\/creative\/(CR\d+)/);
    if (m) pairs.push({ advertiser: m[1], creative: m[2] });
  }
  return { advertisers, creatives, pairs };
}

async function snapshotCreative(page, context, { ar, cr, format, outDir }) {
  const url = `https://adstransparency.google.com/advertiser/${ar}/creative/${cr}?region=${region}&format=${format}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await sleep(2500);
  const html = await page.content();
  const text = await page.innerText("body").catch(() => "");
  const formatUi = (text.match(/Format:\s*(\w+)/i) || [])[1] || format;
  const ytIds = [
    ...new Set([...html.matchAll(/ytimg\.com\/vi\/([a-zA-Z0-9_-]{6,})/g)].map((m) => m[1])),
  ];
  const shot = path.join(outDir, `${cr}.png`);
  await page.screenshot({ path: shot, fullPage: false });

  let mediaPath = null;
  let mediaStatus = "pending";
  let videoUrls = [];

  // Capture video tags / network mp4
  const media = await page.evaluate(() => {
    const vids = [...document.querySelectorAll("video")].map(
      (v) => v.currentSrc || v.src
    );
    return { vids: vids.filter(Boolean) };
  });
  videoUrls = media.vids;

  if (videoUrls[0]) {
    try {
      const res = await context.request.get(videoUrls[0]);
      if (res.ok()) {
        const dest = path.join(outDir, `${cr}.mp4`);
        fs.writeFileSync(dest, await res.body());
        if (fs.statSync(dest).size > 50000) {
          mediaPath = dest;
          mediaStatus = "downloaded_direct";
        }
      }
    } catch {
      /* continue */
    }
  }

  // YouTube-hosted: record id; download attempted later by mass-ingest / fetch-video
  if (!mediaPath && ytIds[0]) {
    mediaStatus = "youtube_gated";
  } else if (!mediaPath && /Video/i.test(formatUi)) {
    mediaStatus = "video_ui_no_file";
  } else if (!mediaPath) {
    mediaStatus = "image_or_text";
    const imgs = await page.$$eval("img", (els) =>
      els
        .map((i) => i.src)
        .filter((s) => s && s.startsWith("http") && !/logo|icon|avatar|ytimg/i.test(s))
    );
    if (imgs[0]) {
      try {
        const res = await context.request.get(imgs[0]);
        if (res.ok()) {
          const dest = path.join(outDir, `${cr}-asset.jpg`);
          fs.writeFileSync(dest, await res.body());
          mediaPath = dest;
          mediaStatus = "image_asset";
        }
      } catch {}
    }
  }

  return {
    advertiser: ar,
    creative: cr,
    url,
    format_ui: formatUi,
    format_pass: format,
    youtube_id: ytIds[0] || null,
    media_path: mediaPath || shot,
    media_status: mediaStatus,
    page_text: text.slice(0, 2500),
    video_urls: videoUrls,
    region,
    accessed: new Date().toISOString().slice(0, 10),
  };
}

async function main() {
  const jobs = nicheJobs();
  const cp = loadCheckpoint();
  const seen = new Set(cp.seen || []);
  const out = {
    started: new Date().toISOString(),
    region,
    formats: FORMATS,
    attempted: [],
    creatives: cp.creatives || [],
    errors: [],
  };

  const browser = await chromium.launch({
    headless,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--autoplay-policy=no-user-gesture-required",
    ],
  });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1400, height: 900 },
  });
  const page = await context.newPage();
  const shotDir = path.join(CACHE, `enumerate-${Date.now()}`);
  fs.mkdirSync(shotDir, { recursive: true });

  outer: for (const format of FORMATS) {
    for (const job of jobs) {
      if (out.creatives.length >= limit) break outer;
      const listUrl = `https://adstransparency.google.com/?region=${region}&domain=${encodeURIComponent(job.domain)}&format=${format}`;
      try {
        await page.goto(listUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
        await sleep(2200);
        await selectFormat(page, format);
        for (let i = 0; i < 4; i++) {
          await page.mouse.wheel(0, 1800);
          await sleep(700);
        }
        const body = await page.innerText("body").catch(() => "");
        if (/no ads found/i.test(body)) {
          out.attempted.push({ ...job, format, note: "No ads found", creatives_n: 0 });
          await sleep(800);
          continue;
        }
        const ids = await extractIds(page);
        out.attempted.push({
          ...job,
          format,
          advertisers_n: ids.advertisers.length,
          creatives_n: ids.creatives.length,
          pairs_n: ids.pairs.length,
        });

        // Prefer advertiser→creative pairs from hrefs
        let targets = ids.pairs.slice();
        if (!targets.length && ids.advertisers[0]) {
          // walk advertiser page
          for (const ar of ids.advertisers.slice(0, 3)) {
            const advUrl = `https://adstransparency.google.com/advertiser/${ar}?region=${region}`;
            await page.goto(advUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
            await sleep(2000);
            // try format filter on advertiser page too
            await selectFormat(page, format).catch(() => false);
            for (let i = 0; i < 5; i++) {
              await page.mouse.wheel(0, 2000);
              await sleep(600);
            }
            const advIds = await extractIds(page);
            for (const cr of advIds.creatives) {
              targets.push({ advertiser: ar, creative: cr });
            }
            // "See all ads" button
            const seeAll = page.locator('material-button, a, button').filter({
              hasText: /See all ads/i,
            }).first();
            if (await seeAll.count()) {
              try {
                await seeAll.click({ timeout: 2000 });
                await sleep(2000);
                const more = await extractIds(page);
                for (const cr of more.creatives) {
                  targets.push({ advertiser: ar, creative: cr });
                }
              } catch {}
            }
          }
        }

        // dedupe targets
        const uniq = [];
        const seenT = new Set();
        for (const t of targets) {
          const k = `${t.advertiser}/${t.creative}`;
          if (seenT.has(k) || seen.has(t.creative)) continue;
          seenT.add(k);
          uniq.push(t);
        }

        for (const t of uniq) {
          if (out.creatives.length >= limit) break outer;
          if (seen.has(t.creative)) continue;
          seen.add(t.creative);
          try {
            const snap = await snapshotCreative(page, context, {
              ar: t.advertiser,
              cr: t.creative,
              format,
              outDir: shotDir,
            });
            out.creatives.push({ niche: job.niche, domain: job.domain, ...snap });
            saveCheckpoint({ seen: [...seen], creatives: out.creatives });
            await sleep(900);
          } catch (e) {
            out.errors.push({
              ar: t.advertiser,
              cr: t.creative,
              format,
              error: String(e.message || e),
            });
          }
        }
        await sleep(1000);
      } catch (e) {
        out.errors.push({ domain: job.domain, format, error: String(e.message || e) });
      }
    }
  }

  await browser.close();
  out.finished = new Date().toISOString();
  out.counts = {
    creatives: out.creatives.length,
    by_format_pass: FORMATS.reduce((a, f) => {
      a[f] = out.creatives.filter((c) => c.format_pass === f).length;
      return a;
    }, {}),
    by_format_ui: out.creatives.reduce((a, c) => {
      const k = c.format_ui || "unknown";
      a[k] = (a[k] || 0) + 1;
      return a;
    }, {}),
    video_with_youtube_id: out.creatives.filter((c) => c.youtube_id).length,
    video_media_downloaded: out.creatives.filter((c) =>
      /\.mp4$/i.test(c.media_path || "")
    ).length,
    errors: out.errors.length,
  };
  const outPath = path.join(shotDir, "enumerate.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  fs.writeFileSync(path.join(CACHE, "enumerate-latest.json"), JSON.stringify(out, null, 2));
  console.log(
    JSON.stringify({ ok: true, out: outPath, latest: path.join(CACHE, "enumerate-latest.json"), counts: out.counts }, null, 2)
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
