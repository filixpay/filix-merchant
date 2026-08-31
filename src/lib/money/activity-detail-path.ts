import { moneyMoneyInDetailPath } from "@/lib/money/money-in-redirect";
import { moneyPayoutsDetailPath } from "@/lib/money/money-payouts-redirect";
import { moneyTransfersDetailPath } from "@/lib/money/money-transfers-redirect";

/**
 * Map Activity source to product detail path for known source types only.
 * Presentation navigation — does not select Runtime execution endpoints.
 */
export function resolveActivityDetailPath(
  locale: string,
  sourceType: string | null | undefined,
  sourceId: string | null | undefined,
): string | null {
  const id = sourceId?.trim() ?? "";
  if (!id) return null;

  switch (sourceType?.trim()) {
    case "MONEY_IN_INTENT":
      return moneyMoneyInDetailPath(locale, id);
    case "MONEY_OUT_INTENT":
      return moneyPayoutsDetailPath(locale, id);
    case "TRANSFER_RECORD":
      return moneyTransfersDetailPath(locale, id);
    default:
      return null;
  }
}
