export function moneyTransfersPath(locale: string): string {
  return `/${locale}/dashboard/money/transfers`;
}

export function moneyTransfersDetailPath(locale: string, transferId: string): string {
  return `/${locale}/dashboard/money/transfers/${encodeURIComponent(transferId)}`;
}
