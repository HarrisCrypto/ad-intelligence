#!/usr/bin/env node
/**
 * Resolve library preset ids → executable params.
 * Usage:
 *   node library/scripts/resolve-toolbox.mjs tr_hard_cut cam_screen_ortho
 *   node library/scripts/resolve-toolbox.mjs --template tpl_home_services_missed_call
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIB = path.join(__dirname, "..");

const CATALOGS = [
  "transitions/catalog.json",
  "camera/catalog.json",
  "captions/catalog.json",
  "lighting/catalog.json",
  "grades/catalog.json",
];

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function indexAll() {
  const byId = new Map();
  for (const rel of CATALOGS) {
    const cat = loadJson(path.join(LIB, rel));
    for (const item of cat.items || []) {
      byId.set(item.id, { catalog: cat.id, ...item });
    }
  }
  const kitPath = path.join(LIB, "ui-kits/voice-agent-flat/kit.json");
  if (fs.existsSync(kitPath)) {
    const kit = loadJson(kitPath);
    byId.set(kit.id, { catalog: "ui-kits", ...kit });
  }
  const tplDir = path.join(LIB, "templates");
  if (fs.existsSync(tplDir)) {
    for (const ent of fs.readdirSync(tplDir, { withFileTypes: true })) {
      if (!ent.isDirectory()) continue;
      const tp = path.join(tplDir, ent.name, "template.json");
      if (!fs.existsSync(tp)) continue;
      const tpl = loadJson(tp);
      byId.set(tpl.id, { catalog: "templates", ...tpl });
    }
  }
  return byId;
}

const args = process.argv.slice(2);
const idx = indexAll();

if (args[0] === "--list") {
  console.log(JSON.stringify([...idx.keys()].sort(), null, 2));
  process.exit(0);
}

if (args[0] === "--template") {
  const id = args[1];
  const tpl = idx.get(id);
  if (!tpl) {
    console.error(`Unknown template: ${id}`);
    process.exit(1);
  }
  const resolved = {
    template: id,
    library: {},
    timeline: (tpl.timeline || []).map((beat) => {
      const out = { ...beat };
      for (const key of ["camera", "lighting", "transition_out"]) {
        if (beat[key] && idx.has(beat[key])) out[`${key}_resolved`] = idx.get(beat[key]);
      }
      if (beat.on_screen_text_role && tpl.library?.captions?.[beat.on_screen_text_role]) {
        const capId = tpl.library.captions[beat.on_screen_text_role];
        out.caption_preset = idx.get(capId) || { id: capId };
      }
      return out;
    }),
  };
  for (const [k, v] of Object.entries(tpl.library || {})) {
    if (typeof v === "string" && idx.has(v)) resolved.library[k] = idx.get(v);
    else if (k === "captions" && v && typeof v === "object") {
      resolved.library.captions = Object.fromEntries(
        Object.entries(v).map(([rk, id]) => [rk, idx.get(id) || { id }])
      );
    } else resolved.library[k] = v;
  }
  console.log(JSON.stringify(resolved, null, 2));
  process.exit(0);
}

if (!args.length) {
  console.error(
    "Usage: resolve-toolbox.mjs <id…> | --template <id> | --list"
  );
  process.exit(1);
}

const out = {};
let missing = 0;
for (const id of args) {
  if (!idx.has(id)) {
    out[id] = { error: "not_found" };
    missing++;
  } else out[id] = idx.get(id);
}
console.log(JSON.stringify(out, null, 2));
process.exit(missing ? 1 : 0);
