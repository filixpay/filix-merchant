#!/usr/bin/env node
/**
 * Portal Contract Gate — Wallet Read API v1
 *
 * Enforces:
 * 1. balance page subtree imports only wallet-reads (no legacy merchant balance)
 * 2. wallet-reads.ts does not leak Accounting vocabulary
 * 3. wallet components do not import legacy services
 *
 * Run: npm run verify:wallet-read-contract
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
let errors = 0;

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

function fail(file, message) {
  console.error(`FAIL  ${rel(file)}: ${message}`);
  errors++;
}

// --- Gate 1: Balance page subtree must not import legacy APIs ---

const balanceSubtree = join(root, "src/app/[locale]/dashboard/balance");
const walletComponents = join(root, "src/components/wallet");

const forbiddenImportsBalancePage = [
  /from\s+["'].*domains\/merchants["']/,
  /from\s+["'].*domains\/ledger["']/,
  /getBalance\s*\(/,
  /getLedgerMovements\s*\(/,
  /import.*CreateDepositModal/,
  /import.*CreateWithdrawalModal/,
  /import.*CreateTransferModal/,
  /MERCHANT_BALANCE/,
  /MERCHANT_LEDGER_MOVEMENTS/,
];

const scopedDirs = [balanceSubtree];

for (const dir of scopedDirs) {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) continue;
  for (const file of walkFiles(dir)) {
    const content = readFileSync(file, "utf8");
    for (const pattern of forbiddenImportsBalancePage) {
      if (pattern.test(content)) {
        fail(file, `forbidden reference: ${pattern}`);
      }
    }
  }
}

// --- Gate 2: wallet-reads.ts must not leak Accounting vocabulary ---

const walletReadsPath = join(root, "src/lib/api/domains/wallet-reads.ts");
const walletReadsContent = readFileSync(walletReadsPath, "utf8");

const forbiddenInWalletReads = [
  "availablePayable",
  "pendingPayable",
  "currency",
  "MerchantBalance",
  "LedgerEntry",
];

for (const term of forbiddenInWalletReads) {
  if (walletReadsContent.includes(term)) {
    fail(walletReadsPath, `Accounting vocabulary leak: "${term}"`);
  }
}

if (walletReadsContent.includes("ledger-movements") || walletReadsContent.includes("getLedgerMovements")) {
  fail(walletReadsPath, "wallet-reads must not call /portal/merchant/ledger-movements");
}

if (walletReadsContent.includes("MERCHANT_LEDGER_MOVEMENTS")) {
  fail(walletReadsPath, "wallet-reads must not reference MERCHANT_LEDGER_MOVEMENTS");
}

// --- Gate 3: Required exports in wallet-reads.ts ---

const requiredExports = [
  "WalletOverviewView",
  "WalletAccountsResponse",
  "WalletCapabilityView",
  "WalletAssetCapabilityView",
  "WalletMovementView",
  "WalletNetworksResponse",
  "WalletAddressesResponse",
  "WalletIdentitySummaryView",
  "walletReadsApi",
  "getNetworks",
  "getAddresses",
  "getAssetCapability",
  "getIdentitySummary",
  "normalizeIdentitySummary",
  "loadIdentitySummariesBestEffort",
];

for (const name of requiredExports) {
  if (!walletReadsContent.includes(name)) {
    fail(walletReadsPath, `missing required export: "${name}"`);
  }
}

if (!walletReadsContent.includes("WALLET_ACCOUNT_CAPABILITY") && !walletReadsContent.includes("getAssetCapability")) {
  fail(walletReadsPath, "missing getAssetCapability asset capability client");
}

if (
  !walletReadsContent.includes("WALLET_ACCOUNT_IDENTITY_SUMMARY") &&
  !walletReadsContent.includes("getIdentitySummary")
) {
  fail(walletReadsPath, "missing getIdentitySummary identity summary client");
}

if (walletReadsContent.includes("identity-summaries") || /WALLET_IDENTITY_SUMMARIES\b/.test(walletReadsContent)) {
  fail(walletReadsPath, "batch identity-summary API is forbidden in W5");
}

const summaryMatch = walletReadsContent.match(
  /export interface WalletIdentitySummaryView \{([\s\S]*?)\}/,
);
if (!summaryMatch) {
  fail(walletReadsPath, "missing WalletIdentitySummaryView interface");
} else {
  const body = summaryMatch[1];
  for (const forbidden of [
    "walletAssetId",
    "ledgerBindStatus",
    "accountStatus",
    "walletAccountStatus",
    "ownerId",
    "available",
    "pending",
    "frozen",
    "balance",
    "addressId",
  ]) {
    if (new RegExp(`\\b${forbidden}\\b`).test(body)) {
      fail(walletReadsPath, `WalletIdentitySummaryView must not include "${forbidden}"`);
    }
  }
  if (!body.includes("networks")) {
    fail(walletReadsPath, "WalletIdentitySummaryView must include networks");
  }
  if (!body.includes("assetStatus")) {
    fail(walletReadsPath, "WalletIdentitySummaryView must include assetStatus");
  }
}

// Thin gate: WalletCapabilityView must not declare deposit/withdraw/transfer/payment
const gateMatch = walletReadsContent.match(
  /export interface WalletCapabilityView \{([\s\S]*?)\}/,
);
if (!gateMatch) {
  fail(walletReadsPath, "missing WalletCapabilityView interface");
} else {
  const body = gateMatch[1];
  for (const op of ["deposit", "withdraw", "transfer", "payment"]) {
    if (new RegExp(`\\b${op}\\b`).test(body)) {
      fail(walletReadsPath, `thin WalletCapabilityView must not include "${op}"`);
    }
  }
  if (!body.includes("walletEnabled")) {
    fail(walletReadsPath, `thin WalletCapabilityView must include walletEnabled`);
  }
}

// --- Gate 3b: No four-op StatusCard recreation ---

const statusCardPath = join(root, "src/components/wallet/WalletCapabilityStatusCard.tsx");
if (statSync(statusCardPath, { throwIfNoEntry: false })?.isFile()) {
  fail(statusCardPath, "WalletCapabilityStatusCard must be removed (Wave 2)");
}

for (const dir of [balanceSubtree, walletComponents]) {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) continue;
  for (const file of walkFiles(dir)) {
    const content = readFileSync(file, "utf8");
    if (content.includes("WalletCapabilityStatusCard")) {
      fail(file, "must not import WalletCapabilityStatusCard");
    }
    // Forbid recreating four-op deposit/withdraw/transfer/payment rows from Asset Capability
    if (
      /capability\.(deposit|withdraw|transfer|payment)/.test(content) ||
      /OPS\s*=\s*\[\s*["']deposit["']/.test(content)
    ) {
      fail(file, "must not recreate four-operation capability UI");
    }
  }
}

// --- Gate 4: Identity fixtures must not carry money fields ---

const FORBIDDEN_IDENTITY_FIELDS = [
  "available",
  "pending",
  "frozen",
  "balance",
  "amount",
  "currencyAmount",
  "availablePayable",
  "pendingPayable",
];

const identityFixture = {
  assetCode: "USDT",
  networks: [{ network: "TRON", enabled: true, collectionAddressCount: 1 }],
  addresses: [
    {
      addressId: "42",
      network: "TRON",
      address: "T…",
      purpose: "COLLECTION",
      custodyType: "HOT",
      status: "ACTIVE",
      label: null,
      createdAt: "2026-08-05T12:00:00Z",
      ledgerBindStatus: "PENDING_BIND",
      operations: { copy: true, qr: true },
    },
  ],
};

function collectKeys(value, acc = new Set()) {
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      acc.add(k);
      collectKeys(v, acc);
    }
  }
  return acc;
}

const identityKeys = collectKeys(identityFixture);
for (const field of FORBIDDEN_IDENTITY_FIELDS) {
  if (identityKeys.has(field)) {
    fail(walletReadsPath, `identity fixture contains forbidden money field: "${field}"`);
  }
}

if (!walletReadsContent.includes("WALLET_ACCOUNT_NETWORKS") && !walletReadsContent.includes("getNetworks")) {
  fail(walletReadsPath, "missing getNetworks identity client");
}

// --- Gate 5: Balance page must consume Identity Summary best-effort ---

const balancePagePath = join(root, "src/app/[locale]/dashboard/balance/page.tsx");
if (statSync(balancePagePath, { throwIfNoEntry: false })?.isFile()) {
  const balancePageContent = readFileSync(balancePagePath, "utf8");
  if (!balancePageContent.includes("loadIdentitySummariesBestEffort")) {
    fail(balancePagePath, "must load Identity Summary via loadIdentitySummariesBestEffort");
  }
  if (!balancePageContent.includes("getIdentitySummary")) {
    fail(balancePagePath, "must call getIdentitySummary per displayed asset");
  }
  // Summary must not introduce Runtime action buttons
  for (const forbidden of ["CreateDepositModal", "CreateWithdrawalModal", "activate", "suspend"]) {
    if (balancePageContent.includes(forbidden)) {
      fail(balancePagePath, `must not introduce Runtime action "${forbidden}" from Summary`);
    }
  }
}

// --- Result ---

if (errors > 0) {
  console.error(`\n${errors} contract violation(s) found.`);
  process.exit(1);
} else {
  console.log("✅ Wallet Read API v1.1 contract gate: all checks passed.");
}
