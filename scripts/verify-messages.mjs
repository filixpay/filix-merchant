#!/usr/bin/env node
/**
 * P2 guard: locale message file encoding and JSON health.
 * Run: npm run verify:messages
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const messagesDir = join(root, "messages");

const MOJIBAKE_PATTERNS = [
  { name: "latin1-mojibake (Ã…)", pattern: /Ã[\u0080-\u00BF]/ },
  { name: "utf8-quote-mojibake (â€)", pattern: /â€[\u0080-\u009F]?/ },
  { name: "replacement-character (�)", pattern: /\uFFFD/ },
  { name: "gbk-garbage (锟斤拷)", pattern: /锟斤拷/ },
];

function flattenKeys(value, prefix = "") {
  const keys = [];
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return keys;
  }
  for (const [key, nested] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (nested !== null && typeof nested === "object" && !Array.isArray(nested)) {
      keys.push(...flattenKeys(nested, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

function collectStringValues(value, acc = []) {
  if (typeof value === "string") {
    acc.push(value);
    return acc;
  }
  if (value === null || typeof value !== "object") {
    return acc;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectStringValues(item, acc);
    }
    return acc;
  }
  for (const nested of Object.values(value)) {
    collectStringValues(nested, acc);
  }
  return acc;
}

const failures = [];
const warnings = [];
const files = readdirSync(messagesDir)
  .filter((name) => name.endsWith(".json"))
  .sort();

const parsed = new Map();

for (const file of files) {
  const filePath = join(messagesDir, file);
  const buffer = readFileSync(filePath);

  if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    warnings.push(`${file}: UTF-8 BOM present (prefer BOM-free JSON)`);
  }

  let text;
  try {
    text = buffer.toString("utf8");
  } catch (error) {
    failures.push({
      check: `${file}: UTF-8 decode`,
      detail: error instanceof Error ? error.message : String(error),
    });
    continue;
  }

  if (text.includes("\u0000")) {
    failures.push({
      check: `${file}: null bytes`,
      detail: "file contains embedded null characters",
    });
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch (error) {
    failures.push({
      check: `${file}: JSON parse`,
      detail: error instanceof Error ? error.message : String(error),
    });
    continue;
  }

  if (json === null || typeof json !== "object" || Array.isArray(json)) {
    failures.push({
      check: `${file}: root shape`,
      detail: "expected top-level JSON object",
    });
    continue;
  }

  parsed.set(file, json);

  for (const { name, pattern } of MOJIBAKE_PATTERNS) {
    const hits = collectStringValues(json).filter((value) => pattern.test(value));
    if (hits.length > 0) {
      failures.push({
        check: `${file}: ${name}`,
        detail: `${hits.length} string value(s), first: ${JSON.stringify(hits[0]).slice(0, 80)}`,
      });
    }
  }
}

const baseline = parsed.get("en.json");
if (baseline) {
  const baselineKeys = new Set(flattenKeys(baseline));
  for (const file of files) {
    if (file === "en.json") continue;
    const locale = parsed.get(file);
    if (!locale) continue;

    const localeKeys = new Set(flattenKeys(locale));
    const missing = [...baselineKeys].filter((key) => !localeKeys.has(key));
    const extra = [...localeKeys].filter((key) => !baselineKeys.has(key));

    if (missing.length > 0) {
      warnings.push(
        `${file}: ${missing.length} key(s) missing vs en.json (first: ${missing.slice(0, 3).join(", ")})`,
      );
    }
    if (extra.length > 0) {
      warnings.push(
        `${file}: ${extra.length} extra key(s) vs en.json (first: ${extra.slice(0, 3).join(", ")})`,
      );
    }
  }
} else {
  failures.push({
    check: "messages/en.json",
    detail: "baseline locale file missing or invalid",
  });
}

if (warnings.length > 0) {
  console.warn("verify:messages warnings\n");
  for (const warning of warnings) {
    console.warn(`  ! ${warning}`);
  }
  console.warn("");
}

if (failures.length > 0) {
  console.error("verify:messages FAILED\n");
  for (const failure of failures) {
    console.error(`  ✗ ${failure.check} (${failure.detail})`);
  }
  process.exit(1);
}

console.log("verify:messages passed");
console.log(`  ✓ ${files.length} locale file(s) are valid UTF-8 JSON`);
console.log("  ✓ no mojibake patterns detected in string values");
if (warnings.length > 0) {
  console.log(`  ! ${warnings.length} key-parity warning(s) vs en.json (informational)`);
} else {
  console.log("  ✓ all locales match en.json key sets");
}
