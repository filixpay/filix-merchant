#!/usr/bin/env node
/**
 * Ensures server-side Merchant Portal fetches go through the shared header helper.
 * Run: npm run verify:portal-group
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();

const SCAN_DIRS = [
  join(root, "src/lib/developer"),
  join(root, "src/app/api/developer"),
];

const ALLOWLIST = new Set([
  "src/lib/developer/merchant-portal-fetch.ts",
  "src/lib/developer/bff-request.ts",
  "src/lib/developer/bff-paths.ts",
  "src/lib/developer/bff-paths.test.ts",
]);

function rel(path) {
  return relative(root, path).replace(/\\/g, "/");
}

function walkFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkFiles(full, acc);
    } else if (/\.(ts|tsx)$/.test(entry)) {
      acc.push(full);
    }
  }
  return acc;
}

const failures = [];

for (const dir of SCAN_DIRS) {
  for (const file of walkFiles(dir)) {
    const fileRel = rel(file);
    if (ALLOWLIST.has(fileRel) || fileRel.endsWith(".test.ts")) continue;

    const content = readFileSync(file, "utf8");
    const usesPortalFetch = /fetch\s*\(\s*`?\$\{API_BASE_URL\}/.test(content);
    const usesHelper =
      content.includes("merchantPortalFetch") || content.includes("buildPortalHeaders");

    if (usesPortalFetch && !usesHelper) {
      failures.push({
        check: "raw Merchant Portal fetch without portal header helper",
        detail: fileRel,
      });
    }
  }
}

// Disallow duplicated localStorage reads outside approved modules.
const headerScanRoots = [join(root, "src/lib"), join(root, "src/app/api/developer")];
const headerAllowlist = new Set([
  "src/lib/api/portal-headers.ts",
  "src/lib/merchant/selected-merchant-code.ts",
  "src/lib/developer/bff-request.ts",
]);

for (const dir of headerScanRoots) {
  for (const file of walkFiles(dir)) {
    const fileRel = rel(file);
    if (headerAllowlist.has(fileRel) || fileRel.endsWith(".test.ts")) continue;

    const content = readFileSync(file, "utf8");
    if (content.includes('localStorage.getItem("selectedMerchantCode")')) {
      failures.push({
        check: 'direct localStorage selectedMerchantCode read',
        detail: fileRel,
      });
    }
  }
}

if (failures.length > 0) {
  console.error("verify:portal-group failed:\n");
  for (const failure of failures) {
    console.error(`- [${failure.check}] ${failure.detail}`);
  }
  process.exit(1);
}

console.log("verify:portal-group passed");
