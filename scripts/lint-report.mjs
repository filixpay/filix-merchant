#!/usr/bin/env node
/**
 * Summarize eslint output by rule for lint-debt tracking.
 * Run: npm run lint:report
 */
import { spawnSync } from "node:child_process";

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["eslint", "src", "--max-warnings", "99999"],
  { encoding: "utf8", shell: process.platform === "win32" },
);

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
const ruleCounts = new Map();

for (const line of output.split("\n")) {
  const match = line.match(
    /\s(@typescript-eslint\/[\w-]+|react-hooks\/[\w-]+|react\/[\w-]+|@next\/next\/[\w-]+)\s*$/,
  );
  if (match) {
    const rule = match[1];
    ruleCounts.set(rule, (ruleCounts.get(rule) ?? 0) + 1);
  }
}

const summary = output.match(/(\d+) problems \((\d+) errors, (\d+) warnings\)/);
const totalProblems = summary ? Number(summary[1]) : ruleCounts.size;
const totalErrors = summary ? Number(summary[2]) : 0;
const totalWarnings = summary ? Number(summary[3]) : 0;

console.log("lint:report");
console.log(`  total: ${totalProblems} problems (${totalErrors} errors, ${totalWarnings} warnings)`);
console.log("  by rule:");

for (const [rule, count] of [...ruleCounts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${count}\t${rule}`);
}

if (result.status !== 0 && ruleCounts.size === 0) {
  console.error("\neslint failed before producing rule summaries");
  process.exit(result.status ?? 1);
}

process.exit(0);
