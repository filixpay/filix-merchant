#!/usr/bin/env node
/**
 * Download flag-icons SVGs for supported ledger currencies.
 * Source: https://github.com/lipis/flag-icons (MIT)
 *
 * Usage: node scripts/download-currency-flags.mjs [path/to/currency-list.txt]
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outputDir = path.join(repoRoot, "public", "flags");
const defaultSeedPath = path.resolve(
  repoRoot,
  "../filix-pay/sql/ops/2026-08-12-ledger-asset-fiat-baseline-pg.sql",
);

/** Pinned release for reproducible downloads. */
const FLAG_ICONS_VERSION = "7.5.0";
const FLAG_ICONS_BASE = `https://cdn.jsdelivr.net/npm/flag-icons@${FLAG_ICONS_VERSION}/flags/1x1`;

const CURRENCY_FLAG_OVERRIDES = {
  ANG: "cw",
  EUR: "eu",
  USDT: "usdt",
  XCD: "ag",
  XDR: "un",
  XOF: "sn",
  XPF: "pf",
};

const EXTRA_ASSETS = ["USDT"];
const CUSTOM_FLAG_CODES = new Set(["usdt"]);

function resolveFlagCode(currencyCode) {
  const code = currencyCode.trim().toUpperCase();
  if (CURRENCY_FLAG_OVERRIDES[code]) {
    return CURRENCY_FLAG_OVERRIDES[code];
  }
  if (/^[A-Z]{3}$/.test(code)) {
    return code.slice(0, 2).toLowerCase();
  }
  return null;
}

async function loadCurrencyCodes(inputPath) {
  if (inputPath.endsWith(".sql")) {
    const sql = await readFile(inputPath, "utf8");
    const matches = [...sql.matchAll(/,\s*'([A-Z]{3})',\s*'FIAT'/g)];
    return [...new Set(matches.map((match) => match[1]))];
  }

  const text = await readFile(inputPath, "utf8");
  return [
    ...new Set(
      text
        .split(/\r?\n/)
        .map((line) => line.trim().toUpperCase())
        .filter((line) => /^[A-Z]{3}$/.test(line)),
    ),
  ];
}

async function downloadFlag(flagCode) {
  const url = `${FLAG_ICONS_BASE}/${flagCode}.svg`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const svg = await response.text();
  if (!svg.includes("<svg")) {
    throw new Error("invalid svg payload");
  }
  await writeFile(path.join(outputDir, `${flagCode}.svg`), svg, "utf8");
}

async function main() {
  const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultSeedPath;
  const currencyCodes = [...(await loadCurrencyCodes(inputPath)), ...EXTRA_ASSETS];
  const flagCodes = [...new Set(currencyCodes.map(resolveFlagCode).filter(Boolean))];

  await mkdir(outputDir, { recursive: true });

  const failures = [];
  let downloaded = 0;
  let skipped = 0;

  for (const flagCode of flagCodes.sort()) {
    if (CUSTOM_FLAG_CODES.has(flagCode)) {
      skipped += 1;
      process.stdout.write(`• ${flagCode} (custom SVG in repo, skipped download)\n`);
      continue;
    }
    try {
      await downloadFlag(flagCode);
      downloaded += 1;
      process.stdout.write(`✓ ${flagCode}\n`);
    } catch (error) {
      failures.push({ flagCode, error: error instanceof Error ? error.message : String(error) });
      process.stderr.write(`✗ ${flagCode}: ${failures.at(-1).error}\n`);
    }
  }

  process.stdout.write(
    `\nDownloaded ${downloaded} flag-icons SVGs (${skipped} custom) to public/flags/\n`,
  );

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
