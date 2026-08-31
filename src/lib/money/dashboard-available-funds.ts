import type { MoneyAssetBalance } from "@/lib/api/domains/money";

export type DashboardAvailableAsset = {
  assetCode: string;
  available: string;
};

export type DashboardAvailableFundsSummary = {
  visible: DashboardAvailableAsset[];
  totalCount: number;
  hiddenCount: number;
};

const DEFAULT_MAX_VISIBLE = 2;

/**
 * Dashboard summary of AVAILABLE buckets from Money Balance Projection.
 * Same read surface as Funds Balance — never invents totals across assets.
 */
export function presentDashboardAvailableFunds(
  balances: ReadonlyArray<MoneyAssetBalance>,
  maxVisible = DEFAULT_MAX_VISIBLE,
): DashboardAvailableFundsSummary {
  const assets = [...balances]
    .map((row) => {
      const available = row.buckets.find((b) => b.balanceType === "AVAILABLE");
      if (!available) {
        return null;
      }
      return { assetCode: row.assetCode, available: available.amount };
    })
    .filter((row): row is DashboardAvailableAsset => row != null)
    .sort((a, b) => a.assetCode.localeCompare(b.assetCode));

  const limit = Math.max(0, maxVisible);
  return {
    visible: assets.slice(0, limit),
    totalCount: assets.length,
    hiddenCount: Math.max(0, assets.length - limit),
  };
}
