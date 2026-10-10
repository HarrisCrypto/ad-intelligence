#!/usr/bin/env node
/**
 * Retrieve ad blueprints by platform / style / funnel / niche / tier / virality / job.
 *
 * Usage:
 *   node retrieve.mjs --niche beauty --tag viral --limit 5
 *   node retrieve.mjs --niche skincare --platform tiktok
 *   node retrieve.mjs --niche plumbing --limit 5
 *   node retrieve.mjs --production high_production --virality brand_film
 *   node retrieve.mjs --list
 *   node retrieve.mjs --list-niches
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_ROOT = path.join(__dirname, "..");
const DATABASE = path.join(DB_ROOT, "database");
const INDEX_PATH = path.join(DATABASE, "index.json");
const PIPE_PATH = path.join(
  DB_ROOT,
  "references",
  "creative-stack",
  "pattern-to-pipeline.json"
);

/** Extra synonyms beyond niche-file aliases (natural language → niche id). */
const NICHE_SYNONYMS = {
  plumbing: "local-services",
  plumber: "local-services",
  hvac: "local-services",
  roofing: "local-services",
  electrician: "local-services",
  dentist: "local-services",
  dental: "local-services",
  "law firm": "b2b-services",
  lawyer: "b2b-services",
  attorney: "b2b-services",
  accountant: "b2b-services",
  coffee: "food-bev",
  restaurant: "food-bev",
  snack: "food-bev",
  supplement: "health",
  supplements: "health",
  clinic: "health",
  crypto: "fintech",
  insurance: "fintech",
  banking: "fintech",
  coaching: "education",
  course: "education",
  skincare: "beauty",
  makeup: "beauty",
  wellness: "health",
  gym: "fitness",
  apparel: "fashion",
  shopify: "ecommerce",
  dtc: "ecommerce",
};

const PLATFORM_ALIASES = {
  instagram: "meta",
  ig: "meta",
  reels: "meta",
  fb: "meta",
  facebook: "meta",
  shorts: "youtube_shorts",
  yt: "youtube",
  google: "google_youtube",
};

function parseArgs(argv) {
  const out = { limit: 5, list: false, listNiches: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--list") out.list = true;
    else if (a === "--list-niches") out.listNiches = true;
    else if (a === "--platform" && next) {
      out.platform = next;
      i++;
    } else if (a === "--style" && next) {
      out.style = next;
      i++;
    } else if (a === "--funnel" && next) {
      out.funnel_stage = next;
      i++;
    } else if (a === "--niche" && next) {
      out.niche = next;
      i++;
    } else if (a === "--job" && next) {
      out.job = next;
      i++;
    } else if (a === "--tag" && next) {
      out.tag = next;
      i++;
    } else if ((a === "--production" || a === "--tier") && next) {
      out.production_tier = next;
      i++;
    } else if (a === "--virality" && next) {
      out.virality_posture = next;
      i++;
    } else if (a === "--limit" && next) {
      out.limit = Number(next) || 5;
      i++;
    } else if (a === "--id" && next) {
      out.id = next;
      i++;
    }
  }
  return out;
}

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function buildAliasIndex(index) {
  const map = new Map();
  for (const n of index.niches) {
    const pack = loadJson(path.join(DATABASE, n.file));
    const keys = new Set([
      pack.id,
      pack.niche,
      n.id,
      ...(pack.aliases || []),
    ]);
    for (const k of keys) {
      if (k) map.set(String(k).toLowerCase().replace(/_/g, "-"), pack.id);
      if (k) map.set(String(k).toLowerCase().replace(/-/g, "_"), pack.id);
    }
  }
  for (const [syn, id] of Object.entries(NICHE_SYNONYMS)) {
    map.set(syn.toLowerCase(), id);
  }
  return map;
}

