#!/usr/bin/env node
/**
 * Appropriate backtest suite for Ad Intelligence.
 * Usage: node scripts/backtest.mjs
 * Exit 0 = all checks pass.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPO = path.join(ROOT, "../..");

const results = [];
function ok(name, pass, detail = "") {
  results.push({ name, pass: !!pass, detail });
  const mark = pass ? "PASS" : "FAIL";
  console.log(`  [${mark}] ${name}${detail ? ` — ${detail}` : ""}`);
}

function runNode(script, args = [], opts = {}) {
  return spawnSync(process.execPath, [path.join(ROOT, "scripts", script), ...args], {
    encoding: "utf8",
    cwd: ROOT,
    ...opts,
  });
}

function retrieveCompact(niche, platform) {
  const r = runNode("retrieve.mjs", [
    "--niche",
    niche,
    "--platform",
    platform,
    "--limit",
    "5",
    "--compact",
  ]);
  if (!r.stdout) return { error: r.stderr || "no stdout", status: r.status };
  try {
    return { json: JSON.parse(r.stdout), status: r.status };
  } catch (e) {
    return { error: String(e), status: r.status };
  }
}

console.log("Ad Intelligence — backtest\n");

// 1) Discovery symlinks
console.log("DISCOVERY");
for (const rel of [
  ".cursor/skills/ad-intelligence",
  ".claude/skills/ad-intelligence",
  ".agents/skills/ad-intelligence",
  ".github/skills/ad-intelligence",
]) {
  const p = path.join(REPO, rel);
  const skill = path.join(p, "SKILL.md");
  ok(rel, fs.existsSync(skill), fs.existsSync(skill) ? "SKILL.md" : "missing");
}
ok("AGENTS.md", fs.existsSync(path.join(REPO, "AGENTS.md")));

// 2) Gates + ready
console.log("\nGATES");
const gates = runNode("demo-quality-gates.mjs");
ok("demo-quality-gates", gates.status === 0, gates.status === 0 ? "gold+corpus" : gates.stdout?.slice(-200));
const ready = runNode("agent-ready.mjs");
ok("agent-ready", ready.status === 0);

// 3) Probe
console.log("\nHARNESS");
const probe = runNode("probe-harness.mjs", ["--json"]);
let probeJ = null;
try {
  probeJ = JSON.parse(probe.stdout);
} catch {
  /* ignore */
}
ok("probe-harness --json", !!probeJ && probeJ.files_missing?.length === 0, probeJ?.recommended_rung_hint);

// 4) Retrieve matrix
console.log("\nRETRIEVE MATRIX");
const matrix = [
  ["shampoo", "tiktok", "beauty", "am_hair"],
  ["voice ai", "meta", "saas", "am_"],
  ["food", "instagram", "food", "am_"],
  ["local-services", "meta", "local", "am_local"],
  ["ecommerce", "tiktok", "ecommerce", "am_"],
  ["fintech", "meta", "fintech", "am_"],
];
const liveSlices = {};
for (const [niche, platform, expectNicheSub, expectAmSub] of matrix) {
  const { json, error } = retrieveCompact(niche, platform);
  if (!json) {
    ok(`retrieve ${niche}|${platform}`, false, error);
    continue;
  }
  const nicheOk = (json.resolved?.niche_id || "").includes(expectNicheSub.replace("_", "-")) ||
    (json.resolved?.niche_id || "").includes(expectNicheSub.replace("-", "_")) ||
    (expectNicheSub === "food" && (json.resolved?.niche_id || "").includes("food")) ||
    (expectNicheSub === "local" && (json.resolved?.niche_id || "").includes("local"));
  const am = json.attention_models?.primary || "";
  const amOk = am.startsWith("am_") && (expectAmSub === "am_" || am.includes(expectAmSub.replace("am_", "")) || am.startsWith(expectAmSub));
  const picksOk = !!json.picks?.primary && json.picks.dual_track_twin !== json.picks.primary;
  const timingOk = (json.attention_models?.models?.[0]?.timing || []).length >= 3;
  const studiesOk =
    !!json.studies?.primary &&
    (json.studies?.items || []).length >= 1 &&
    Array.isArray(json.studies.items[0]?.human_build) &&
    !!json.studies.items[0]?.provenance?.basis &&
    !!json.studies?.join?.rule;
  liveSlices[`${niche}|${platform}`] = json;
  ok(
    `retrieve ${niche}|${platform}`,
    nicheOk && amOk && picksOk && timingOk && studiesOk,
    `niche=${json.resolved?.niche_id} am=${am} study=${json.studies?.primary} basis=${json.studies?.items?.[0]?.provenance?.basis} primary=${json.picks?.primary}`
  );
}

