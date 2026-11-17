#!/usr/bin/env node
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const APPLY = process.argv.includes("--apply");

function walkFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walkFiles(full, acc);
    else if (/\.(tsx?|jsx?|mjs)$/.test(entry)) acc.push(full);
  }
  return acc;
}

function flattenLeaves(value, prefix = "") {
  const keys = [];
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    if (prefix) keys.push(prefix);
    return keys;
  }
  for (const [key, nested] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (nested !== null && typeof nested === "object" && !Array.isArray(nested)) {
      keys.push(...flattenLeaves(nested, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

function pruneTree(value, used, prefix = "") {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return used.has(prefix) ? value : undefined;
  }
  const next = {};
  for (const [key, nested] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const kept = pruneTree(nested, used, path);
    if (kept !== undefined) next[key] = kept;
  }
  return Object.keys(next).length ? next : undefined;
}

const enPath = join(root, "messages", "en.json");
const en = JSON.parse(readFileSync(enPath, "utf8"));
const allKeys = flattenLeaves(en);
const topNamespaces = new Set(Object.keys(en));

const staticKeys = new Set();
const dynamicPrefixes = new Set();
const fullHits = new Set();

const nsRe =
  /(?:useTranslations|getTranslations)\(\s*(?:\{[\s\S]*?namespace:\s*)?['"]([^'"]+)['"]/g;
const staticCallRe = /\.\s*(?:has|raw)?\(\s*['"]([A-Za-z][A-Za-z0-9_.]*)['"]/g;
const tIdentCallRe =
  /\b(?:t|tc|t[A-Z][A-Za-z0-9]*)(?:\.has|\.raw)?\(\s*['"]([A-Za-z][A-Za-z0-9_.]*)['"]/g;
const templatePrefixRe = /`([A-Za-z][A-Za-z0-9_.]*)\$\{/g;
const labelKeyRe = /labelKey:\s*['"]([A-Za-z][A-Za-z0-9_.]*)['"]/g;
const hintKeyRe = /hintKey:\s*['"]([A-Za-z][A-Za-z0-9_.]*)['"]/g;

const files = [
  ...walkFiles(join(root, "src")),
  ...walkFiles(join(root, "scripts")),
];

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const namespaces = [];
  for (const m of text.matchAll(nsRe)) namespaces.push(m[1]);

  const locals = new Set();
  for (const re of [staticCallRe, tIdentCallRe, labelKeyRe, hintKeyRe]) {
    re.lastIndex = 0;
    for (const m of text.matchAll(re)) locals.add(m[1]);
  }

  for (const key of locals) {
    staticKeys.add(key);
    if (topNamespaces.has(key.split(".")[0]) && allKeys.includes(key)) {
      fullHits.add(key);
    }
    for (const ns of namespaces) {
      staticKeys.add(`${ns}.${key}`);
    }
  }

  templatePrefixRe.lastIndex = 0;
  for (const m of text.matchAll(templatePrefixRe)) {
    const prefix = m[1];
    dynamicPrefixes.add(prefix);
    for (const ns of namespaces) {
      dynamicPrefixes.add(`${ns}.${prefix}`);
    }
  }
}

function isUsed(fullKey) {
  if (fullHits.has(fullKey)) return true;
  if (staticKeys.has(fullKey)) return true;
  for (const sk of staticKeys) {
    if (sk.includes(".") && fullKey === sk) return true;
    if (sk.includes(".") && fullKey.endsWith(`.${sk}`)) return true;
  }
  for (const prefix of dynamicPrefixes) {
    if (fullKey === prefix || fullKey.startsWith(`${prefix}.`)) return true;
  }
  return false;
}

const used = [];
const unused = [];
for (const key of allKeys) {
  if (isUsed(key)) used.push(key);
  else unused.push(key);
}

const unusedByNs = new Map();
for (const key of unused) {
  const ns = key.split(".")[0];
  unusedByNs.set(ns, (unusedByNs.get(ns) || 0) + 1);
}

const debugPrefixes = [...dynamicPrefixes].filter((p) => p.includes("config_fields"));
console.log("config_fields prefixes:", debugPrefixes);
console.log(
  "CoverageConfig.config_fields.teamId used?",
  isUsed("CoverageConfig.config_fields.teamId"),
);

console.log(`en.json leaves: ${allKeys.length}`);
console.log(`used: ${used.length}`);
console.log(`unused: ${unused.length}`);
console.log("unused by namespace:");
for (const [ns, n] of [...unusedByNs.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)} ${ns}`);
}

if (!APPLY) {
  console.log("\nfirst 80 unused keys:");
  for (const key of unused.slice(0, 80)) console.log(`  ${key}`);
  console.log("\n(re-run with --apply to prune locale files)");
  process.exit(0);
}

const usedSet = new Set(used);
const prunedEn = pruneTree(en, usedSet);
writeFileSync(enPath, `${JSON.stringify(prunedEn, null, 2)}\n`);

const messagesDir = join(root, "messages");
for (const file of readdirSync(messagesDir).filter((n) => n.endsWith(".json"))) {
  if (file === "en.json") continue;
  const filePath = join(messagesDir, file);
  const json = JSON.parse(readFileSync(filePath, "utf8"));
  const localeLeaves = new Set(flattenLeaves(json));
  const keep = new Set([...localeLeaves].filter((k) => usedSet.has(k)));
  const pruned = pruneTree(json, keep) ?? {};
  writeFileSync(filePath, `${JSON.stringify(pruned, null, 2)}\n`);
  console.log(`wrote ${file}`);
}

console.log("pruned locale files to referenced English keys");