function resolveNiche(raw, aliasIndex, index) {
  if (!raw) return { nicheId: null, nichePack: null, warnings: [] };
  const warnings = [];
  const key = raw.toLowerCase().trim();
  const norm = key.replace(/_/g, "-");
  let nicheId =
    aliasIndex.get(key) ||
    aliasIndex.get(norm) ||
    aliasIndex.get(key.replace(/-/g, "_"));

  if (!nicheId) {
    // token fuzzy: any alias contains or is contained
    for (const [a, id] of aliasIndex.entries()) {
      if (a.includes(norm) || norm.includes(a)) {
        nicheId = id;
        warnings.push(`niche_fuzzy_matched:${raw}->${id}`);
        break;
      }
    }
  }

  if (!nicheId) {
    warnings.push(`niche_unresolved:${raw}`);
    return { nicheId: null, nichePack: null, warnings };
  }

  const nicheHit = index.niches.find((n) => n.id === nicheId || n.id === nicheId.replace(/_/g, "-"));
  // niche files use ids like local-services
  const hit =
    nicheHit ||
    index.niches.find(
      (n) => n.id.replace(/_/g, "-") === nicheId.replace(/_/g, "-")
    );
  if (!hit) {
    warnings.push(`niche_index_miss:${nicheId}`);
    return { nicheId, nichePack: null, warnings };
  }
  const nichePack = loadJson(path.join(DATABASE, hit.file));
  return { nicheId: nichePack.id, nichePack, warnings };
}

function resolvePlatform(raw) {
  if (!raw) return { platform: null, warnings: [] };
  const key = raw.toLowerCase();
  if (PLATFORM_ALIASES[key]) {
    return {
      platform: PLATFORM_ALIASES[key],
      warnings: [`platform_alias:${raw}->${PLATFORM_ALIASES[key]}`],
    };
  }
  return { platform: key, warnings: [] };
}

function scoreEntry(entry, q, recommendedIds) {
  let score = 0;
  const hay = [
    entry.id,
    entry.style,
    entry.funnel_stage,
    entry.production_tier,
    entry.virality_posture,
    ...(entry.platforms || []),
    ...(entry.niches || []),
    ...(entry.tags || []),
  ]
    .join(" ")
    .toLowerCase();

  if (q.id && entry.id === q.id) return 1000;

  if (q.platform && q.platform !== "any") {
    if ((entry.platforms || []).includes(q.platform)) score += 5;
    else if (
      q.platform === "meta" &&
      (entry.platforms || []).some((p) =>
        ["meta", "instagram", "facebook"].includes(p)
      )
    )
      score += 5;
    else score -= 2;
  }
  if (q.style) {
    const s = q.style.toLowerCase();
    if (
      entry.style === q.style ||
      (entry.style || "").includes(s) ||
      entry.id.includes(s.replace(/_/g, "-"))
    )
      score += 6;
  }
  if (q.funnel_stage && q.funnel_stage !== "any") {
    if (entry.funnel_stage === q.funnel_stage) score += 4;
  }
  if (q.production_tier && q.production_tier !== "any") {
    if (entry.production_tier === q.production_tier) score += 6;
    else if (
      q.production_tier.includes("high") &&
      (entry.tags || []).includes("high-production")
    )
      score += 4;
  }
  if (q.virality_posture && q.virality_posture !== "any") {
    if (entry.virality_posture === q.virality_posture) score += 6;
  }
  if (q.tag) {
    const t = q.tag.toLowerCase();
    if ((entry.tags || []).some((x) => x.toLowerCase().includes(t))) score += 8;
    if (t === "viral" && (entry.tags || []).includes("viral")) score += 4;
  }
  if (q.nicheResolved) {
    const n = q.nicheResolved.toLowerCase().replace(/-/g, "_");
    const n2 = q.nicheResolved.toLowerCase().replace(/_/g, "-");
    const nicheHit = (entry.niches || []).some((x) => {
      const xl = x.toLowerCase();
      return (
        xl === n ||
        xl === n2 ||
        xl.replace(/_/g, "-") === n2 ||
        xl.includes(n2) ||
        n2.includes(xl.replace(/_/g, "-"))
      );
    });
    if (nicheHit) score += 8;
  } else if (q.niche) {
    const n = q.niche.toLowerCase();
    if (
      (entry.niches || []).some(
        (x) => x.toLowerCase().includes(n) || n.includes(x.toLowerCase())
      )
    )
      score += 6;
    if (hay.includes(n)) score += 2;
  }

  // Penalize ultra-generic patterns unless tag/job hits
  if ((entry.niches || []).length >= 15 && !q.tag && !q.job) score -= 3;

  if (recommendedIds && recommendedIds.length) {
    const idx = recommendedIds.indexOf(entry.id);
    if (idx >= 0) score += 20 - Math.min(idx, 8) * 2;
  }

  if (q.job) {
    for (const token of q.job.toLowerCase().split(/\s+/).filter(Boolean)) {
      if (hay.includes(token)) score += 2;
    }
  }
  return score;
}