// 5) Offline vs live alignment
console.log("\nOFFLINE RETRIEVE");
const offlinePath = path.join(ROOT, "references", "retrieve-offline-compact.json");
ok("offline file exists", fs.existsSync(offlinePath));
if (fs.existsSync(offlinePath)) {
  const offline = JSON.parse(fs.readFileSync(offlinePath, "utf8"));
  const keys = Object.keys(offline.by_query || {});
  ok("offline has ≥8 queries", keys.length >= 8, `${keys.length} keys`);
  for (const key of ["shampoo|tiktok", "voice ai|meta", "beauty|tiktok"]) {
    const o = offline.by_query[key];
    const live = liveSlices[key] || retrieveCompact(...key.split("|")).json;
    if (!o || !live) {
      ok(`offline align ${key}`, false, "missing");
      continue;
    }
    const samePrimary = o.picks?.primary === live.picks?.primary;
    const sameAm = o.attention_models?.primary === live.attention_models?.primary;
    ok(
      `offline≈live ${key}`,
      samePrimary && sameAm,
      `picks ${o.picks?.primary}/${live.picks?.primary} am ${o.attention_models?.primary}/${live.attention_models?.primary}`
    );
  }
}

// 6) URL brief
console.log("\nURL BRIEF");
const brief = runNode("brief-from-url.mjs", ["https://example.com", "--json"]);
try {
  const b = JSON.parse(brief.stdout);
  ok("brief-from-url example.com", b.fetched === true && b.brand?.tag === "ASSET_VERIFIED", b.brand?.value);
  ok("brief does not invent proof", Array.isArray(b.proof_available?.value) && b.proof_available.value.length === 0);
} catch {
  ok("brief-from-url example.com", false, brief.stderr || "parse fail");
}

// 7) Unfilled skeleton must fail lint
console.log("\nLINT NEGATIVE");
const tmpSkel = path.join(ROOT, "packages", "_backtest-unfilled.md");
fs.mkdirSync(path.dirname(tmpSkel), { recursive: true });
const start = runNode("start-package.mjs", [
  "--out",
  "packages/_backtest-unfilled.md",
  "--force",
]);
ok("start-package writes skeleton", start.status === 0 && fs.existsSync(tmpSkel));
const lintFail = runNode("lint-package.mjs", [tmpSkel]);
let failJ = null;
try {
  failJ = JSON.parse(lintFail.stdout);
} catch {
  /* ignore */
}
ok(
  "unfilled skeleton fails lint",
  lintFail.status !== 0 && failJ && failJ.ok === false,
  failJ?.issues?.[0]?.id || "no issue id"
);

// 8) Context packs
console.log("\nCONTEXT PACKS");
ok("context-pack.md present", fs.existsSync(path.join(ROOT, "prompts", "context-pack.md")));
ok("context-pack-lite.md present", fs.existsSync(path.join(ROOT, "prompts", "context-pack-lite.md")));
ok("no-shell checklist present", fs.existsSync(path.join(ROOT, "prompts", "no-shell-lint-checklist.md")));
const lite = fs.readFileSync(path.join(ROOT, "prompts", "context-pack-lite.md"), "utf8");
ok("lite mentions offline retrieve", /retrieve-offline-compact/.test(lite));

// 9) Attention lab data
console.log("\nATTENTION LAB");
const lab = path.join(ROOT, "examples", "visual", "attention-lab.html");
const data = path.join(ROOT, "examples", "visual", "attention-data.js");
ok("attention-lab.html", fs.existsSync(lab));
ok("attention-data.js", fs.existsSync(data));
if (fs.existsSync(data)) {
  const am = JSON.parse(fs.readFileSync(path.join(ROOT, "references", "attention-models.json"), "utf8"));
  ok("attention models ≥12", (am.models || []).length >= 12, String(am.models.length));
  ok("public libraries ≥4", (am.public_libraries || []).length >= 4);
}

