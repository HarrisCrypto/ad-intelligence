#!/usr/bin/env node
/**
 * Validate every breakdowns/*.json against schema/ad-breakdown.schema.json
 * and the claim/proof honesty rules. Also checks index.json is current.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { breakdownHonestyErrors } from "./breakdown-honesty.mjs";
import { buildIndex, loadBreakdowns } from "./build-index.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const schema = JSON.parse(
  fs.readFileSync(path.join(root, "schema/ad-breakdown.schema.json"), "utf8")
);

function typeOf(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function checkString(value, rule, pathName, errors) {
  if (typeof value !== "string") {
    errors.push(`${pathName} must be string`);
    return;
  }
  if (rule.minLength && value.length < rule.minLength) {
    errors.push(`${pathName} shorter than ${rule.minLength}`);
  }
  if (rule.maxLength && value.length > rule.maxLength) {
    errors.push(`${pathName} longer than ${rule.maxLength}`);
  }
  if (rule.pattern && !new RegExp(rule.pattern).test(value)) {
    errors.push(`${pathName} failed pattern ${rule.pattern}`);
  }
  if (rule.enum && !rule.enum.includes(value)) {
    errors.push(`${pathName} not in enum`);
  }
}

function checkNode(value, rule, pathName, errors) {
  if (!rule) return;
  if (rule.oneOf) {
    const snapshot = errors.length;
    let ok = false;
    for (const branch of rule.oneOf) {
      const local = [];
      checkNode(value, branch, pathName, local);
      if (local.length === 0) {
        ok = true;
        break;
      }
    }
    if (!ok) errors.push(`${pathName} matched no oneOf branch`);
    else errors.splice(snapshot);
    return;
  }
  if (rule.type === "object" || (Array.isArray(rule.type) && rule.type.includes("object") && value && typeof value === "object")) {
    if (typeOf(value) !== "object") {
      errors.push(`${pathName} must be object`);
      return;
    }
    if (rule.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!rule.properties?.[key]) errors.push(`${pathName}.${key} is not allowed`);
      }
    }
    for (const key of rule.required || []) {
      if (value[key] === undefined) errors.push(`${pathName}.${key} required`);
    }
    for (const [key, child] of Object.entries(rule.properties || {})) {
      if (value[key] !== undefined) checkNode(value[key], child, `${pathName}.${key}`, errors);
    }
    return;
  }
  if (rule.type === "array") {
    if (!Array.isArray(value)) {
      errors.push(`${pathName} must be array`);
      return;
    }
    if (rule.minItems && value.length < rule.minItems) {
      errors.push(`${pathName} needs at least ${rule.minItems} items`);
    }
    value.forEach((item, i) => checkNode(item, rule.items, `${pathName}[${i}]`, errors));
    return;
  }
  if (rule.type === "integer") {
    if (!Number.isInteger(value)) errors.push(`${pathName} must be integer`);
    if (rule.minimum != null && value < rule.minimum) errors.push(`${pathName} below min`);
    if (rule.maximum != null && value > rule.maximum) errors.push(`${pathName} above max`);
    return;
  }
  if (rule.type === "number") {
    if (typeof value !== "number" || Number.isNaN(value)) errors.push(`${pathName} must be number`);
    if (rule.exclusiveMinimum != null && !(value > rule.exclusiveMinimum)) {
      errors.push(`${pathName} must be > ${rule.exclusiveMinimum}`);
    }
    return;
  }
  if (rule.type === "null") {
    if (value !== null) errors.push(`${pathName} must be null`);
    return;
  }
  if (rule.type === "string") checkString(value, rule, pathName, errors);
}

function validateCard(card) {
  const errors = [];
  for (const key of schema.required) {
    if (card[key] === undefined) errors.push(`missing ${key}`);
  }
  if (schema.additionalProperties === false) {
    for (const key of Object.keys(card)) {
      if (!schema.properties[key]) errors.push(`unknown field ${key}`);
    }
  }
  checkNode(card, schema, "$", errors);
  errors.push(...breakdownHonestyErrors(card));
  return errors;
}

const items = loadBreakdowns();
let failed = 0;
const ids = new Set();
for (const { file, card } of items) {
  if (ids.has(card.id)) {
    console.error(`${file}: duplicate id ${card.id}`);
    failed += 1;
    continue;
  }
  ids.add(card.id);
  const base = path.basename(file, ".json");
  if (base !== card.id) {
    console.error(`${file}: filename must match id ${card.id}`);
    failed += 1;
  }
  const errors = validateCard(card);
  if (errors.length) {
    failed += 1;
    console.error(`${file}:\n  - ${errors.join("\n  - ")}`);
  }
}

const index = buildIndex(items);
const indexPath = path.join(root, "index.json");
const expected = `${JSON.stringify(index, null, 2)}\n`;
const current = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, "utf8") : "";
if (current !== expected) {
  console.error("index.json is stale. Run: node scripts/build-index.mjs");
  failed += 1;
}

if (failed) {
  console.error(JSON.stringify({ ok: false, files: items.length, failed }));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, files: items.length }));
