#!/usr/bin/env node
/**
 * Mechanical ship gate for ad packages (markdown).
 * Usage: node lint-package.mjs <package.md>
 * Exit 0 = pass, 1 = fail. Prints rule ids + line hints.
 *
 * Harnesses without a shell: run the same checks manually from
 * checklists/first-time-right.json gate `lint-pass`.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const REQUIRED_H3 = [
  "Brief",
  "Retrieval",
  "Job-to-be-done",
  "Concept",
  "Consistency systems",
  "Creative stack",
  "Hooks",
  "Timed script",
  "Claim",
  "Craft system",
  "Render plan",
  "Caption",
  "CTA",
  "AI disclosure",
  "Self-critique",
  "First-time-right",
];

const DESCRIPTIVE_VO = /^\s*(sparse|—|-|n\/a|tbd|todo|≤\s*\d+\s*words|pov overlay|overlay ≤|soft vo|optional)\s*$/i;

const SLOP = [
  /\bunlock\b/i,
  /\belevate\b/i,
  /\bgame[- ]changer\b/i,
  /\brevolutionize\b/i,
  /\bin today'?s world\b/i,
  /\bseamless\b/i,
  /\bsay goodbye to\b/i,
];

/** Vague “AI director” adjectives — fail in craft / shot list / unit prompts */
const CRAFT_VAGUE = [
  /\bcinematic\b/i,
  /\bstunning\b/i,
  /\bsleek\b/i,
  /\bepic\b/i,
  /\bdynamic\b/i,
  /\bvibrant\b/i,
  /\bbeautiful\b/i,
  /\bgorgeous\b/i,
  /\bnice\b/i,
  /\b8k\b/i,
  /\b4k\b/i,
  /\bpremium look\b/i,
];

const COPY_LEAK = [
  /only when (you )?suppl/i,
  /no invented\b/i,
  /reviews shown only/i,
  /specs appear only/i,
  /case numbers only/i,
];

const METRICISH =
  /(\d+\s*%|\d+\s*\/\s*\d+|ROAS|CTR|CPA|[\d,]+\s*(customers|reviews|stars|users))/i;

function sectionBlock(text, headingRe) {
  const lines = text.split(/\r?\n/);
  const headTest = new RegExp(`^#{2,4}\\s+.*${headingRe.source}`, "i");
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (headTest.test(lines[i])) {
      start = i;
      break;
    }
  }
  if (start < 0) return "";
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^#{2,4}\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join("\n");
}

function fail(issues, id, msg, line) {
  if (issues.some((x) => x.id === id && x.msg === msg)) return;
  issues.push({ id, msg, line: line || null });
}

function findHeadingLine(lines, re) {
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i])) return i + 1;
  }
  return null;
}

