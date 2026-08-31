#!/usr/bin/env node
/**
 * Regression guard for P0 API auth hardening.
 * Run: npm run verify:auth-contract
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();

const ACCESS_TOKEN_OPTIONAL_ALLOWLIST = new Set([
  "src/types/next-auth.d.ts",
  "src/components/layout/DashboardLayout.tsx",
]);

function walkFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      walkFiles(full, acc);
    } else if (/\.(tsx?|jsx?)$/.test(entry)) {
      acc.push(full);
    }
  }
  return acc;
}

function rel(path) {
  return relative(root, path).replace(/\\/g, "/");
}

function lineMatches(content, pattern) {
  const lines = content.split("\n");
  const hits = [];
  lines.forEach((line, index) => {
    if (pattern.test(line)) {
      hits.push(index + 1);
    }
  });
  return hits;
}

const failures = [];

// 1. No optional token on Portal API methods
const apiPath = join(root, "src/lib/api.ts");
const apiContent = readFileSync(apiPath, "utf8");
const tokenOptionalHits = lineMatches(apiContent, /token\?: string/);
if (tokenOptionalHits.length > 0) {
  failures.push({
    check: "token?: string in src/lib/api.ts",
    detail: `lines ${tokenOptionalHits.join(", ")}`,
  });
}

// 2. No optional accessToken on dashboard pages and components (allowlisted exceptions)
const scanRoots = [
  join(root, "src/app/[locale]/dashboard"),
  join(root, "src/components"),
];

for (const scanRoot of scanRoots) {
  for (const file of walkFiles(scanRoot)) {
    const fileRel = rel(file);
    if (ACCESS_TOKEN_OPTIONAL_ALLOWLIST.has(fileRel)) continue;

    const content = readFileSync(file, "utf8");
    const hits = lineMatches(content, /accessToken\?: string/);
    if (hits.length > 0) {
      failures.push({
        check: `accessToken?: string in ${fileRel}`,
        detail: `lines ${hits.join(", ")}`,
      });
    }
  }
}

// 3. No session accessToken casts in dashboard pages
const dashboardRoot = join(root, "src/app/[locale]/dashboard");
for (const file of walkFiles(dashboardRoot)) {
  const fileRel = rel(file);
  const content = readFileSync(file, "utf8");
  const hits = lineMatches(content, /session as \{ accessToken/);
  if (hits.length > 0) {
    failures.push({
      check: `session accessToken cast in ${fileRel}`,
      detail: `lines ${hits.join(", ")}`,
    });
  }
}

if (failures.length > 0) {
  console.error("verify:auth-contract FAILED\n");
  for (const failure of failures) {
    console.error(`  ✗ ${failure.check} (${failure.detail})`);
  }
  process.exit(1);
}

console.log("verify:auth-contract passed");
console.log("  ✓ 0 × token?: string in src/lib/api.ts");
console.log("  ✓ 0 × accessToken?: string in dashboard UI (allowlisted exceptions only)");
console.log("  ✓ 0 × session accessToken casts in dashboard pages");
