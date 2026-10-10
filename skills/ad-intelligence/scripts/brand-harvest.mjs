#!/usr/bin/env node
/**
 * Phase 2.5 — Brand harvest from a live product URL.
 * Populates consistency-system fields from the site. Nothing invented.
 *
 * Usage:
 *   node scripts/brand-harvest.mjs https://oplyai.com
 *   node scripts/brand-harvest.mjs https://oplyai.com --json
 *   node scripts/brand-harvest.mjs https://oplyai.com --out packages/brand-oply.md
 *   node scripts/brand-harvest.mjs https://oplyai.com --write-assets packages/brand-oply-assets
 *
 * Tags: ASSET_VERIFIED (seen on page/CSS) | PLACEHOLDER (missing — ask user / lower ceiling)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const out = { url: null, json: false, outPath: null, assetsDir: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") out.json = true;
    else if (a === "--out" && argv[i + 1]) out.outPath = argv[++i];
    else if (a === "--write-assets" && argv[i + 1]) out.assetsDir = argv[++i];
    else if (!a.startsWith("-") && !out.url) out.url = a;
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

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "ad-intelligence-brand-harvest/1.0" },
      redirect: "follow",
    });
    if (!res.ok) return { ok: false, status: res.status, text: "" };
    return { ok: true, status: res.status, text: await res.text(), finalUrl: res.url };
  } catch (e) {
    return { ok: false, status: 0, text: "", error: String(e?.message || e) };
  } finally {
    clearTimeout(t);
  }
}

function absUrl(base, href) {
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

function extractCssVars(css) {
  const vars = {};
  const re = /--([a-z0-9-_]+)\s*:\s*([^;}+]+)/gi;
  let m;
  while ((m = re.exec(css))) {
    const key = m[1].trim();
    const val = m[2].trim().replace(/\s+/g, " ");
    if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(val) || /rgb|hsl/i.test(val)) {
      vars[key] = val;
    }
  }
  return vars;
}

function extractFontFamilies(css) {
  const set = new Set();
  const re = /font-family:\s*([^;]+);/gi;
  let m;
  while ((m = re.exec(css))) {
    const parts = m[1]
      .split(",")
      .map((p) => p.replace(/["']/g, "").trim())
      .filter((p) => p && !/var\(|sans-serif|serif|monospace|system-ui/i.test(p));
    for (const p of parts) set.add(p);
  }
  return [...set];
}

function extractHexes(css) {
  const set = new Set();
  for (const m of css.matchAll(/#([0-9a-fA-F]{6})\b/g)) {
    set.add(`#${m[1].toLowerCase()}`);
  }
  return [...set];
}

function stripTags(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  );
}

function uniq(arr, lim = 40) {
  const out = [];
  for (const x of arr) {
    const t = decodeEntities(x);
    if (t && !out.includes(t)) out.push(t);
    if (out.length >= lim) break;
  }
  return out;
}

function pickPalette(vars, hexes) {
  const get = (...keys) => {
    for (const k of keys) {
      if (vars[k]) return vars[k];
    }
    return null;
  };
  return {
    background: get("bg", "background", "bg-color") || hexes[0] || null,
    surface: get("surface", "bg-raised", "surface-2") || null,
    text: get("text", "fg", "foreground") || null,
    text_muted: get("text-2", "text-3", "muted") || null,
    accent: get("cyan", "mint", "accent", "primary") || null,
    accent_2: get("cyan-hi", "pink", "accent-2", "secondary") || null,
  };
}

function findCtas(texts) {
  const re =
    /book the access call|book a demo|get started|start free|try free|call now|schedule|sign up|shop now/i;
  return texts.filter((t) => re.test(t) && t.length < 80).slice(0, 8);
}

function findPhones(text) {
  const m = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) || [];
  return uniq(m, 5);
}

function findPrices(text) {
  const m = text.match(/\$\d[\d,]*(?:\.\d{2})?(?:\s*\/\s*(?:mo|month|yr|year))?/gi) || [];
  return uniq(m, 12);
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.url) {
    console.error(
      "Usage: node scripts/brand-harvest.mjs <url> [--json] [--out file.md] [--write-assets dir]"
    );
    process.exit(2);
  }
  let base;
  try {
    base = new URL(args.url);
    if (!/^https?:$/.test(base.protocol)) throw new Error("http(s) only");
  } catch {
    console.error("Invalid URL");
    process.exit(2);
  }

  const page = await fetchText(base.href);
  if (!page.ok) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          error: "fetch_failed",
          status: page.status,
          detail: page.error || null,
          ceiling: "Cannot harvest — lower quality ceiling; do not invent a brand system",
        },
        null,
        2
      )
    );
    process.exit(1);
  }

  const html = page.text;
  const cssHrefs = uniq(
    [...html.matchAll(/<link[^>]+href=["']([^"']+\.css[^"']*)["']/gi)].map((m) => m[1]),
    12
  );
  let cssBlob = "";
  const cssFetched = [];
  for (const href of cssHrefs.slice(0, 6)) {
    const u = absUrl(page.finalUrl || base.href, href);
    if (!u) continue;
    const c = await fetchText(u);
    if (c.ok) {
      cssBlob += `\n${c.text}`;
      cssFetched.push(u);
    }
  }
  // inline styles
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
    cssBlob += `\n${m[1]}`;
  }

  const vars = extractCssVars(cssBlob);
  const fonts = extractFontFamilies(cssBlob);
  const hexes = extractHexes(cssBlob);
  const palette = pickPalette(vars, hexes);
  const text = stripTags(html);
  const title =
    decodeEntities((html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] || "") ||
    null;
  const h1s = uniq(
    [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
      stripTags(m[1])
    ),
    6
  );
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12 && s.length < 160);
  // Prefer the brand's locked slogan when present (exact phrase beats fragments)
  const sloganHit = text.match(
    /Phone receptionist\.\s*Website chat\.\s*Same brain\./i
  );
  const taglineCandidates = [
    ...(sloganHit ? [sloganHit[0].replace(/\s+/g, " ").trim()] : []),
    ...sentences.filter((s) => /same brain/i.test(s)),
    ...sentences.filter((s) =>
      /receptionist|24\/7|after hours|phone|chat/i.test(s)
    ),
  ];
  const imgHrefs = uniq(
    [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]),
    30
  )
    .map((h) => absUrl(page.finalUrl || base.href, h))
    .filter(Boolean);
  const assetLike = imgHrefs.filter((u) =>
    /asset|mascot|logo|icon|og-image|brand/i.test(u)
  );
  const ctas = findCtas([
    ...h1s,
    ...uniq(
      [...html.matchAll(/>([^<]{3,60})</g)].map((m) => m[1]),
      80
    ),
  ]);
  const phones = findPhones(text);
  const prices = findPrices(text);

  const missing = [];
  const field = (value, placeholder) => {
    if (value) return { value, tag: "ASSET_VERIFIED" };
    missing.push(placeholder);
    return { value: null, tag: "PLACEHOLDER", placeholder };
  };

  const harvest = {
    ok: true,
    gate: "2.5-brand-harvest",
    source_url: page.finalUrl || base.href,
    fetched_at: new Date().toISOString().slice(0, 10),
    css_files: cssFetched,
    brand: {
      title: field(title, "[PLACEHOLDER: brand title]"),
      h1: field(h1s[0] || null, "[PLACEHOLDER: H1]"),
      tagline: field(
        taglineCandidates[0] || h1s[1] || null,
        "[PLACEHOLDER: tagline — not found on page]"
      ),
    },
    palette: Object.fromEntries(
      Object.entries(palette).map(([k, v]) => [
        k,
        v
          ? { value: v, tag: "ASSET_VERIFIED" }
          : { value: null, tag: "PLACEHOLDER", placeholder: `[PLACEHOLDER: palette.${k}]` },
      ])
    ),
    css_variables: vars,
    fonts_named_on_site: fonts.length
      ? { value: fonts, tag: "ASSET_VERIFIED" }
      : {
          value: [],
          tag: "PLACEHOLDER",
          placeholder: "[PLACEHOLDER: fonts — not detected; use library/typography or user kit]",
        },
    assets: {
      images: assetLike.length ? assetLike : imgHrefs.slice(0, 8),
      tag: assetLike.length || imgHrefs.length ? "ASSET_VERIFIED" : "PLACEHOLDER",
      note: "Download only with rights; prefer linking. Use --write-assets for local cache (gitignored packages/).",
    },
    copy: {
      ctas: field(ctas[0] ? ctas : null, "[PLACEHOLDER: CTA wording]"),
      phones: field(phones[0] ? phones : null, "[PLACEHOLDER: phone]"),
      prices_seen: field(prices[0] ? prices : null, "[PLACEHOLDER: pricing]"),
      sample_lines: field(
        taglineCandidates.slice(0, 6).length
          ? taglineCandidates.slice(0, 6)
          : null,
        "[PLACEHOLDER: sample marketing lines]"
      ),
    },
    suitability_note:
      "Mascots / playful marks may be brand-correct but wrong for cold-traffic DR — demote to endcard if they read as kids-app (B1.2). Record the judgement in the run log.",
    missing,
    ceiling:
      missing.length > 0
        ? "Some brand fields missing — do NOT invent substitutes; ask user or lower the promised ceiling"
        : "Harvest complete enough to lock consistency sheets from ASSET_VERIFIED fields",
    next: [
      "Paste Consistency systems from the markdown block below",
      "Provision fonts via library/typography (or site-named faces if licensed)",
      "Prefer real product UI / mascot assets over generative chrome",
      "Claim ledger: published facts ASSET_VERIFIED; testimonials/metrics PLACEHOLDER",
    ],
  };

  if (args.assetsDir && harvest.assets.images.length) {
    const dir = path.resolve(args.assetsDir);
    fs.mkdirSync(dir, { recursive: true });
    const saved = [];
    for (const u of harvest.assets.images.slice(0, 8)) {
      try {
        const res = await fetch(u, {
          headers: { "User-Agent": "ad-intelligence-brand-harvest/1.0" },
        });
        if (!res.ok) continue;
        const buf = Buffer.from(await res.arrayBuffer());
        const name = path.basename(new URL(u).pathname) || "asset.bin";
        const dest = path.join(dir, name);
        fs.writeFileSync(dest, buf);
        saved.push({ url: u, path: dest, bytes: buf.length });
      } catch {
        /* skip */
      }
    }
    harvest.assets_written = saved;
  }

  const md = renderMarkdown(harvest);
  if (args.json) {
    console.log(JSON.stringify(harvest, null, 2));
  } else {
    console.log(md);
  }
  if (args.outPath) {
    fs.mkdirSync(path.dirname(path.resolve(args.outPath)), { recursive: true });
    fs.writeFileSync(path.resolve(args.outPath), md);
  }
  process.exit(harvest.ok ? 0 : 1);
}

