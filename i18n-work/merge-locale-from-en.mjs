#!/usr/bin/env node
/**
 * Rebuild a locale file to match en.json keys.
 * Overlay order: en (fallback) <- existing locale <- translated parts.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const locale = process.argv[2];
const partsDir = process.argv[3];
if (!locale) {
  console.error("usage: node scripts/merge-locale-from-en.mjs <locale> [translated-parts-dir]");
  process.exit(1);
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function overlayAligned(enNode, layers) {
  if (!isPlainObject(enNode)) {
    for (let i = layers.length - 1; i >= 0; i -= 1) {
      if (layers[i] !== undefined) return layers[i];
    }
    return enNode;
  }
  const result = {};
  for (const key of Object.keys(enNode)) {
    result[key] = overlayAligned(
      enNode[key],
      layers.map((layer) => (isPlainObject(layer) ? layer[key] : undefined)),
    );
  }
  return result;
}

const root = process.cwd();
const en = JSON.parse(readFileSync(join(root, "messages/en.json"), "utf8"));
const localePath = join(root, `messages/${locale}.json`);
const existing = existsSync(localePath)
  ? JSON.parse(readFileSync(localePath, "utf8"))
  : {};

const partLayers = [];
if (partsDir && existsSync(partsDir)) {
  const files = readdirSync(partsDir)
    .filter((name) => name.endsWith(".json"))
    .sort();
  for (const file of files) {
    partLayers.push(JSON.parse(readFileSync(join(partsDir, file), "utf8")));
  }
}

const merged = overlayAligned(en, [existing, ...partLayers]);
writeFileSync(localePath, `${JSON.stringify(merged, null, 2)}\n`);
console.log(`wrote messages/${locale}.json from ${partLayers.length} overlay file(s)`);