function main() {
  const q = parseArgs(process.argv);
  const index = loadJson(INDEX_PATH);
  const aliasIndex = buildAliasIndex(index);
  const warnings = [];

  if (q.list) {
    console.log(
      JSON.stringify(
        index.patterns.map((p) => ({
          id: p.id,
          style: p.style,
          funnel_stage: p.funnel_stage,
          production_tier: p.production_tier,
          virality_posture: p.virality_posture,
          platforms: p.platforms,
          niches: p.niches,
          tags: p.tags,
        })),
        null,
        2
      )
    );
    return;
  }

  if (q.listNiches) {
    console.log(JSON.stringify(index.niches, null, 2));
    return;
  }

  const { platform, warnings: pw } = resolvePlatform(q.platform);
  warnings.push(...pw);
  if (platform) q.platform = platform;

  const { nicheId, nichePack, warnings: nw } = resolveNiche(
    q.niche,
    aliasIndex,
    index
  );
  warnings.push(...nw);
  q.nicheResolved = nicheId;

  const recommendedIds = nichePack?.recommended_pattern_ids || [];

  const hasFilter = Boolean(
    q.platform ||
      q.style ||
      q.funnel_stage ||
      q.niche ||
      q.job ||
      q.id ||
      q.tag ||
      q.production_tier ||
      q.virality_posture
  );

  const ranked = index.patterns
    .map((p) => ({ entry: p, score: scoreEntry(p, q, recommendedIds) }))
    .filter((x) => (hasFilter ? x.score > 0 : true))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // tie-break: recommended rank, then id
      const ra = recommendedIds.indexOf(a.entry.id);
      const rb = recommendedIds.indexOf(b.entry.id);
      if (ra !== rb) {
        if (ra === -1) return 1;
        if (rb === -1) return -1;
        return ra - rb;
      }
      return a.entry.id.localeCompare(b.entry.id);
    });

  const maxScore = ranked[0]?.score ?? 0;
  let matchQuality = "ok";
  let picks;

  if (!ranked.length || maxScore <= 0) {
    matchQuality = "none";
    warnings.push("no_pattern_match");
    picks = [];
  } else {
    picks = ranked.slice(0, Math.min(Math.max(q.limit, 1), 15));
    if (q.niche && !nicheId) matchQuality = "fallback_unresolved_niche";
  }

  const results = picks.map(({ entry, score }) => {
    const full = loadJson(path.join(DATABASE, entry.file));
    return { score, blueprint: full };
  });

  let pipeline = null;
  if (fs.existsSync(PIPE_PATH)) {
    pipeline = loadJson(PIPE_PATH);
  }

  const primary = results[0]?.blueprint?.id || null;
  const challenger = results[1]?.blueprint?.id || null;
  let dualTwin = null;
  if (results.length) {
    // Never let dual-track twin equal the primary (cinema search used to include results[0])
    const cine = results.find(
      (r) =>
        r.blueprint?.id !== primary &&
        ["brand_film", "premium_cinema", "high_production"].some(
          (t) =>
            r.blueprint.virality_posture === t ||
            (r.blueprint.tags || []).includes("high-production") ||
            (r.blueprint.production_tier || "").includes("high") ||
            (r.blueprint.production_tier || "").includes("premium") ||
            (r.blueprint.production_tier || "").includes("cinema")
        )
    );
    const fallback = results.find((r) => r.blueprint?.id !== primary)?.blueprint
      ?.id;
    dualTwin =
      cine?.blueprint?.id ||
      (results[2]?.blueprint?.id !== primary
        ? results[2]?.blueprint?.id
        : null) ||
      (fallback !== challenger ? fallback : null) ||
      null;
  }

  const pickRoutes = {};
  for (const id of [primary, challenger, dualTwin].filter(Boolean)) {
    pickRoutes[id] = pipeline?.by_pattern?.[id] || {
      stack: pipeline?.defaults_by_posture?.evergreen_dr?.primary || [
        "seedance_2_5",
        "capcut",
      ],
      notes: "No by_pattern row — using evergreen default; fill route in pattern-to-pipeline.json",
    };
  }

  let swipeSignals = null;
  const swipePath = path.join(DB_ROOT, "references", "swipe-signals.json");
  if (fs.existsSync(swipePath)) {
    const swipe = loadJson(swipePath);
    const nicheKey = (nicheId || q.niche || "").toLowerCase();
    const nicheMatch = (n) =>
      n.niche.includes(nicheKey.replace(/-/g, "_")) ||
      n.niche.includes(nicheKey.replace(/_/g, "-")) ||
      nicheKey.includes(n.niche);

    let nicheHints = [];
    if (nicheKey) {
      nicheHints = (swipe.by_niche_hints || []).filter(nicheMatch);
    }

    // Optional local overlay (gitignored). See references/swipe-signals.md
    let privateMeta = { loaded: false, path: null };
    const privatePath =
      process.env.AD_INTEL_PRIVATE_SIGNALS ||
      path.join(DB_ROOT, "references", "private-signals.json");
    let privateFormats = [];
    let privateFailures = [];
    if (fs.existsSync(privatePath)) {
      try {
        const priv = loadJson(privatePath);
        privateMeta = { loaded: true, path: privatePath };
        if (nicheKey) {
          const privHints = (priv.by_niche_hints || []).filter(nicheMatch);
          nicheHints = [...privHints, ...nicheHints];
        }
        privateFormats = priv.by_format || [];
        privateFailures = priv.failure_mode_index || [];
      } catch {
        privateMeta = { loaded: false, path: privatePath, error: "parse_failed" };
      }
    }

    swipeSignals = {
      file: "references/swipe-signals.json",
      docs: "references/swipe-signals.md",
      note: "Anonymized longevity signals — optional; never invent metrics",
      niche_hints: nicheHints,
      niche_hints_status: nicheHints.length
        ? "matched"
        : nicheKey
          ? "none_for_niche"
          : "skipped",
      formats_high_longevity: nicheHints.length
        ? (swipe.by_format || [])
            .filter((f) => f.longevity === "high")
            .map((f) => f.format)
        : [],
      failure_mode_index: [
        ...(swipe.failure_mode_index || []),
        ...privateFailures,
      ],
      private: privateMeta,
      private_formats_count: privateFormats.length,
    };
  }

  const viralOs = loadJson(
    path.join(DATABASE, "trends/viral-operating-system.json")
  );

  const payload = {
    query: q,
    resolved: {
      niche_id: nicheId,
      platform: q.platform || null,
      match_quality: matchQuality,
    },
    warnings,
    count: results.length,
    picks: {
      primary,
      challenger,
      dual_track_twin: dualTwin,
      routes: pickRoutes,
    },
    results,
    niche: nichePack,
    swipe_signals: swipeSignals,
    viral_os_summary: {
      id: viralOs.id,
      trend_classes: viralOs.trend_classes.map((t) => t.id),
      file: "database/trends/viral-operating-system.json",
    },
    consistency_templates: [
      "references/creative-stack/product-sheet-template.md",
      "references/creative-stack/character-sheet-template.md",
    ],
    claim_firewall: "references/claim-firewall.json",
    brief_defaults: "references/brief-defaults.json",
    render_plan: "references/creative-stack/render-plan.md",
    anti_patterns_file: "database/anti-patterns.json",
    hooks_file: "database/hooks/library.json",
    flows_file: "database/flows/library.json",
  };

  console.log(JSON.stringify(payload, null, 2));

  if (matchQuality === "none") process.exitCode = 2;
}

main();
