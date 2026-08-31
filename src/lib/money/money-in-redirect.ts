/** Locale-aware path for the Money product Money-In list page. */
export function moneyMoneyInPath(locale: string): string {
  return `/${locale}/dashboard/money/money-in`;
}

/** Locale-aware path for Money-In detail — uses moneyInId, never clientRequestId. */
export function moneyMoneyInDetailPath(locale: string, moneyInId: string): string {
  return `/${locale}/dashboard/money/money-in/${encodeURIComponent(moneyInId)}`;
}