function lint(text, filePath) {
  const issues = [];
  const lines = text.split(/\r?\n/);

  for (const h of REQUIRED_H3) {
    const re = new RegExp(`^#{2,4}\\s+.*${h}`, "i");
    if (!lines.some((l) => re.test(l))) {
      fail(issues, "missing-section", `Missing section matching "${h}"`);
    }
  }

  // Exactly one primary CTA hint
  const ctaBlock = text.match(/### CTA[\s\S]*?(?=### |\n## |$)/i);
  if (ctaBlock) {
    const primaryLines = ctaBlock[0]
      .split("\n")
      .filter((l) => /primary/i.test(l) && !/alternate/i.test(l));
    const joined = primaryLines.join(" ");
    if (/\/|,\s*(follow|like|comment|shop|link)/i.test(joined)) {
      fail(
        issues,
        "multi-cta",
        "Primary CTA looks like a slash-menu / multi-CTA",
        findHeadingLine(lines, /### CTA/i)
      );
    }
  }

  // Invented metrics outside PLACEHOLDER
  lines.forEach((l, i) => {
    if (METRICISH.test(l) && !/\[PLACEHOLDER/i.test(l) && !/^\| Dimension/i.test(l)) {
      // allow rubric score tables and brief tool-access lines
      if (/^\|.*(thumbstop|clarity|Score)/i.test(l)) return;
      if (/Self-critique|Rubric|score/i.test(l)) return;
      if (/duration_s|ideal_seconds|hook_max/i.test(l)) return;
      // Timecode rows like "0–3s" or "| 12-15s |" (do not end the regex at [-–]/)
      if (/^\s*\|?\s*\d+\s*[-–]\s*\d+\s*s\b/i.test(l)) return;
      if (/t\s*\|/i.test(l) && /Visual/i.test(text)) return;
      // flag review/customer/ROAS style claims
      if (/(customers|reviews|stars|ROAS|CTR|CPA|\d+\s*%)/i.test(l)) {
        fail(
          issues,
          "metric-without-placeholder",
          `Metric-like claim without [PLACEHOLDER]: ${l.trim().slice(0, 80)}`,
          i + 1
        );
      }
    }
  });

  // Slop lexicon in hooks / script / paid copy regions
  const hot = text.match(
    /### Hooks[\s\S]*?(?=### Self-critique|### First-time-right|$)/i
  );
  if (hot) {
    for (const re of SLOP) {
      if (re.test(hot[0])) {
        fail(
          issues,
          "slop-lexicon",
          `Al-slop phrase matched ${re}: rewrite with concrete scene/noun`
        );
        break;
      }
    }
  }

  // Provenance / claim ledger present
  if (!/USER_SUPPLIED|ASSET_VERIFIED|PLACEHOLDER|ASSUMED|Claim & asset ledger|Claim ledger/i.test(text)) {
    fail(
      issues,
      "provenance-missing",
      "Missing claim/asset ledger or provenance tags (USER_SUPPLIED|ASSET_VERIFIED|PLACEHOLDER|ASSUMED)"
    );
  }

  // Render plan: must mention real media roles or clip units
  if (!/start_image|image_references|clip_id|unit_id|Render plan/i.test(text)) {
    fail(
      issues,
      "render-plan-thin",
      "Render plan missing clip/unit ids or real MCP roles (start_image / image_references)"
    );
  }

  // Self-critique must have failure modes + A/B/C
  if (!/Failure modes|Likely failure/i.test(text)) {
    fail(issues, "critique-failures", "Missing failure modes list");
  }
  if (!/\bVariant\b|\bA\b.*\bB\b.*\bC\b|\| A \|/i.test(text)) {
    fail(issues, "critique-variants", "Missing A/B/C variants table");
  }

  // Uniform 5s without evidence — soft fail if all scores are 5 and no timecode cited nearby
  const scoreRows = lines.filter((l) =>
    /^\|\s*(thumbstop|clarity|native_fit|desire_or_proof|cta_hygiene|production_truth|consistency_lock)\s*\|/i.test(
      l
    )
  );
  if (scoreRows.length >= 5 && scoreRows.every((l) => /\|\s*5\s*\|/.test(l))) {
    const nearby = scoreRows.join(" ");
    if (!/\d+[-–]\d+\s*s|\d+s\b|timecode|line/i.test(nearby)) {
      fail(
        issues,
        "uniform-fives",
        "All rubric scores are 5 with no timecode/line evidence — cite evidence or lower scores"
      );
    }
  }

  // Pattern id presence check against index if Retrieval section has ids
  try {
    const index = JSON.parse(
      fs.readFileSync(path.join(ROOT, "database", "index.json"), "utf8")
    );
    const ids = new Set(index.patterns.map((p) => p.id));
    const m = text.match(/Primary(?: pattern)?(?: id)?:\s*`?([a-z0-9-]+)`?/i);
    if (m && !ids.has(m[1])) {
      fail(issues, "unknown-pattern", `Primary pattern id not in index: ${m[1]}`);
    }
  } catch {
    /* ignore */
  }

  // LAST-VERIFIED mention or freshness note
  if (!/LAST-VERIFIED|last verified|creative-stack last verified/i.test(text)) {
    fail(
      issues,
      "freshness-unchecked",
      "No LAST-VERIFIED / freshness check noted in package"
    );
  }

  // Unfilled skeleton brackets / TODOs in a "finished" package
  if (/\[\[|\]\]/.test(text)) {
    fail(
      issues,
      "unfilled-placeholder",
      "Unfilled [[BRACKET]] markers remain — finish the skeleton or don’t claim done"
    );
  }
  if (/\bTODO\b|\bTBD\b|«[^»]+»/.test(text)) {
    fail(
      issues,
      "unfilled-todo",
      "TODO/TBD/«guillemet» placeholders remain in the package"
    );
  }

  // Concept chosen (not just pattern fill)
  const conceptBlock = sectionBlock(text, /Concept/i);
  if (conceptBlock && !/Not the default because|why not default|Chosen|pick:/i.test(conceptBlock)) {
    fail(
      issues,
      "concept-thin",
      "Concept section must name the chosen idea and why it’s not the AI-default (Not the default because…)"
    );
  }

  // Timed script density + exact on-screen/VO words
  const scriptBlock = sectionBlock(text, /Timed script/i);
  if (scriptBlock) {
    const beatRows = scriptBlock
      .split("\n")
      .filter((l) => /^\|/.test(l) && /\d+\s*[-–]\s*\d+\s*s/i.test(l));
    if (beatRows.length > 0 && beatRows.length < 6) {
      fail(
        issues,
        "script-density",
        `Timed script has ${beatRows.length} beat rows — need ≥6 (≈ one row per ≤3–4s)`
      );
    }
    let descriptive = 0;
    for (const row of beatRows) {
      const cells = row.split("|").map((c) => c.trim());
      // | t | Visual | VO/text | Purpose | tags |
      const vo = cells[3] || "";
      if (DESCRIPTIVE_VO.test(vo) || /≤\s*\d+\s*words/i.test(vo)) descriptive++;
    }
    if (beatRows.length >= 4 && descriptive >= Math.ceil(beatRows.length * 0.5)) {
      fail(
        issues,
        "exact-copy",
        "VO/text cells are descriptions (sparse / ≤N words) — write EXACT on-screen or spoken words in quotes"
      );
    }
  }

  // --- Craft specificity (heading alone is not enough) ---
  const craftBlock = sectionBlock(text, /Craft system/i);
  if (craftBlock) {
    const hexes = craftBlock.match(/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g) || [];
    const brandTokens =
      /brand tokens?.*USER_SUPPLIED|USER_SUPPLIED.*brand (color|token|palette)/i.test(
        craftBlock
      );
    if (hexes.length < 2 && !brandTokens) {
      fail(
        issues,
        "craft-hex",
        "Craft system needs ≥2 HEX colors (or USER_SUPPLIED brand tokens) — not ‘nice brand colors’"
      );
    }
    if (!/Typography|type roles|font/i.test(craftBlock)) {
      fail(issues, "craft-type", "Craft system missing Typography / type roles");
    } else if (
      /Typography:[^\n]*(bold font|nice font|cool font|modern font)\b/i.test(
        craftBlock
      )
    ) {
      fail(
        issues,
        "craft-font-generic",
        "Typography must name a face/role (e.g. condensed display + neutral sans), not ‘bold font’"
      );
    } else if (/Typography:[^\n]*(-style|-like)\b/i.test(craftBlock)) {
      fail(
        issues,
        "font-hedge",
        "Typography hedges (-style/-like) banned — name a real face (e.g. Anton, Inter Tight, DIN 2014)"
      );
    }
    if (!/Endcard|\bE1\b/i.test(craftBlock)) {
      fail(
        issues,
        "craft-endcard",
        "Craft system missing Endcard / E1 module (logo SVG, one CTA, hold)"
      );
    }
    if (!/9:16|aspect matrix|aspects?:/i.test(craftBlock)) {
      fail(
        issues,
        "craft-aspect",
        "Craft system missing aspect matrix (e.g. 9:16 + 1:1, not center-crop)"
      );
    }
    if (!/Motion grammar|camera|hold/i.test(craftBlock)) {
      fail(
        issues,
        "craft-motion",
        "Craft system missing Motion grammar (camera verbs + holds)"
      );
    }
  }

  // Vague craft lexicon in Craft system, Shot list, and unit prompts
  const craftHot = [
    craftBlock,
    sectionBlock(text, /Shot list/i),
    ...(text.match(/#### Unit[\s\S]*?(?=#### |\n### |\n## |$)/gi) || []),
  ].join("\n");
  for (const re of CRAFT_VAGUE) {
    if (re.test(craftHot)) {
      fail(
        issues,
        "craft-vague-lexicon",
        `Vague craft adjective matched ${re}: use concrete camera/light/grade nouns`
      );
      break;
    }
  }

  // Compliance language must not leak into consumer-facing caption / paid copy
  const consumer = [
    sectionBlock(text, /Caption track|Caption\b/i),
    sectionBlock(text, /Paid social copy/i),
  ].join("\n");
  // Only scan primary/headline lines for paid; full caption block
  const paidPrimary = (consumer.match(/Primary text[^\n]*/gi) || []).join("\n");
  const captionBody = sectionBlock(text, /Caption track|Caption\b/i);
  const leakScan = `${paidPrimary}\n${captionBody}`;
  for (const re of COPY_LEAK) {
    if (re.test(leakScan)) {
      fail(
        issues,
        "copy-leak",
        `Compliance/meta language in caption or paid primary text matched ${re} — keep PLACEHOLDER/ASSUMED in the ledger only`
      );
      break;
    }
  }

  // Shape-only examples must not claim ship PASS in QA.
  // Trigger ONLY on real fixture markers — never bare "structure only"
  // (retrieve join / synthesis honesty uses that phrase correctly).
  // Path-scoped to examples/ — production packages/ are not shape fixtures.
  {
    const shapeMarker =
      /\bshape-only\b|not a length or quality target|SHAPE FIXTURE/i.test(
        text
      );
    const underExamples =
      typeof filePath === "string" &&
      /(^|[/\\])examples([/\\]|$)/i.test(path.normalize(filePath));
    if (
      shapeMarker &&
      underExamples &&
      /Checklist gates:\s*PASS\b|lint-package\.mjs:\s*PASS\b/i.test(text)
    ) {
      fail(
        issues,
        "shape-claims-pass",
        "Shape-only example must not claim checklist/lint PASS"
      );
    }
  }

  // Study honesty — synthesis cannot be laundered into observed proof
  lintStudyCitationHonesty(text, lines, issues);

  // Finished renders must cover full duration + audio (not silent hook-only)
  lintFinishCutComplete(text, issues);

  return issues;
}

/** True when the package claims a finished/rendered delivery (not NOT_RENDERED). */
function claimsFinishedRender(text) {
  if (/Render status:\s*NOT_RENDERED/i.test(text)) return false;
  if (/Render status:\s*RENDERED/i.test(text)) return true;

  const finish =
    text.match(/FINISH-THE-CUT[\s\S]{0,1200}/i)?.[0] || "";
  const unitsRendered = finish.match(
    /Units rendered this session:\s*([^\n]+)/i
  )?.[1];
  if (unitsRendered) {
    const v = unitsRendered.trim();
    if (
      v &&
      !/^(\[\[|—|-|n\/a|none|not[ _-]?rendered|todo|tbd)\b/i.test(v) &&
      !/awaiting|not yet/i.test(v)
    ) {
      return true;
    }
  }

  const log = sectionBlock(text, /Render log/i);
  if (
    log &&
    /\|[ \t]*[a-f0-9]{8,}[ \t]*\|/i.test(log) &&
    !/\bNOT_RENDERED\b/i.test(log)
  ) {
    return true;
  }
  return false;
}

/**
 * Hook-only silent clips must not count as finished ads.
 * Skips honest NOT_RENDERED handoff packages.
 */
function lintFinishCutComplete(text, issues) {
  if (!claimsFinishedRender(text)) return;

  const scriptBlock = sectionBlock(text, /Timed script/i);
  const ends = [...scriptBlock.matchAll(/\d+\s*[-–]\s*(\d+)\s*s/gi)].map((m) =>
    Number(m[1])
  );
  const scriptEnd = ends.length ? Math.max(...ends) : 0;

  const finish = text.match(/FINISH-THE-CUT[\s\S]{0,1200}/i)?.[0] || "";
  const log = sectionBlock(text, /Render log/i);

  // --- incomplete-hook-only ---
  if (scriptEnd > 10) {
    const timedDur = finish.match(/Timed duration:\s*(\d+)\s*s/i);
    const shortClaim =
      timedDur && Number(timedDur[1]) <= 8 && scriptEnd > 10;

    const unitsLine =
      finish.match(/Units rendered this session:\s*([^\n]+)/i)?.[1] || "";
    const planned =
      finish.match(/Units planned:\s*([^\n]+)/i)?.[1] || "";
    const onlyHookUnits =
      /\b(U1|K1)\b/i.test(unitsLine) &&
      !/\b(U2|U3|C1|E1|A1)\b/i.test(unitsLine) &&
      (/\b(U2|U3|E1|A1|C1)\b/i.test(planned) || scriptEnd > 10);

    const jobRows = log
      .split("\n")
      .filter(
        (l) =>
          /^\|/.test(l) &&
          /[a-f0-9]{8,}/i.test(l) &&
          !/job_id/i.test(l) &&
          !/\bNOT_RENDERED\b/i.test(l)
      );
    const unitIds = new Set();
    for (const row of jobRows) {
      const cells = row.split("|").map((c) => c.trim());
      // | job_id | unit_id | status | ...
      if (cells[2] && !/^-+$/.test(cells[2])) unitIds.add(cells[2]);
    }
    const logOnlyHook =
      unitIds.size === 1 &&
      [...unitIds].every((u) => /^(U1|K1)$/i.test(u));

    if (shortClaim || onlyHookUnits || logOnlyHook) {
      fail(
        issues,
        "incomplete-hook-only",
        `Rendered delivery covers only the hook (~8s) while the timed script ends at ${scriptEnd}s — finish-the-cut requires every second + assemble`
      );
    }
  }

  // --- silent-cut-incomplete ---
  const craft = sectionBlock(text, /Craft system/i);
  const soundLine = (craft.match(/Sound plan:[^\n]*/i) || [""])[0];
  const post = (finish.match(/Post assemble:[^\n]*/i) || [""])[0];
  const audioLaid = (finish.match(/Audio laid in post:[^\n]*/i) || [""])[0];
  const audioZone = `${soundLine}\n${post}\n${audioLaid}\n${finish}`;

  const explicitSilent =
    /Sound plan:\s*(silent|none|no audio|muted only)\b/i.test(soundLine) ||
    /\b(no sound|silent cut|silent export|audio not (added|laid|mixed))\b/i.test(
      text
    ) ||
    /Audio laid in post:\s*(none|silent|n\/a|—|no)\b/i.test(audioLaid) ||
    /Post assemble:[^\n]*(no (?:VO|SFX|bed|audio)|silent only)/i.test(post);

  const hasAudioPath =
    /\b(VO|TTS|SFX|diegetic|ring SFX|paid-safe bed|audio bed|soft bed|music bed|A1\b.*\b(VO|TTS|bed|audio))/i.test(
      audioZone
    ) ||
    (/\bA1\b/i.test(finish) &&
      /\b(audio|VO|TTS|bed|SFX)\b/i.test(finish));

  if (explicitSilent || !hasAudioPath) {
    fail(
      issues,
      "silent-cut-incomplete",
      "Rendered delivery has no audio path (VO/SFX/bed). Silent model exports are not finished ads — lay audio in CapCut/post and log it in FINISH-THE-CUT"
    );
  }
}

/** Load public (+ optional private) studies for provenance lookup. */
function loadStudyIndex() {
  const map = new Map();
  const corpusPath = path.join(ROOT, "studies", "corpus.json");
  if (fs.existsSync(corpusPath)) {
    try {
      const corpus = JSON.parse(fs.readFileSync(corpusPath, "utf8"));
      for (const s of corpus.studies || []) {
        if (s?.id) map.set(s.id, s);
      }
    } catch {
      /* ignore */
    }
  }
  const privDirs = [
    path.join(ROOT, "studies", "private"),
    process.env.AD_INTEL_STUDIES_PRIVATE,
  ].filter(Boolean);
  for (const dir of privDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".json")) continue;
      try {
        const s = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
        if (s?.id) map.set(s.id, s);
      } catch {
        /* ignore */
      }
    }
  }
  return map;
}

/**
 * If a package cites study_* ids, provenance must be declared honestly.
 * Citing a synthesis study as observed / ad-library / named-campaign proof → fail.
 */
function lintStudyCitationHonesty(text, lines, issues) {
  const ids = [
    ...new Set(
      [...text.matchAll(/\b(study_[a-z0-9][a-z0-9_-]*)\b/gi)].map((m) =>
        m[1].toLowerCase()
      )
    ),
  ];
  if (!ids.length) return;

  const index = loadStudyIndex();
  const proofLaunder =
    /observed\s+(evidence|ad|campaign|teardown)|proven by (this |the )?study|study (proves|shows|demonstrates|confirms)|as (seen|observed) in (the )?study|real[- ]ad (teardown|evidence|proof)|named[- ]campaign (evidence|proof)|measured (CTR|ROAS|CPA) from (the )?study|study['’]s (CTR|ROAS|performance)|library evidence proves/i;
  let synthesisProofFlagged = false;

  for (const id of ids) {
    const study = index.get(id);
    const line = lines.findIndex((l) => new RegExp(`\\b${id}\\b`, "i").test(l));
    const lineNo = line >= 0 ? line + 1 : null;

    // Window around first mention for local provenance labels
    const windowStart = Math.max(0, line >= 0 ? line - 3 : 0);
    const windowEnd = Math.min(lines.length, line >= 0 ? line + 8 : lines.length);
    const local = lines.slice(windowStart, windowEnd).join("\n");
    const globalHasProv =
      /Study provenance|provenance:\s*observed|basis:\s*(synthesis|ad-library|named-campaign|owned-ad)/i.test(
        text
      );
    const localHasProv =
      /observed\s*:\s*(true|false)|basis\s*:\s*(synthesis|ad-library|named-campaign|owned-ad)|STRUCTURE_ONLY|structure only — not proof|not proof metrics/i.test(
        local
      );

    if (!globalHasProv && !localHasProv) {
      fail(
        issues,
        "study-provenance-undeclared",
        `Cited \`${id}\` without declaring study provenance (observed + basis). Synthesis must be labeled STRUCTURE_ONLY — not proof.`,
        lineNo
      );
    }

    // Package claims observed:true / ad-library for this id
    const claimsObservedTrue = new RegExp(
      `${id}[\\s\\S]{0,180}observed\\s*:\\s*true|observed\\s*:\\s*true[\\s\\S]{0,180}${id}`,
      "i"
    ).test(text);
    const claimsAdLibrary = new RegExp(
      `${id}[\\s\\S]{0,200}basis\\s*:\\s*(ad-library|named-campaign)|basis\\s*:\\s*(ad-library|named-campaign)[\\s\\S]{0,200}${id}`,
      "i"
    ).test(text);

    const basis = study?.provenance?.basis || null;
    const observed = study?.provenance?.observed;

    if (study && basis === "synthesis" && !synthesisProofFlagged) {
      if (claimsObservedTrue || claimsAdLibrary) {
        fail(
          issues,
          "study-synthesis-cited-as-proof",
          `Study \`${id}\` is basis:synthesis / observed:false in corpus — package must not claim observed:true or ad-library/named-campaign proof.`,
          lineNo
        );
        synthesisProofFlagged = true;
      } else if (proofLaunder.test(text) && new RegExp(id, "i").test(text)) {
        const idx = text.toLowerCase().indexOf(id);
        const slice = text.slice(Math.max(0, idx - 250), idx + id.length + 250);
        if (proofLaunder.test(slice) || proofLaunder.test(local)) {
          fail(
            issues,
            "study-synthesis-cited-as-proof",
            `Synthesis study \`${id}\` cited with observed-proof language. Emulate structure only; never invent evidence.`,
            lineNo
          );
          synthesisProofFlagged = true;
        }
      }
    }

    if (
      study &&
      observed === false &&
      claimsObservedTrue &&
      !synthesisProofFlagged
    ) {
      fail(
        issues,
        "study-synthesis-cited-as-proof",
        `Study \`${id}\` has observed:false — package claims observed:true.`,
        lineNo
      );
      synthesisProofFlagged = true;
    }

    if (!study && /study_fixture_|study_private|study_example/i.test(id) === false) {
      // Unknown study id still requires provenance; warn as unknown
      fail(
        issues,
        "study-unknown-id",
        `Study id \`${id}\` not found in studies/corpus.json (or private). Do not invent study ids.`,
        lineNo
      );
    }
  }
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: node lint-package.mjs <package.md>");
    process.exit(2);
  }
  const abs = path.resolve(file);
  if (!fs.existsSync(abs)) {
    console.error(`File not found: ${abs}`);
    process.exit(2);
  }
  const text = fs.readFileSync(abs, "utf8");
  const issues = lint(text, abs);
  if (!issues.length) {
    console.log(JSON.stringify({ file: abs, ok: true, issues: [] }, null, 2));
    process.exit(0);
  }
  console.log(
    JSON.stringify(
      {
        file: abs,
        ok: false,
        count: issues.length,
        issues,
      },
      null,
      2
    )
  );
  process.exit(1);
}

main();
