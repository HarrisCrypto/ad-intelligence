#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.join(__dirname, "..");
const root = path.join(packageRoot, "skills/ad-intelligence/database");
const patternsDir = path.join(root, "patterns");
const schema = JSON.parse(
  fs.readFileSync(path.join(packageRoot, "schema/ad-blueprint.schema.json"), "utf8")
);
const styleEnum = schema.properties.style.enum;
const platformEnum = schema.properties.platforms.items.enum;
const ctaEnum = schema.properties.cta.properties.type.enum;
const deliverableEnum =
  schema.properties.output_contract.properties.deliverables.items.enum;
const funnelEnum = schema.properties.funnel_stage.enum;

const patterns = [];
const errors = [];
for (const file of fs
  .readdirSync(patternsDir)
  .filter((f) => f.endsWith(".json"))
  .sort()) {
  const full = path.join(patternsDir, file);
  const j = JSON.parse(fs.readFileSync(full, "utf8"));
  if (!styleEnum.includes(j.style)) errors.push(`${file}: bad style ${j.style}`);
  for (const p of j.platforms || []) {
    if (!platformEnum.includes(p)) errors.push(`${file}: bad platform ${p}`);
  }
  if (!funnelEnum.includes(j.funnel_stage)) {
    errors.push(`${file}: bad funnel ${j.funnel_stage}`);
  }
  if (j.cta?.type && !ctaEnum.includes(j.cta.type)) {
    if (j.cta.type === "lead_magnet_value") {
      j.cta.type = "waitlist";
      fs.writeFileSync(full, JSON.stringify(j, null, 2) + "\n");
    } else errors.push(`${file}: bad cta ${j.cta.type}`);
  }
  for (const d of j.output_contract?.deliverables || []) {
    if (!deliverableEnum.includes(d)) errors.push(`${file}: bad deliverable ${d}`);
  }
  patterns.push({
    id: j.id,
    file: `patterns/${file}`,
    style: j.style,
    funnel_stage: j.funnel_stage,
    platforms: j.platforms,
    niches: j.niches,
    production_tier: j.production_tier,
    virality_posture: j.virality_posture,
    tags: [
      j.production_tier,
      j.virality_posture,
      j.style,
      ...(j.virality_posture === "trend_reactive" ||
      j.virality_posture === "share_engineered"
        ? ["viral"]
        : []),
      ...(j.production_tier === "high_production" ||
      j.production_tier === "premium_cinema"
        ? ["high-production"]
        : []),
    ].filter(Boolean),
  });
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const niches = [
  {
    id: "beauty",
    niche: "beauty",
    aliases: ["skincare", "makeup", "hair"],
    audience:
      "Appearance-conscious shoppers who respond to texture, transformation, and creator trust.",
    jobs_to_be_done: [
      "Prove visible result fast",
      "Win with UGC + macro lust",
      "Seed creators",
    ],
    recommended_pattern_ids: [
      "beauty-macro-tabletop",
      "before-after-reveal",
      "grwm-soft-sell",
      "ugc-talking-head-scroll-stop",
      "influencer-collab-brief",
      "vfx-transformation",
    ],
    angles: [
      {
        id: "texture-lust",
        hook_seed: "Macro shine/spread mid-motion",
        pattern: "beauty-macro-tabletop",
      },
      {
        id: "routine-pov",
        hook_seed: "POV: your skin finally…",
        pattern: "pov-day-in-life",
      },
    ],
    lexicon: {
      use: ["finish", "texture", "shade", "routine", "patch test honesty"],
      avoid_unless_true: [
        "dermatologist-approved",
        "guaranteed results",
        "medical claims",
      ],
    },
    proof_types: [
      "before/after",
      "UGC demos",
      "ingredient callouts you can substantiate",
    ],
    cta_defaults: ["Shop", "Shade finder", "Creator code"],
    landing_notes: "Match shade/SKU shown.",
  },
  {
    id: "fashion",
    niche: "fashion",
    aliases: ["apparel", "streetwear", "luxury_fashion"],
    audience: "Style-driven browsers; aspiration + fit/identity.",
    jobs_to_be_done: [
      "Make the fit/world desirable",
      "Drop energy",
      "Editorial authority",
    ],
    recommended_pattern_ids: [
      "fashion-editorial-film",
      "hero-product-film",
      "grwm-soft-sell",
      "music-video-brand",
      "challenge-participation",
      "launch-teaser",
    ],
    angles: [
      {
        id: "drop-tease",
        hook_seed: "Silhouette reveal + date",
        pattern: "launch-teaser",
      },
    ],
    lexicon: {
      use: ["fit", "fabric", "edit", "drop"],
      avoid_unless_true: ["celebrity worn without rights"],
    },
    proof_types: ["lookbook motion", "fit UGC", "sold-out social proof"],
    cta_defaults: ["Shop the edit", "Notify me"],
    landing_notes: "Collection consistency.",
  },
  {
    id: "fitness",
    niche: "fitness",
    aliases: ["gym", "wellness_training"],
    audience: "Goal-oriented; responds to struggle→win and programs.",
    jobs_to_be_done: [
      "Motivate identity shift",
      "Sell program/app",
      "Challenge flywheel",
    ],
    recommended_pattern_ids: [
      "performance-sports-cine",
      "challenge-participation",
      "before-after-reveal",
      "pov-day-in-life",
      "offer-urgency",
      "hot-take-controversy",
    ],
    angles: [
      {
        id: "unpopular-training",
        hook_seed: "Unpopular opinion about recovery/volume",
        pattern: "hot-take-controversy",
      },
    ],
    lexicon: {
      use: ["program", "consistency", "form", "PR"],
      avoid_unless_true: ["lose X lbs guaranteed"],
    },
    proof_types: [
      "transformation with disclaimer",
      "workout clips",
      "app streaks",
    ],
    cta_defaults: ["Start free", "Join challenge"],
    landing_notes: "Program match.",
  },
  {
    id: "food-bev",
    niche: "food_bev",
    aliases: ["cpg", "beverage", "restaurant", "dtc_food"],
    audience: "Craving + culture; ASMR and skits convert.",
    jobs_to_be_done: ["Trigger craving", "Own a cultural bit", "Drive trial"],
    recommended_pattern_ids: [
      "beauty-macro-tabletop",
      "skit-sketch-ad",
      "street-interview",
      "product-loop-demo",
      "meme-native-trend",
      "cultural-moment",
    ],
    angles: [
      {
        id: "first-sip",
        hook_seed: "Cold open on pour/crunch",
        pattern: "unboxing-asmr",
      },
    ],
    lexicon: {
      use: ["crave", "batch", "recipe", "limited drop"],
      avoid_unless_true: ["healthy halo without substantiation"],
    },
    proof_types: ["macro food", "taste tests", "sold-out drops"],
    cta_defaults: ["Order", "Find near you"],
    landing_notes: "Same SKU/flavor.",
  },
  {
    id: "ecommerce",
    niche: "ecommerce",
    aliases: ["dtc", "shopify", "cpg_general"],
    audience: "Cold social shoppers needing thumbstop + clarity.",
    jobs_to_be_done: ["Demo benefit fast", "UGC trust", "Offer conversion"],
    recommended_pattern_ids: [
      "product-loop-demo",
      "ugc-talking-head-scroll-stop",
      "offer-urgency",
      "social-proof-stack",
      "comparison-vs",
      "unboxing-asmr",
    ],
    angles: [
      {
        id: "failed-alt",
        hook_seed: "I tried everything else…",
        pattern: "ugc-talking-head-scroll-stop",
      },
    ],
    lexicon: {
      use: ["specific benefit verbs", "time saved"],
      avoid_unless_true: ["#1 bestseller", "guaranteed"],
    },
    proof_types: ["UGC", "reviews", "demo loops"],
    cta_defaults: ["Shop now"],
    landing_notes: "SKU/offer match.",
  },
  {
    id: "saas",
    niche: "saas",
    aliases: ["b2b_software", "software"],
    audience: "Operators skeptical of feature dumps.",
    jobs_to_be_done: ["Name workflow pain", "Show mechanism", "Book demo/trial"],
    recommended_pattern_ids: [
      "pas-pain-stack",
      "motion-design-explainer",
      "app-demo-ui",
      "listicle-text-overlay",
      "green-screen-rant",
      "objection-faq",
    ],
    angles: [
      {
        id: "workflow-tax",
        hook_seed: "Hours lost to handoffs",
        pattern: "pas-pain-stack",
      },
    ],
    lexicon: {
      use: ["workflow", "time-to-value", "source of truth"],
      avoid_unless_true: ["AI-powered without mechanism", "10x"],
    },
    proof_types: ["UI demo", "case metrics you own", "logo rights"],
    cta_defaults: ["Start free", "Book demo"],
    landing_notes: "Same workflow demo.",
  },
  {
    id: "fintech",
    niche: "fintech",
    aliases: ["finance", "banking", "crypto_app"],
    audience: "Trust-sensitive; clarity and compliance matter.",
    jobs_to_be_done: ["Demystify money task", "Build trust", "Drive app install"],
    recommended_pattern_ids: [
      "kinetic-type-explainer",
      "app-demo-ui",
      "green-screen-rant",
      "social-proof-stack",
      "skit-sketch-ad",
      "objection-faq",
    ],
    angles: [
      {
        id: "money-myth",
        hook_seed: "Myth about fees/credit/investing",
        pattern: "green-screen-rant",
      },
    ],
    lexicon: {
      use: ["clear fees language", "time-to-funded"],
      avoid_unless_true: ["guaranteed returns", "get rich"],
    },
    proof_types: ["regulated disclosures", "UI clarity", "real support stories"],
    cta_defaults: ["Get started"],
    landing_notes: "Compliant disclosures.",
  },
  {
    id: "gaming",
    niche: "gaming",
    aliases: ["games", "esports"],
    audience: "Entertainment-first; trailers and clips.",
    jobs_to_be_done: ["Show fantasy/power fantasy", "Clip bait", "Install/wishlists"],
    recommended_pattern_ids: [
      "hero-product-film",
      "vfx-transformation",
      "music-video-brand",
      "series-cliffhanger",
      "challenge-participation",
      "cgi-3d-product",
    ],
    angles: [
      {
        id: "gameplay-hook",
        hook_seed: "Best 3s of gameplay cold open",
        pattern: "hero-product-film",
      },
    ],
    lexicon: {
      use: ["season", "drop", "mode", "clip"],
      avoid_unless_true: ["best game ever"],
    },
    proof_types: ["gameplay", "creator clips", "wishlist spikes"],
    cta_defaults: ["Play now", "Wishlist"],
    landing_notes: "Store page trailer match.",
  },
  {
    id: "education",
    niche: "education",
    aliases: ["info_products", "edtech", "courses"],
    audience: "Outcome learners; frameworks and proof.",
    jobs_to_be_done: [
      "Teach a useful slice",
      "Sell course/community",
      "Lead magnet",
    ],
    recommended_pattern_ids: [
      "listicle-text-overlay",
      "save-share-bait",
      "lead-magnet-value",
      "hot-take-controversy",
      "podcast-clip-ad",
      "series-cliffhanger",
    ],
    angles: [
      {
        id: "checklist",
        hook_seed: "Save this checklist before…",
        pattern: "save-share-bait",
      },
    ],
    lexicon: {
      use: ["framework", "worksheet", "cohort"],
      avoid_unless_true: ["make $X guaranteed"],
    },
    proof_types: ["student outcomes with permission", "curriculum previews"],
    cta_defaults: ["Enroll", "Free lesson"],
    landing_notes: "Syllabus clarity.",
  },
  {
    id: "travel",
    niche: "travel",
    aliases: ["hospitality", "tourism", "airlines"],
    audience: "Dreamers then bookers; cinematic + utility.",
    jobs_to_be_done: [
      "Sell the feeling of place",
      "Deal urgency",
      "Itinerary utility",
    ],
    recommended_pattern_ids: [
      "cinematic-brand-spot",
      "hero-product-film",
      "save-share-bait",
      "pov-day-in-life",
      "offer-urgency",
      "cultural-moment",
    ],
    angles: [
      {
        id: "place-lust",
        hook_seed: "One impossible beautiful frame of place",
        pattern: "cinematic-brand-spot",
      },
    ],
    lexicon: {
      use: ["itinerary", "season", "nonstop"],
      avoid_unless_true: ["cheapest forever"],
    },
    proof_types: ["owned footage", "guest UGC", "price honesty"],
    cta_defaults: ["Book", "Explore"],
    landing_notes: "Same destination/dates.",
  },
  {
    id: "real-estate",
    niche: "real_estate",
    aliases: ["property", "homes"],
    audience: "High consideration; trust + walkthrough desire.",
    jobs_to_be_done: ["Tour desire", "Agent trust", "Lead forms"],
    recommended_pattern_ids: [
      "cinematic-brand-spot",
      "listicle-text-overlay",
      "local-service-trust",
      "lead-magnet-value",
      "founder-story-origin",
      "text-story-slideshow",
    ],
    angles: [
      {
        id: "open-house-film",
        hook_seed: "Walk-in hero shot",
        pattern: "cinematic-brand-spot",
      },
    ],
    lexicon: {
      use: ["beds/baths truth", "neighborhood"],
      avoid_unless_true: ["investment guarantees"],
    },
    proof_types: ["tours", "sold testimonials"],
    cta_defaults: ["Book tour", "Get list"],
    landing_notes: "MLS-accurate facts.",
  },
  {
    id: "health",
    niche: "health",
    aliases: ["wellness", "clinic", "supplement"],
    audience: "Careful; claims constrained; empathy + proof.",
    jobs_to_be_done: [
      "Educate safely",
      "Book consult",
      "Supplement trial with compliance",
    ],
    recommended_pattern_ids: [
      "documentary-cutdown",
      "objection-faq",
      "ugc-talking-head-scroll-stop",
      "green-screen-rant",
      "social-proof-stack",
      "lead-magnet-value",
    ],
    angles: [
      {
        id: "symptom-scene",
        hook_seed: "Specific daily friction scene",
        pattern: "ugc-talking-head-scroll-stop",
      },
    ],
    lexicon: {
      use: ["talk to your clinician", "studied ingredients with citations"],
      avoid_unless_true: ["cures", "diagnoses", "disease claims"],
    },
    proof_types: ["compliant studies", "patient stories with releases"],
    cta_defaults: ["Book", "Learn"],
    landing_notes: "Disclaimers.",
  },
  {
    id: "pets",
    niche: "pets",
    aliases: ["petcare", "petfood"],
    audience: "Emotional pet parents; cute + problem solve.",
    jobs_to_be_done: ["Cute thumbstop", "Solve a pet pain", "Subscribe"],
    recommended_pattern_ids: [
      "product-loop-demo",
      "skit-sketch-ad",
      "ugc-talking-head-scroll-stop",
      "before-after-reveal",
      "meme-native-trend",
      "offer-urgency",
    ],
    angles: [
      {
        id: "pet-pov",
        hook_seed: "POV of your dog when…",
        pattern: "pov-day-in-life",
      },
    ],
    lexicon: {
      use: ["vet-formulated only if true", "coat/energy specifics"],
      avoid_unless_true: ["human-grade misuse", "medical cures"],
    },
    proof_types: ["pet UGC", "feeding demos"],
    cta_defaults: ["Subscribe", "Shop"],
    landing_notes: "Same product.",
  },
  {
    id: "home",
    niche: "home",
    aliases: ["diy", "furniture", "home_services_product"],
    audience: "Project and upgrade shoppers.",
    jobs_to_be_done: [
      "Show install/result",
      "Satisfy demo",
      "Local service trust if service",
    ],
    recommended_pattern_ids: [
      "before-after-reveal",
      "product-loop-demo",
      "listicle-text-overlay",
      "save-share-bait",
      "pas-pain-stack",
      "local-service-trust",
    ],
    angles: [
      {
        id: "weekend-project",
        hook_seed: "Before the weekend / after",
        pattern: "before-after-reveal",
      },
    ],
    lexicon: {
      use: ["install time", "tools needed"],
      avoid_unless_true: ["forever warranty fluff"],
    },
    proof_types: ["timelapse", "customer installs"],
    cta_defaults: ["Shop", "Book install"],
    landing_notes: "Specs match.",
  },
  {
    id: "apps",
    niche: "apps",
    aliases: ["mobile_app", "consumer_software"],
    audience: "Need aha-in-seconds.",
    jobs_to_be_done: ["Show core loop", "Trend seed", "Install"],
    recommended_pattern_ids: [
      "app-demo-ui",
      "meme-native-trend",
      "vfx-transformation",
      "skit-sketch-ad",
      "series-cliffhanger",
      "influencer-collab-brief",
    ],
    angles: [
      {
        id: "aha-tap",
        hook_seed: "First tap completes the fantasy",
        pattern: "app-demo-ui",
      },
    ],
    lexicon: {
      use: ["in seconds", "core action verb"],
      avoid_unless_true: ["#1 app without evidence"],
    },
    proof_types: ["UI demos", "creator gameplay", "ratings you own"],
    cta_defaults: ["Download"],
    landing_notes: "Store creative match.",
  },
  {
    id: "b2b-services",
    niche: "b2b_services",
    aliases: ["agency", "consulting", "professional_services"],
    audience: "Buyers of expertise; case proof matters.",
    jobs_to_be_done: ["Point at expensive problem", "Show method", "Book call"],
    recommended_pattern_ids: [
      "pas-pain-stack",
      "founder-story-origin",
      "documentary-cutdown",
      "hot-take-controversy",
      "lead-magnet-value",
      "testimonial-montage-cine",
    ],
    angles: [
      {
        id: "costly-process",
        hook_seed: "The meeting that wastes budget",
        pattern: "pas-pain-stack",
      },
    ],
    lexicon: {
      use: ["process", "retainer clarity", "outcomes"],
      avoid_unless_true: ["guaranteed ROI"],
    },
    proof_types: ["case studies", "named logos with rights"],
    cta_defaults: ["Book a call"],
    landing_notes: "Case study depth.",
  },
  {
    id: "creator",
    niche: "creator",
    aliases: ["influencer", "personal_brand"],
    audience: "Followers who buy identity and tools.",
    jobs_to_be_done: ["Grow follows via series", "Monetize offers", "Brand collabs"],
    recommended_pattern_ids: [
      "series-cliffhanger",
      "hot-take-controversy",
      "bts-making-of",
      "podcast-clip-ad",
      "save-share-bait",
      "grwm-soft-sell",
    ],
    angles: [
      {
        id: "part-one",
        hook_seed: "Part 1 — I almost quit",
        pattern: "series-cliffhanger",
      },
    ],
    lexicon: {
      use: ["series", "community", "behind the scenes"],
      avoid_unless_true: ["fake milestone counts"],
    },
    proof_types: ["audience UGC", "process"],
    cta_defaults: ["Follow", "Join", "Shop"],
    landing_notes: "Link-in-bio consistency.",
  },
  {
    id: "entertainment",
    niche: "entertainment",
    aliases: ["film", "music", "streaming", "events"],
    audience: "Culture seekers; trailers and moments.",
    jobs_to_be_done: ["Trailer energy", "Clip virality", "Tickets/streams"],
    recommended_pattern_ids: [
      "launch-teaser",
      "music-video-brand",
      "cultural-moment",
      "series-cliffhanger",
      "hero-product-film",
      "vfx-transformation",
    ],
    angles: [
      {
        id: "best-3s",
        hook_seed: "Best 3 seconds cold open",
        pattern: "launch-teaser",
      },
    ],
    lexicon: {
      use: ["premiere", "stream", "live"],
      avoid_unless_true: ["unlicensed footage"],
    },
    proof_types: ["trailer cuts", "audience reactions"],
    cta_defaults: ["Watch", "Tickets"],
    landing_notes: "Title art match.",
  },
  {
    id: "luxury",
    niche: "luxury",
    aliases: ["premium", "prestige"],
    audience: "Status + craft buyers; dislike desperation.",
    jobs_to_be_done: [
      "Signal craft",
      "Invitation not begging",
      "Heritage story",
    ],
    recommended_pattern_ids: [
      "hero-product-film",
      "cinematic-brand-spot",
      "beauty-macro-tabletop",
      "founder-story-origin",
      "bts-making-of",
      "fashion-editorial-film",
    ],
    angles: [
      {
        id: "material-first",
        hook_seed: "Open on material, not logo",
        pattern: "hero-product-film",
      },
    ],
    lexicon: {
      use: ["craft", "atelier", "limited"],
      avoid_unless_true: ["percent-off screaming", "act now spam"],
    },
    proof_types: ["craft process", "heritage", "clientele stories tasteful"],
    cta_defaults: ["Explore", "Book appointment"],
    landing_notes: "Quiet luxury UX.",
  },
  {
    id: "automotive",
    niche: "automotive",
    aliases: ["auto", "ev", "dealer"],
    audience: "Aspirational + practical shoppers.",
    jobs_to_be_done: ["Motion lust", "Spec clarity", "Test drive"],
    recommended_pattern_ids: [
      "performance-sports-cine",
      "hero-product-film",
      "cgi-3d-product",
      "cinematic-brand-spot",
      "local-service-trust",
      "offer-urgency",
    ],
    angles: [
      {
        id: "motion-open",
        hook_seed: "Speed / light streak open",
        pattern: "performance-sports-cine",
      },
    ],
    lexicon: {
      use: ["range/power only if accurate", "trim"],
      avoid_unless_true: ["misleading MPG/range"],
    },
    proof_types: ["owned footage", "owner stories"],
    cta_defaults: ["Build yours", "Test drive"],
    landing_notes: "Trim accuracy.",
  },
  {
    id: "nonprofit",
    niche: "nonprofit",
    aliases: ["cause", "charity"],
    audience: "Values-led donors; story over stats spam.",
    jobs_to_be_done: ["Human story", "Clear ask", "Impact proof"],
    recommended_pattern_ids: [
      "documentary-cutdown",
      "text-story-slideshow",
      "founder-story-origin",
      "cultural-moment",
      "testimonial-montage-cine",
      "save-share-bait",
    ],
    angles: [
      {
        id: "one-person-story",
        hook_seed: "Start on one human, not the org logo",
        pattern: "documentary-cutdown",
      },
    ],
    lexicon: {
      use: ["impact specificity", "where money goes"],
      avoid_unless_true: ["poverty porn", "exaggerated impact"],
    },
    proof_types: ["beneficiary consent stories", "transparency"],
    cta_defaults: ["Donate", "Volunteer"],
    landing_notes: "Impact report access.",
  },
  {
    id: "local-services",
    niche: "local_services",
    aliases: ["home_services", "clinics_local", "trades"],
    audience: "Geo-intent; trust and phone.",
    jobs_to_be_done: [
      "Prove nearby competence",
      "Generate calls",
      "Show real facility",
    ],
    recommended_pattern_ids: [
      "local-service-trust",
      "before-after-reveal",
      "social-proof-stack",
      "pas-pain-stack",
      "founder-story-origin",
      "offer-urgency",
    ],
    angles: [
      {
        id: "geo-specialty",
        hook_seed: "City + specialty in one breath",
        pattern: "local-service-trust",
      },
    ],
    lexicon: {
      use: ["service area", "years", "license"],
      avoid_unless_true: ["best in city without basis"],
    },
    proof_types: ["reviews", "bay/facility", "before/after"],
    cta_defaults: ["Call", "Get quote"],
    landing_notes: "NAP consistency.",
  },
  {
    id: "kids-family",
    niche: "kids",
    aliases: ["family", "parenting", "toys"],
    audience: "Parents; safety + delight.",
    jobs_to_be_done: ["Show joy safely", "Solve parent pain", "Gift moments"],
    recommended_pattern_ids: [
      "ugc-talking-head-scroll-stop",
      "product-loop-demo",
      "skit-sketch-ad",
      "save-share-bait",
      "social-proof-stack",
      "unboxing-asmr",
    ],
    angles: [
      {
        id: "parent-confession",
        hook_seed: "The bedtime struggle is real…",
        pattern: "ugc-talking-head-scroll-stop",
      },
    ],
    lexicon: {
      use: ["age range", "safety standards if true"],
      avoid_unless_true: ["makes kids smarter guaranteed"],
    },
    proof_types: ["parent UGC", "demo with kids with consent"],
    cta_defaults: ["Shop", "Gift guide"],
    landing_notes: "Age-appropriate claims.",
  },
];

// remove old niche files that are obsolete naming
for (const old of ["auto-restoration.json", "ecommerce-dtc.json", "saas-b2b.json"]) {
  const p = path.join(root, "niches", old);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

const index = {
  name: "ad-intelligence-database",
  version: "2.0.0",
  description:
    "Comprehensive pattern-first ad blueprints for LLM agents — viral trends, high-production films, and performance creative across verticals.",
  updated: "2026-10-10",
  counts: {
    patterns: patterns.length,
    viral_or_share: patterns.filter((p) => (p.tags || []).includes("viral"))
      .length,
    high_production: patterns.filter((p) =>
      (p.tags || []).includes("high-production")
    ).length,
  },
  retrieval: {
    primary_keys: [
      "id",
      "style",
      "funnel_stage",
      "platforms",
      "niches",
      "production_tier",
      "virality_posture",
    ],
    script: "../scripts/retrieve.mjs",
    query_schema: "../../../schema/query.schema.json",
    blueprint_schema: "../../../schema/ad-blueprint.schema.json",
  },
  patterns,
  libraries: [
    { id: "hooks", file: "hooks/library.json" },
    { id: "flows", file: "flows/library.json" },
    { id: "anti-patterns", file: "anti-patterns.json" },
    { id: "viral-trends", file: "trends/viral-operating-system.json" },
  ],
  niches: niches.map((n) => {
    const file = `niches/${n.id}.json`;
    fs.writeFileSync(path.join(root, file), JSON.stringify(n, null, 2) + "\n");
    return { id: n.niche, file };
  }),
};

fs.writeFileSync(path.join(root, "index.json"), JSON.stringify(index, null, 2) + "\n");
console.log(JSON.stringify(index.counts, null, 2));
console.log("niches", index.niches.length);
