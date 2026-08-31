import type { MoneyAssetBalance, MoneyAssetCapability, MoneyOpCapability } from "@/lib/api/domains/money";

export type CapAvailabilityStatus = "ALLOW" | "UNAVAILABLE" | "UNKNOWN";

export type BalanceVisibilityRow = {
  assetCode: string;
  buckets: ReadonlyArray<{ balanceType: string; amount: string }>;
  asOf: string;
  moneyIn: CapAvailabilityStatus;
  payout: CapAvailabilityStatus;
};

/**
 * Build read-only multi-asset visibility rows.
 *
 * - Order: trust API order when present; otherwise sort assetCode ascending.
 * - Buckets: only those returned by the API (never invent PENDING/CLEARING).
 * - Cap status: from Capability Decision only — never inferred from balances.
 * - No cross-asset monetary total.
 */
export function presentBalanceVisibility(
  balances: ReadonlyArray<MoneyAssetBalance>,
  capabilitiesByAsset: ReadonlyMap<string, MoneyAssetCapability>,
): BalanceVisibilityRow[] {
  const ordered = [...balances].sort((a, b) => a.assetCode.localeCompare(b.assetCode));
  return ordered.map((row) => {
    const cap = capabilitiesByAsset.get(row.assetCode);
    return {
      assetCode: row.assetCode,
      buckets: row.buckets.map((b) => ({
        balanceType: b.balanceType,
        amount: b.amount,
      })),
      asOf: row.asOf,
      moneyIn: capStatus(cap?.moneyIn),
      payout: capStatus(cap?.payout),
    };
  });
}

function capStatus(op: MoneyOpCapability | undefined): CapAvailabilityStatus {
  if (!op) {
    return "UNKNOWN";
  }
  if (op.productized && op.enabled) {
    return "ALLOW";
  }
  return "UNAVAILABLE";
}