// 9b) Studies corpus + human-build OS
console.log("\nSTUDIES OS");
const studiesPath = path.join(ROOT, "studies", "corpus.json");
const humanBuildPath = path.join(ROOT, "references", "human-build-os.md");
ok("studies/corpus.json", fs.existsSync(studiesPath));
ok("human-build-os.md", fs.existsSync(humanBuildPath));
ok(
  "human-build-log.template.md",
  fs.existsSync(path.join(ROOT, "references", "human-build-log.template.md"))
);
ok(
  "ingest-blueprint.mjs",
  fs.existsSync(path.join(ROOT, "scripts", "ingest-blueprint.mjs"))
);
ok(
  "library-access.mjs",
  fs.existsSync(path.join(ROOT, "scripts", "library-access.mjs"))
);
{
  const la = runNode("library-access.mjs", [
    "--niche",
    "saas",
    "--platform",
    "tiktok",
    "--keyword",
    "voice agent",
  ]);
  let plan = null;
  try {
    plan = JSON.parse(la.stdout || "{}");
  } catch {
    /* ignore */
  }
  ok(
    "library-access tiktok has fallbacks",
    la.status === 0 &&
      plan?.primary?.access === "partial_free" &&
      (plan?.fallbacks || []).some((f) => f.access === "login_free"),
    plan?.primary?.access
  );
}
ok(
  "fresh-clone-prove.mjs",
  fs.existsSync(path.join(ROOT, "scripts", "fresh-clone-prove.mjs"))
);
if (fs.existsSync(studiesPath)) {
  const corpus = JSON.parse(fs.readFileSync(studiesPath, "utf8"));
  ok("studies ≥8", (corpus.studies || []).length >= 8, String((corpus.studies || []).length));
  const withBuild = (corpus.studies || []).filter(
    (s) => Array.isArray(s.human_build) && s.human_build.length >= 2
  );
  ok("studies have human_build", withBuild.length === (corpus.studies || []).length);
  const withProv = (corpus.studies || []).filter(
    (s) =>
      s.provenance &&
      typeof s.provenance.observed === "boolean" &&
      s.provenance.basis === "synthesis" &&
      s.provenance.observed === false
  );
  ok(
    "public studies labelled synthesis",
    withProv.length === (corpus.studies || []).length,
    `${withProv.length}/${(corpus.studies || []).length}`
  );
  ok(
    "public corpus has zero observed:true",
    (corpus.studies || []).every((s) => s.provenance?.observed === false),
    "observed must stay private via ingest"
  );
  ok(
    "public studies have structure.format",
    (corpus.studies || []).every(
      (s) =>
        s.structure?.format === "video_timed" &&
        s.structure?.timing_observable === true
    )
  );
  const synFail = runNode("lint-package.mjs", [
    "examples/lint-corpus/fail-study-synthesis-as-proof.md",
  ]);
  let synJ = null;
  try {
    synJ = JSON.parse(synFail.stdout || "{}");
  } catch {
    /* ignore */
  }
  ok(
    "lint catches study-synthesis-cited-as-proof",
    synFail.status !== 0 &&
      (synJ?.issues || []).some((i) => i.id === "study-synthesis-cited-as-proof"),
    (synJ?.issues || []).map((i) => i.id).join(",")
  );

  // shape-claims-pass must NOT fire on honest synthesis "structure only" labels
  const synLabelPkg = path.join(ROOT, "packages", "_backtest-structure-only.md");
  fs.writeFileSync(
    synLabelPkg,
    fs
      .readFileSync(
        path.join(ROOT, "examples", "voice-agent-front-desk.md"),
        "utf8"
      )
      .replace(
        /Study provenance:[^\n]*/i,
        "Study provenance: observed:false · basis:synthesis — structure only — not proof"
      )
      .replace(
        /Checklist gates:[^\n]*/i,
        "Checklist gates: PASS (assembler handoff; NOT_RENDERED explicit)"
      )
      .replace(
        /lint-package\.mjs:[^\n]*/i,
        "lint-package.mjs: PASS"
      )
  );
  const synLabelLint = runNode("lint-package.mjs", [synLabelPkg]);
  let synLabelJ = null;
  try {
    synLabelJ = JSON.parse(synLabelLint.stdout || "{}");
  } catch {
    /* ignore */
  }
  ok(
    "structure-only synthesis label does not trip shape-claims-pass",
    !(synLabelJ?.issues || []).some((i) => i.id === "shape-claims-pass"),
    (synLabelJ?.issues || []).map((i) => i.id).join(",")
  );
  try {
    fs.unlinkSync(synLabelPkg);
  } catch {
    /* ignore */
  }

  // B7.3 — NOT_RENDERED header cannot opt out when Render log has job ids
  {
    const src = fs.readFileSync(
      path.join(ROOT, "examples/lint-corpus/fail-incomplete-hook-only.md"),
      "utf8"
    );
    const contradict = src.replace(
      /Render status:\s*RENDERED/i,
      "Render status: NOT_RENDERED"
    );
    const tmp = path.join(ROOT, "packages", "_backtest-status-contradict.md");
    fs.writeFileSync(tmp, contradict);
    const r = runNode("lint-package.mjs", [tmp]);
    let j = null;
    try {
      j = JSON.parse(r.stdout || "{}");
    } catch {
      /* ignore */
    }
    ok(
      "lint catches render-status-contradicts-log (B7.3)",
      r.status !== 0 &&
        (j?.issues || []).some((i) => i.id === "render-status-contradicts-log") &&
        (j?.issues || []).some((i) => i.id === "incomplete-hook-only"),
      (j?.issues || []).map((i) => i.id).join(",")
    );
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* ignore */
    }
  }

  for (const [rel, ruleId] of [
    ["examples/lint-corpus/fail-incomplete-hook-only.md", "incomplete-hook-only"],
    ["examples/lint-corpus/fail-silent-cut-incomplete.md", "silent-cut-incomplete"],
    ["examples/lint-corpus/fail-shape-claims-pass.md", "shape-claims-pass"],
  ]) {
    const r = runNode("lint-package.mjs", [rel]);
    let j = null;
    try {
      j = JSON.parse(r.stdout || "{}");
    } catch {
      /* ignore */
    }
    ok(
      `lint catches ${ruleId}`,
      r.status !== 0 && (j?.issues || []).some((i) => i.id === ruleId),
      (j?.issues || []).map((i) => i.id).join(",")
    );
  }
  const voice = retrieveCompact("voice ai", "meta").json;
  ok(
    "voice ai study = missed-call",
    voice?.studies?.primary === "study_voice_agent_missed_call",
    voice?.studies?.primary
  );
  const shampooStudy = retrieveCompact("shampoo", "tiktok").json;
  ok(
    "shampoo study = beauty macro",
    shampooStudy?.studies?.primary === "study_beauty_macro_transform",
    shampooStudy?.studies?.primary
  );
}

