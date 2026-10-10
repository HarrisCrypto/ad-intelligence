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
  "Consistency systems",
  "Creative stack",
  "Hooks",
  "Timed script",
  "Claim",
  "Render plan",
  "Caption",
  "CTA",
  "AI disclosure",
  "Self-critique",
  "First-time-right",
];

const SLOP = [
  /\bunlock\b/i,
  /\belevate\b/i,
  /\bgame[- ]changer\b/i,
  /\brevolutionize\b/i,
  /\bin today'?s world\b/i,
  /\bseamless\b/i,
  /\bsay goodbye to\b/i,
];

const METRICISH =
  /(\d+\s*%|\d+\s*\/\s*\d+|ROAS|CTR|CPA|[\d,]+\s*(customers|reviews|stars|users))/i;

function fail(issues, id, msg, line) {
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

  // Shape-only examples must not claim ship PASS in QA
  if (/structure only|shape-only|not a length or quality target/i.test(text)) {
    if (/Checklist gates:\s*PASS\b|lint-package\.mjs:\s*PASS\b/i.test(text)) {
      fail(
        issues,
        "shape-claims-pass",
        "Shape-only example must not claim checklist/lint PASS"
      );
    }
  }

  return issues;
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
