#!/usr/bin/env node
/**
 * Retrieve ad blueprints + studies by platform / style / funnel / niche / tier / virality / job.
 *
 * Usage:
 *   node retrieve.mjs --niche beauty --tag viral --limit 5
 *   node retrieve.mjs --niche skincare --platform tiktok
 *   node retrieve.mjs --niche plumbing --limit 5
 *   node retrieve.mjs --production high_production --virality brand_film
 *   node retrieve.mjs --list
 *   node retrieve.mjs --list-niches
 *   node retrieve.mjs --niche beauty --platform tiktok --compact
 *
 * Compact payload includes studies (public corpus + optional studies/private/).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateStudy } from "./lib/validate-study.mjs";

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
  food: "food-bev",
  beverage: "food-bev",
  shampoo: "beauty",
  haircare: "beauty",
  "hair care": "beauty",
  hair: "beauty",
  conditioner: "beauty",
  skincare: "beauty",
  makeup: "beauty",
  cosmetics: "beauty",
  supplement: "health",
  supplements: "health",
  clinic: "health",
  crypto: "fintech",
  insurance: "fintech",
  banking: "fintech",
  coaching: "education",
  course: "education",
  wellness: "health",
  gym: "fitness",
  apparel: "fashion",
  shopify: "ecommerce",
  dtc: "ecommerce",
  "ai agent": "saas",
  "voice ai": "saas",
  "voice agent": "saas",
  chatbot: "saas",
  "ai ops": "saas",
  "ai assistant": "saas",
  llm: "saas",
  "b2b software": "saas",
  software: "saas",
  "mobile app": "apps",
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
  twitter: "x",
  "x.com": "x",
};

function parseArgs(argv) {
  const out = { limit: 5, list: false, listNiches: false, compact: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--list") out.list = true;
    else if (a === "--list-niches") out.listNiches = true;
    else if (a === "--compact") out.compact = true;
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

function normToken(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/_/g, "-");
}

function privateStudiesDir() {
  return (
    process.env.AD_INTEL_STUDIES_PRIVATE ||
    path.join(DB_ROOT, "studies", "private")
  );
}

/**
 * Load public + private studies. Invalid private files are NOT silently skipped —
 * they appear in errors and set a non-zero exit hint.
 */
function loadStudies() {
  const out = [];
  const errors = [];
  const corpusPath = path.join(DB_ROOT, "studies", "corpus.json");
  if (fs.existsSync(corpusPath)) {
    try {
      const corpus = loadJson(corpusPath);
      for (const s of corpus.studies || []) {
        if (!s?.id) {
          errors.push("public corpus entry missing id");
          continue;
        }
        const verr = validateStudy(s, { file: `corpus:${s.id}` });
        if (verr.length) {
          errors.push(...verr);
          continue;
        }
        out.push({ ...s, private: false, source: "public" });
      }
    } catch (e) {
      errors.push(`public corpus parse_failed: ${e.message}`);
    }
  }
  const privDir = privateStudiesDir();
  if (fs.existsSync(privDir)) {
    for (const f of fs.readdirSync(privDir)) {
      if (!f.endsWith(".json")) continue;
      const fp = path.join(privDir, f);
      try {
        const s = loadJson(fp);
        if (!s?.id) {
          errors.push(`private/${f}: missing id`);
          continue;
        }
        const verr = validateStudy(
          { ...s, private: true },
          { file: `private/${f}` }
        );
        if (verr.length) {
          errors.push(...verr);
          continue;
        }
        out.push({ ...s, private: true, source: `private/${f}` });
      } catch (e) {
        errors.push(`private/${f}: parse_failed (${e.message})`);
      }
    }
  }
  return { studies: out, errors };
}

