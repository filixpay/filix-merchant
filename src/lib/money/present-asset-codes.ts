import type { MoneyAssetBalance } from "@/lib/api";

/** Distinct asset codes from present balances, sorted ascending (balance/activity default). */
export function sortedPresentAssetCodes(balances: MoneyAssetBalance[]): string[] {
  return [...new Set(balances.map((b) => b.assetCode))].sort((a, b) => a.localeCompare(b));
}
