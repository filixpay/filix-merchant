/** Locale-aware path for the Money product Payouts list page. */
export function moneyPayoutsPath(locale: string): string {
  return `/${locale}/dashboard/money/payouts`;
}

/** Locale-aware path for Payout detail — uses payoutId, never clientRequestId. */
export function moneyPayoutsDetailPath(locale: string, payoutId: string): string {
  return `/${locale}/dashboard/money/payouts/${encodeURIComponent(payoutId)}`;
}