function scoreStudy(study, q, pickIds, amIds) {
  let score = 0;
  const nicheNorm = normToken(q.nicheResolved || q.niche);
  const plat = (q.platform || "").toLowerCase();

  if (nicheNorm) {
    const nicheHit = (study.niches || []).some((n) => {
      const nn = normToken(n);
      return (
        nn === nicheNorm ||
        nn.includes(nicheNorm) ||
        nicheNorm.includes(nn)
      );
    });
    if (nicheHit) score += 8;
    else score -= 1;
  }

  if (plat) {
    if (
      (study.platforms || []).some(
        (p) => p === plat || p.includes(plat) || plat.includes(p)
      )
    )
      score += 5;
    else score -= 1;
  }

  for (const pid of study.pattern_ids || []) {
    if (pickIds.has(pid)) score += 6;
  }
  for (const aid of study.attention_model_ids || []) {
    if (amIds.has(aid)) score += 5;
  }

  if (q.tag) {
    const t = q.tag.toLowerCase();
    const hay = `${study.class || ""} ${study.title || ""}`.toLowerCase();
    if (hay.includes(t)) score += 3;
    if (t === "viral" && study.class === "viral_native") score += 4;
    if (t === "award" && study.class === "award_brand_film") score += 4;
  }

  if (q.job) {
    const hay = [
      study.title,
      study.class,
      ...(study.when_to_emulate || []),
      ...(study.steal || []),
    ]
      .join(" ")
      .toLowerCase();
    for (const token of q.job.toLowerCase().split(/\s+/).filter(Boolean)) {
      if (hay.includes(token)) score += 2;
    }
  }

  // Query-token affinity (voice/hair/food) — same spirit as attention ranking
  const qRaw = `${q.niche || ""} ${nicheNorm} ${q.job || ""}`.toLowerCase();
  const mid = `${study.id} ${study.title}`.toLowerCase();
  if (/voice|missed.?call|front.?desk|after.?hours|oply/.test(qRaw)) {
    if (/voice_agent|missed_call/.test(study.id)) score += 10;
    else if (/pas_meta|ui_aha/.test(study.id)) score += 2;
  } else if (/saas|software|b2b/.test(qRaw) && /pas|ui|voice|listicle|text_first/.test(mid)) {
    score += 3;
  }
  if (/hair|shampoo|conditioner/.test(qRaw) && /beauty_macro|hair/.test(mid)) score += 8;
  else if (/beauty|skincare|makeup/.test(qRaw) && /beauty|macro|confession|hero/.test(mid))
    score += 4;
  if (/food|snack|coffee|beverage|restaurant/.test(qRaw) && /food|crave|asmr/.test(mid))
    score += 6;
  else if (
    nicheNorm === "ecommerce" &&
    /food_crave|food \//.test(mid) &&
    !/food|snack|coffee|beverage/.test(qRaw)
  )
    score -= 5;
  if (/local|plumb|hvac|dentist|clinic/.test(qRaw) && /local|geo/.test(mid))
    score += 6;
  if (
    nicheNorm === "ecommerce" &&
    !/food|snack|coffee/.test(qRaw) &&
    /hero_spectacle|macro_transform|confession/.test(study.id)
  )
    score += 3;

  if (study.private) score += 2;
  if (study.provenance?.observed === true) score += 4;
  return score;
}

function compactStudy(study) {
  const fmt = study.structure?.format || null;
  const timingObservable =
    typeof study.structure?.timing_observable === "boolean"
      ? study.structure.timing_observable
      : fmt === "video_timed";
  const nonVideo =
    fmt === "search_text" ||
    fmt === "display_static" ||
    fmt === "carousel_static" ||
    timingObservable === false;

  return {
    id: study.id,
    class: study.class,
    title: study.title,
    private: !!study.private,
    provenance: study.provenance || null,
    // First-class — do not bury "no video" only inside provenance prose
    observed_limits: study.provenance?.observed_limits || null,
    format: fmt,
    timing_observable: timingObservable,
    when_to_emulate: (study.when_to_emulate || []).slice(0, 4),
    when_not: (study.when_not || []).slice(0, 3),
    steal: study.steal || [],
    never_copy: study.never_copy || [],
    attention_model_ids: study.attention_model_ids || [],
    pattern_ids: study.pattern_ids || [],
    structure: study.structure
      ? {
          format: fmt,
          timing_observable: timingObservable,
          duration_s: nonVideo ? null : study.structure.duration_s ?? null,
          hook_0_3: study.structure.hook_0_3,
          beats: (study.structure.beats || []).slice(0, 8),
          format_note: nonVideo
            ? "NOT video timing — do not invent 0–3s / motion / audio from these beats. Use a video_timed study or attention model for cuts."
            : null,
        }
      : null,
    human_build: study.human_build || [],
    human_build_log: study.human_build_log || null,
    research_where: study.research_where || null,
    gold_fixture: study.gold_fixture || null,
  };
}