function tag(cell) {
  if (!cell) return "PLACEHOLDER";
  return cell.tag || "PLACEHOLDER";
}
function val(cell) {
  if (!cell) return "—";
  if (cell.value == null) return cell.placeholder || "[PLACEHOLDER]";
  if (Array.isArray(cell.value)) return cell.value.join(" · ");
  return String(cell.value);
}

function renderMarkdown(h) {
  const p = h.palette;
  return `# Brand harvest (Gate 2.5)

- Source: ${h.source_url}
- Fetched: ${h.fetched_at}
- Gate: consistency fields from the live site — **nothing invented**
- Ceiling: ${h.ceiling}

## Consistency systems (harvest → paste into package)

- Identity mode: ui / brand-mascot (judge suitability — B1.2)
- Provenance of sheet fields: mixed ASSET_VERIFIED / PLACEHOLDER (see ledger)

#### Product sheet — ${val(h.brand.title)}
- Official name: ${val(h.brand.title)} [${tag(h.brand.title)}]
- H1 / hero line: ${val(h.brand.h1)} [${tag(h.brand.h1)}]
- Tagline: ${val(h.brand.tagline)} [${tag(h.brand.tagline)}]
- Palette background: ${val(p.background)} [${tag(p.background)}]
- Palette surface: ${val(p.surface)} [${tag(p.surface)}]
- Palette text: ${val(p.text)} [${tag(p.text)}]
- Palette accent: ${val(p.accent)} [${tag(p.accent)}]
- Palette accent_2: ${val(p.accent_2)} [${tag(p.accent_2)}]
- Fonts on site: ${val(h.fonts_named_on_site)} [${tag(h.fonts_named_on_site)}]
- Toolbox fonts if craft names Anton/Poppins/Inter Tight: \`library/typography/\` (OFL)
- CTA wording: ${val(h.copy.ctas)} [${tag(h.copy.ctas)}]
- Phone: ${val(h.copy.phones)} [${tag(h.copy.phones)}]
- Prices seen: ${val(h.copy.prices_seen)} [${tag(h.copy.prices_seen)}]
- Image assets: ${(h.assets.images || []).slice(0, 6).join(" · ") || "[PLACEHOLDER: brand images]"} [${h.assets.tag}]
- Forbidden: inventing a parallel palette/mascot when ASSET_VERIFIED assets exist
- Suitability: ${h.suitability_note}

### Claim & asset ledger (seed)
| Claim or asset | Tag | Source |
| --- | --- | --- |
| Brand name / tagline / CTA / phone / prices above | ASSET_VERIFIED | ${h.source_url} |
| Palette CSS variables | ASSET_VERIFIED | site CSS |
| Mascot / UI screenshots | ASSET_VERIFIED or PLACEHOLDER | assets list |
| Testimonials / ROAS / lift % | PLACEHOLDER | never invent |

### Missing (do not invent)
${(h.missing.length ? h.missing : ["— none —"]).map((m) => `- ${m}`).join("\n")}

### Next
${h.next.map((n) => `- ${n}`).join("\n")}
`;
}

main();
