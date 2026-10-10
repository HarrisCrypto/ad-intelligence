#!/usr/bin/env node
/**
 * Fetch a public page and emit a structured ad brief skeleton.
 * Does NOT invent proof. Visible text → ASSET_VERIFIED; gaps → PLACEHOLDER/ASSUMED.
 *
 * Usage:
 *   node scripts/brief-from-url.mjs https://example.com
 *   node scripts/brief-from-url.mjs https://example.com --out /tmp/brief.md
 *   node scripts/brief-from-url.mjs https://example.com --json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const out = { url: null, json: false, outPath: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") out.json = true;
    else if (a === "--out" && argv[i + 1]) {
      out.outPath = argv[++i];
    } else if (!a.startsWith("-") && !out.url) {
      out.url = a;
    }
  }
  return out;
}

function decodeEntities(s) {
  return String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html, names) {
  for (const name of names) {
    const re = new RegExp(
      `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`,
      "i"
    );
    const re2 = new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`,
      "i"
    );
    const m = html.match(re) || html.match(re2);
    if (m) return decodeEntities(m[1]);
  }
  return null;
}

function allMatches(html, re, limit = 12) {
  const out = [];
  const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  let m;
  while ((m = r.exec(html)) && out.length < limit) {
    const t = decodeEntities(m[1]);
    if (t && t.length > 1 && t.length < 120 && !out.includes(t)) out.push(t);
  }
  return out;
}

function stripTags(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  );
}

const NICHE_HINTS = [
  [/shampoo|hair\s?care|conditioner|skincare|makeup|beauty/i, "beauty"],
  [/restaurant|coffee|snack|beverage|food\b|recipe/i, "food_bev"],
  [/voice\s?ai|ai\s?agent|chatbot|saas|software|workflow|demo|api/i, "saas"],
  [/plumber|hvac|roofing|dentist|local\s?service/i, "local_services"],
  [/shopify|add to cart|free shipping|dtc/i, "ecommerce"],
  [/fitness|gym|workout/i, "fitness"],
  [/fintech|banking|crypto|invest/i, "fintech"],
  [/real\s?estate|homes for sale/i, "real_estate"],
];

function guessNiche(blob) {
  for (const [re, id] of NICHE_HINTS) {
    if (re.test(blob)) return id;
  }
  return null;
}

function guessCtas(texts) {
  const ctaRe =
    /^(start free|book demo|get started|try free|shop now|buy now|sign up|call now|contact|learn more|request demo|schedule)/i;
  return texts.filter((t) => ctaRe.test(t)).slice(0, 5);
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.url) {
    console.error(
      "Usage: node scripts/brief-from-url.mjs <url> [--out file.md] [--json]"
    );
    process.exit(2);
  }
  let url;
  try {
    url = new URL(args.url);
    if (!/^https?:$/.test(url.protocol)) throw new Error("http(s) only");
  } catch {
    console.error("Invalid URL — need http(s)");
    process.exit(2);
  }

  let html = "";
  let fetchOk = false;
  let fetchError = null;
  try {
    const res = await fetch(url.href, {
      headers: {
        "user-agent": "AdIntelligenceBriefBot/3.11 (+https://github.com/HarrisCrypto/ad-intelligence)",
        accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get("content-type") || "";
    if (!/html|text|xml/i.test(ct) && ct) {
      throw new Error(`Unexpected content-type: ${ct}`);
    }
    html = await res.text();
    fetchOk = true;
  } catch (e) {
    fetchError = String(e.message || e);
  }

  const title =
    (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] ||
    null;
  const description =
    metaContent(html, ["description", "og:description", "twitter:description"]) ||
    null;
  const ogTitle = metaContent(html, ["og:title", "twitter:title"]);
  const ogImage = metaContent(html, ["og:image", "twitter:image"]);
  const siteName = metaContent(html, ["og:site_name"]);
  const h1s = allMatches(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i, 6).map(stripTags);
  const buttonish = allMatches(
    html,
    /<(?:a|button)[^>]*>([\s\S]*?)<\/(?:a|button)>/i,
    40
  ).map(stripTags);
  const ctas = guessCtas(buttonish);
  const textBlob = stripTags(html).slice(0, 8000);
  const nicheGuess = guessNiche(
    [title, description, ogTitle, ...h1s, textBlob.slice(0, 1500)].join(" ")
  );

  const brand =
    siteName ||
    ogTitle ||
    (title ? title.split(/[|\-–—]/)[0].trim() : null) ||
    url.hostname.replace(/^www\./, "");

  const offerLine =
    description ||
    h1s[0] ||
    ogTitle ||
    "[PLACEHOLDER: one-line offer — not found on page]";

  const brief = {
    source_url: url.href,
    fetched: fetchOk,
    fetch_error: fetchError,
    asset_ladder: "S1_url",
    brand: brand ? { value: brand, tag: "ASSET_VERIFIED" } : { value: null, tag: "PLACEHOLDER" },
    one_line_offer: {
      value: offerLine,
      tag: description || h1s[0] ? "ASSET_VERIFIED" : "PLACEHOLDER",
    },
    niche_guess: {
      value: nicheGuess,
      tag: nicheGuess ? "ASSUMED" : "PLACEHOLDER",
      note: "Confirm with retrieve.mjs --list-niches / synonyms",
    },
    visible_headlines: h1s.map((h) => ({ value: h, tag: "ASSET_VERIFIED" })),
    primary_cta_candidates: ctas.length
      ? ctas.map((c) => ({ value: c, tag: "ASSET_VERIFIED" }))
      : [{ value: null, tag: "PLACEHOLDER", note: "No clear CTA text found" }],
    visual_assets: ogImage
      ? [{ url: ogImage, kind: "og:image", tag: "ASSET_VERIFIED" }]
      : [],
    proof_available: {
      value: [],
      tag: "PLACEHOLDER",
      note: "Do not invent reviews/metrics. Add only user-supplied or clearly on-page proof in a follow-up pass.",
    },
    platforms_default: {
      value: nicheGuess === "saas" ? ["linkedin", "meta", "tiktok"] : ["tiktok", "meta"],
      tag: "ASSUMED",
    },
    next: [
      "Confirm niche: node scripts/retrieve.mjs --niche <guess> --platform tiktok --limit 5 --compact",
      "Open attention_models.research URLs + examples/visual/attention-lab.html",
      "node scripts/start-package.mjs --out packages/<brand>-ad.md",
      "Fill from prompts/one-shot.md — never invent proof",
    ],
    docs: {
      playbook: "prompts/brief-from-url.md",
      one_shot: "prompts/one-shot.md",
      libraries: "references/ad-libraries.md",
    },
  };

  if (args.json) {
    const body = JSON.stringify(brief, null, 2);
    if (args.outPath) fs.writeFileSync(args.outPath, body);
    else process.stdout.write(body + "\n");
    if (!fetchOk) process.exitCode = 1;
    return;
  }

  const md = `# Brief from URL (S1)

- Source: ${brief.source_url}
- Fetched: ${brief.fetched ? "yes" : `no — ${brief.fetch_error || "error"}`}
- Asset ladder: S1_url
- Brand: ${brief.brand.value} [${brief.brand.tag}]
- One-line offer: ${brief.one_line_offer.value} [${brief.one_line_offer.tag}]
- Niche guess: ${brief.niche_guess.value || "[PLACEHOLDER]"} [${brief.niche_guess.tag}]
- Platforms (assumed): ${brief.platforms_default.value.join(", ")}
- CTA candidates: ${
    ctas.length ? ctas.map((c) => `"${c}"`).join(", ") : "[PLACEHOLDER]"
  }
- OG image: ${ogImage || "[none found]"}
- Visible H1s: ${h1s.length ? h1s.map((h) => `"${h}"`).join(" · ") : "[none]"}
- Proof: [PLACEHOLDER] — do not invent; paste only on-page/user proof into claim ledger

## Assumptions
- Niche/platform defaults may be wrong — confirm before locking package
- Page may be marketing-only; request product/UI stills if rendering pack/UI

## Next
${brief.next.map((n) => `1. ${n}`).join("\n").replace(/^1\./gm, (m, i, s) => {
  // renumber simply
  return m;
})}

\`\`\`bash
cd ${path.relative(process.cwd(), path.join(__dirname, "..")) || "."}
node scripts/retrieve.mjs --niche ${nicheGuess || "<niche>"} --platform tiktok --limit 5 --compact
node scripts/start-package.mjs --out packages/${String(brand || "brand")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-ad.md
\`\`\`

See prompts/brief-from-url.md · prompts/one-shot.md · examples/visual/attention-lab.html
`;

  // Fix numbering
  let n = 0;
  const mdFixed = md.replace(/^1\. /gm, () => `${++n}. `);

  if (args.outPath) fs.writeFileSync(args.outPath, mdFixed);
  else process.stdout.write(mdFixed);
  if (!fetchOk) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