function reconcileJoin(primaryPattern, study, attentionPrimary) {
  const studyPatterns = study?.pattern_ids || [];
  const overlap = studyPatterns.includes(primaryPattern);
  const conflict = Boolean(
    primaryPattern && studyPatterns.length && !overlap
  );
  return {
    layers: {
      patterns: "grammar / stack routes (database/patterns)",
      attention_models: "second-by-second timing sheets",
      studies: "emulate structure + human_build playbook — check provenance",
    },
    precedence: [
      "private observed (ad-library|named-campaign|owned-ad)",
      "public observed",
      "synthesis studies (structure only — not proof)",
      "patterns alone",
    ],
    rule: "Patterns = grammar + routes. Studies = what to emulate + how to build; provenance.basis must be copied into the package. Attention models = timing. When study.pattern_ids miss picks.primary, keep pattern for stack/route and study.structure for beat jobs — do not invent a merge. Never treat basis:synthesis as observed metrics proof.",
    primary_pattern: primaryPattern || null,
    primary_study: study?.id || null,
    attention_model: attentionPrimary || null,
    pattern_study_overlap: overlap,
    pattern_study_conflict: conflict,
    conflict_resolution: conflict
      ? "Use study.structure for beats/hook jobs; use picks.routes[primary] for tool stack; note conflict in package Retrieval."
      : "Aligned or no study patterns — use study beats + pattern route together.",
  };
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

  const nicheKey = (nicheId || q.niche || "").toLowerCase();
  const nicheMatch = (n) =>
    n.niche.includes(nicheKey.replace(/-/g, "_")) ||
    n.niche.includes(nicheKey.replace(/_/g, "-")) ||
    nicheKey.includes(n.niche);

  let swipeSignals = null;
  const swipePath = path.join(DB_ROOT, "references", "swipe-signals.json");
  if (fs.existsSync(swipePath)) {
    const swipe = loadJson(swipePath);

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

  let attentionModels = null;
  const attentionPath = path.join(
    DB_ROOT,
    "references",
    "attention-models.json"
  );
  if (fs.existsSync(attentionPath)) {
    const am = loadJson(attentionPath);
    const plat = (q.platform || "").toLowerCase();
    const nicheNorm = nicheKey.replace(/-/g, "_");
    const pickIds = new Set(
      [primary, challenger, dualTwin].filter(Boolean)
    );
    const matched = (am.models || [])
      .map((m) => {
        const nicheOk =
          !nicheNorm ||
          (m.niches || []).some(
            (n) =>
              n === nicheNorm ||
              n.replace(/_/g, "-") === nicheKey ||
              nicheNorm.includes(n) ||
              n.includes(nicheNorm)
          );
        const platOk =
          !plat ||
          (m.platforms || []).some(
            (p) => p === plat || p.includes(plat) || plat.includes(p)
          );
        if (!nicheOk || !platOk) return null;
        let score = 0;
        for (const pid of m.pattern_ids || []) {
          if (pickIds.has(pid)) score += 5;
        }
        const nicheHits = (m.niches || []).filter(
          (n) =>
            n === nicheNorm ||
            n.replace(/_/g, "-") === nicheKey ||
            nicheNorm.includes(n)
        ).length;
        score += nicheHits * 2;
        // Prefer tighter niche lists (specialist models over universal UGC)
        score += Math.max(0, 8 - (m.niches || []).length);
        if (m.gold_fixture) score += 3;
        if (plat && (m.platforms || []).includes(plat)) score += 1;
        // Query-token affinity — don't let hair specialist win every beauty query
        const qRaw = `${q.niche || ""} ${nicheKey}`.toLowerCase();
        const mid = `${m.id} ${m.name}`.toLowerCase();
        if (/hair|shampoo|conditioner/.test(qRaw) && /hair/.test(mid)) score += 8;
        else if (!/hair|shampoo|conditioner/.test(qRaw) && /hair_transform|hair \//.test(mid))
          score -= 6;
        if (/food|snack|coffee|beverage|restaurant/.test(qRaw) && /food|crave|asmr/.test(mid))
          score += 6;
        else if (
          nicheNorm === "ecommerce" &&
          /food_crave|food \//.test(mid) &&
          !/food|snack|coffee/.test(qRaw)
        )
          score -= 4;
        if (/voice|agent|saas|software/.test(qRaw) && /voice|ui_aha|pas_pain/.test(mid))
          score += 4;
        return { m, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.m);
    const libs = (am.public_libraries || []).filter(
      (lib) =>
        !plat ||
        (lib.platforms || []).some(
          (p) => p === plat || p.includes(plat) || plat.includes(p)
        )
    );
    attentionModels = {
      file: "references/attention-models.json",
      docs: "references/ad-libraries.md",
      lab: "examples/visual/attention-lab.html",
      emulate: "prompts/emulate-attention-model.md",
      note: "Teachable timing/shot models — emulate structure; research live ads via public libraries only",
      primary: matched[0]?.id || null,
      challenger: matched[1]?.id || null,
      count: matched.length,
      models: matched.slice(0, 6).map((m) => ({
        id: m.id,
        name: m.name,
        style_id: m.style_id,
        pattern_ids: m.pattern_ids,
        ideal_seconds: m.ideal_seconds,
        why_stops_scroll: m.why_stops_scroll,
        timing: m.timing,
        anti_slop: m.anti_slop,
        gold_fixture: m.gold_fixture || null,
      })),
      research: (libs.length ? libs : am.public_libraries || []).map((lib) => ({
        id: lib.id,
        name: lib.name,
        url: lib.url,
        how: lib.how,
        platforms: lib.platforms,
      })),
    };
  }

  const viralOs = loadJson(
    path.join(DATABASE, "trends/viral-operating-system.json")
  );

  const pickIds = new Set(
    [primary, challenger, dualTwin].filter(Boolean)
  );
  const amIds = new Set(
    (attentionModels?.models || []).map((m) => m.id).filter(Boolean)
  );
  if (attentionModels?.primary) amIds.add(attentionModels.primary);
  if (attentionModels?.challenger) amIds.add(attentionModels.challenger);

  const { studies: allStudies, errors: studyErrors } = loadStudies();
  if (studyErrors.length) {
    warnings.push(...studyErrors.map((e) => `study_invalid:${e}`));
  }

  const nicheNormForStudy = normToken(nicheId || q.niche || "");
  const studyNicheHit = (study) =>
    !nicheNormForStudy ||
    (study.niches || []).some((n) => {
      const nn = normToken(n);
      return (
        nn === nicheNormForStudy ||
        nn.includes(nicheNormForStudy) ||
        nicheNormForStudy.includes(nn)
      );
    });

  const rankedStudies = allStudies
    .map((s) => ({ study: s, score: scoreStudy(s, q, pickIds, amIds) }))
    .filter((x) => {
      if (x.score <= 0) return false;
      // Niche resolved → require niche alignment (else empty / loud none)
      if (nicheNormForStudy && !studyNicheHit(x.study)) return false;
      return true;
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Prefer observed over synthesis when scores tie
      const ao = a.study.provenance?.observed ? 1 : 0;
      const bo = b.study.provenance?.observed ? 1 : 0;
      if (ao !== bo) return bo - ao;
      return a.study.id.localeCompare(b.study.id);
    });

  const primaryStudy = rankedStudies[0]?.study || null;
  const primaryNicheHit = Boolean(primaryStudy && studyNicheHit(primaryStudy));
  let studyMatchStatus = "ok";
  if (!rankedStudies.length) {
    studyMatchStatus = "none_for_query";
    warnings.push(
      "no_study_match:NO STUDY matched this niche/platform — do not invent a study id; use patterns + attention models only, or ingest a private observed study via ingest-blueprint.mjs"
    );
  } else if (nicheNormForStudy && !primaryNicheHit) {
    studyMatchStatus = "weak_no_niche_hit";
    warnings.push(
      `study_niche_weak:primary study ${primaryStudy.id} niches do not include ${nicheNormForStudy} — weak match; do not invent observed evidence`
    );
  }

  const studiesPayload = {
    file: "studies/corpus.json",
    docs: "studies/README.md",
    human_build_os: "references/human-build-os.md",
    human_build_log_template: "references/human-build-log.template.md",
    ingest: "scripts/ingest-blueprint.mjs",
    emulate: "prompts/emulate-attention-model.md",
    note: "Check provenance on every study. basis:synthesis = structure only — never launder into proof. Private observed: studies/private/ via ingest-blueprint.mjs.",
    match_status: studyMatchStatus,
    loud:
      studyMatchStatus === "none_for_query"
        ? "NO STUDY for this niche/platform. Do not invent one. Patterns + attention models only, or ingest private observed."
        : studyMatchStatus === "weak_no_niche_hit"
          ? `WEAK STUDY MATCH (niche miss). Primary ${primaryStudy?.id} is not niche-aligned — treat as structure hint only.`
          : null,
    primary: primaryStudy?.id || null,
    challenger: rankedStudies[1]?.study?.id || null,
    count: rankedStudies.length,
    errors: studyErrors,
    join: reconcileJoin(
      primary,
      primaryStudy,
      attentionModels?.primary || null
    ),
    items: rankedStudies.slice(0, 5).map((x) => ({
      score: x.score,
      ...compactStudy(x.study),
    })),
  };

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
    attention_models: attentionModels,
    studies: studiesPayload,
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
    brief_from_url: "prompts/brief-from-url.md",
    render_plan: "references/creative-stack/render-plan.md",
    anti_patterns_file: "database/anti-patterns.json",
    hooks_file: "database/hooks/library.json",
    flows_file: "database/flows/library.json",
    human_build_os: "references/human-build-os.md",
  };

  if (q.compact) {
    const compact = {
      resolved: payload.resolved,
      warnings,
      picks: payload.picks,
      attention_models: attentionModels
        ? {
            primary: attentionModels.primary,
            challenger: attentionModels.challenger,
            models: attentionModels.models.map((m) => ({
              id: m.id,
              name: m.name,
              why_stops_scroll: m.why_stops_scroll,
              pattern_ids: m.pattern_ids,
              ideal_seconds: m.ideal_seconds,
              timing: m.timing,
              anti_slop: m.anti_slop,
            })),
            research: attentionModels.research,
            lab: attentionModels.lab,
            emulate: attentionModels.emulate,
          }
        : null,
      studies: {
        primary: studiesPayload.primary,
        challenger: studiesPayload.challenger,
        count: studiesPayload.count,
        match_status: studiesPayload.match_status,
        loud: studiesPayload.loud,
        human_build_os: studiesPayload.human_build_os,
        human_build_log_template: studiesPayload.human_build_log_template,
        ingest: studiesPayload.ingest,
        join: studiesPayload.join,
        errors: studiesPayload.errors,
        items: studiesPayload.items.slice(0, 5).map((s) => ({
          id: s.id,
          class: s.class,
          title: s.title,
          provenance: s.provenance,
          format: s.format,
          timing_observable: s.timing_observable,
          observed_limits: s.observed_limits,
          when_to_emulate: s.when_to_emulate,
          steal: s.steal,
          never_copy: s.never_copy,
          structure: s.structure,
          human_build: s.human_build,
          attention_model_ids: s.attention_model_ids,
          pattern_ids: s.pattern_ids,
          private: s.private,
        })),
      },
      results: results.map((r) => ({
        id: r.blueprint?.id,
        score: r.score,
        name: r.blueprint?.name,
        niches: r.blueprint?.niches,
        platforms: r.blueprint?.platforms,
        production_tier: r.blueprint?.production_tier,
        virality_posture: r.blueprint?.virality_posture,
        ideal_seconds: r.blueprint?.ideal_seconds || r.blueprint?.duration_s,
        hook: (r.blueprint?.hook_examples || r.blueprint?.hooks || [])
          .slice(0, 2),
        beats: (r.blueprint?.beats || []).slice(0, 6),
      })),
      next: "Pick study + attention model → emulate structure → human_build → Concept + ≥6-row script → finish-the-cut → lint (prompts/one-shot.md)",
    };
    console.log(JSON.stringify(compact, null, 2));
  } else {
    console.log(JSON.stringify(payload, null, 2));
  }

  if (matchQuality === "none") process.exitCode = 2;
  // Loud failure: invalid private/public studies must not silently degrade
  if (studyErrors.length) process.exitCode = process.exitCode || 3;
}

main();
