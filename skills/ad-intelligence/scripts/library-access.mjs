#!/usr/bin/env node
/**
 * Print a research access plan: primary library + deep links + fallbacks
 * when TikTok / Meta login-wall you.
 *
 * Usage:
 *   node scripts/library-access.mjs --niche saas --platform tiktok
 *   node scripts/library-access.mjs --niche beauty --platform meta --keyword shampoo
 *   node scripts/library-access.mjs --list
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const AM_PATH = path.join(ROOT, "references", "attention-models.json");

function parseArgs(argv) {
  const out = { list: false, keyword: "", niche: "", platform: "" };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const n = argv[i + 1];
    if (a === "--list") out.list = true;
    else if (a === "--niche" && n) {
      out.niche = n;
      i++;
    } else if (a === "--platform" && n) {
      out.platform = n;
      i++;
    } else if (a === "--keyword" && n) {
      out.keyword = n;
      i++;
    }
  }
  return out;
}

function fillTemplate(tpl, keyword) {
  if (!tpl) return null;
  const q = encodeURIComponent(keyword || "virtual receptionist");
  return tpl.replace(/\{keyword\}/g, q);
}

function platformMatch(lib, plat) {
  if (!plat) return true;
  const p = plat.toLowerCase();
  const all = [
    ...(lib.platforms || []),
    ...(lib.covers_styles_also || []),
  ].map((x) => x.toLowerCase());
  return all.some((x) => x === p || x.includes(p) || p.includes(x));
}

function main() {
  const q = parseArgs(process.argv);
  const am = JSON.parse(fs.readFileSync(AM_PATH, "utf8"));
  const libs = am.public_libraries || [];

  if (q.list) {
    console.log(
      JSON.stringify(
        libs.map((l) => ({
          id: l.id,
          access: l.access,
          platforms: l.platforms,
          entry_url: l.entry_url || l.url,
        })),
        null,
        2
      )
    );
    return;
  }

  const plat = (q.platform || "").toLowerCase() || "tiktok";
  const primary =
    libs.find(
      (l) =>
        (l.platforms || []).some((p) => p.toLowerCase() === plat) &&
        l.id !== "attention_lab_offline"
    ) || libs.find((l) => platformMatch(l, plat) && l.id !== "attention_lab_offline");

  const offline = libs.find((l) => l.id === "attention_lab_offline");
  const byId = Object.fromEntries(libs.map((l) => [l.id, l]));

  const keyword = q.keyword || q.niche || "category keyword";
  const fallbackIds = [
    ...(primary?.fallbacks || []),
    "google_ads_transparency",
    "meta_ad_library",
    "attention_lab_offline",
  ];
  const seen = new Set([primary?.id].filter(Boolean));
  const fallbacks = [];
  for (const id of fallbackIds) {
    if (seen.has(id)) continue;
    const lib = byId[id];
    if (!lib) continue;
    seen.add(id);
    fallbacks.push(lib);
  }

  const plan = {
    query: { niche: q.niche || null, platform: plat, keyword },
    docs: "references/ad-libraries.md",
    rule: "Login walls ≠ skip research. Walk entry → fallbacks → Attention Lab. Never invent CTR.",
    primary: primary
      ? {
          id: primary.id,
          name: primary.name,
          access: primary.access,
          entry_url: primary.entry_url || primary.url,
          deep_link: fillTemplate(primary.deep_link_template, keyword),
          how: primary.how,
          when_walled: primary.when_walled,
        }
      : null,
    fallbacks: fallbacks.map((l) => ({
      id: l.id,
      name: l.name,
      access: l.access,
      entry_url: l.entry_url || l.url,
      deep_link: fillTemplate(l.deep_link_template, keyword),
      how: l.how,
    })),
    offline: offline
      ? {
          id: offline.id,
          path: offline.entry_url,
          how: offline.how,
        }
      : null,
    style_coverage_note:
      plat === "tiktok" && primary?.access === "partial_free"
        ? "TikTok Top Ads is partial signed-out. Meta Ad Library video + Google Transparency Shorts cover the same UGC/macro/PAS styles; use tiktok-tagged Attention Lab models for timing sheets."
        : plat === "meta" || plat === "facebook" || plat === "instagram"
          ? "Meta Ad Library is login_free via country deep links. If interstitial appears, use Google Transparency + Lab."
          : "Open primary entry_url; if walled, walk fallbacks in order.",
    ritual: [
      "Open primary.entry_url (or deep_link with keyword)",
      "If walled → open first login_free fallback",
      "Note 3 ads: hook type, time-to-product (video only), CTA count, format",
      "retrieve.mjs --compact → bind study + attention model",
      "Record library_access status in package Retrieval",
    ],
  };

  console.log(JSON.stringify(plan, null, 2));
}

main();
