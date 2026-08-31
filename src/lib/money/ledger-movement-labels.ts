/**
 * Resolve MoneyBalance.movements.* label keys for ledger movement UI.
 * Display only — does not reinterpret accounting codes.
 */
export function ledgerMovementBusinessTypeKey(code: string): string {
  return `businessTypes.${code}`;
}

export function ledgerMovementBucketKey(bucket: string): string {
  return `buckets.${bucket}`;
}

export function presentLedgerMovementLabel(
  t: (key: string) => string,
  has: (key: string) => boolean,
  namespaceKey: string,
  raw: string,
): string {
  const trimmed = raw?.trim() ?? "";
  if (!trimmed) {
    return "-";
  }
  const key = `${namespaceKey}.${trimmed}`;
  return has(key) ? t(key) : trimmed;
}