// 10) Ranking sanity (query affinity)
console.log("\nRANKING SANITY");
{
  const beauty = retrieveCompact("beauty", "tiktok").json;
  const shampoo = retrieveCompact("shampoo", "tiktok").json;
  ok(
    "beauty primary ≠ hair-only specialist",
    beauty?.attention_models?.primary &&
      beauty.attention_models.primary !== "am_hair_transform",
    beauty?.attention_models?.primary
  );
  ok(
    "shampoo primary = hair transform",
    shampoo?.attention_models?.primary === "am_hair_transform",
    shampoo?.attention_models?.primary
  );
  const ecom = retrieveCompact("ecommerce", "tiktok").json;
  ok(
    "ecommerce primary ≠ food_crave",
    ecom?.attention_models?.primary !== "am_food_crave_asmr",
    ecom?.attention_models?.primary
  );
}

// 11) E2E gold-density packages still lint clean
console.log("\nE2E GOLD LINT");
for (const rel of [
  "examples/beauty-dtc-dual-track.md",
  "examples/voice-agent-front-desk.md",
  "examples/saas-demo-pas.md",
  "examples/local-service-trust.md",
  "examples/physical-product-hero.md",
]) {
  const r = runNode("lint-package.mjs", [path.join(ROOT, rel)]);
  let j = null;
  try {
    j = JSON.parse(r.stdout);
  } catch {
    /* ignore */
  }
  ok(`lint ${path.basename(rel)}`, r.status === 0 && j?.ok === true);
}

// Summary
const failed = results.filter((r) => !r.pass);
console.log(`\n${"=".repeat(40)}`);
console.log(`Backtest: ${results.length - failed.length}/${results.length} passed`);
if (failed.length) {
  console.log("Failed:");
  for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`);
  process.exitCode = 1;
} else {
  console.log("OK — mechanical backtest green.");
  process.exitCode = 0;
}
