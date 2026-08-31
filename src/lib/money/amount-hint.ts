/**
 * UX-only hint: amount exceeds available balance.
 * Does not mutate balance; Product API remains authority for create.
 */
export function shouldWarnAmountExceedsAvailable(
  amount: string,
  available: string,
): boolean {
  const amountRaw = amount?.trim() ?? "";
  const availableRaw = available?.trim() ?? "";
  if (!amountRaw || !availableRaw) {
    return false;
  }
  if (!/^-?\d+(\.\d+)?$/.test(amountRaw) || !/^-?\d+(\.\d+)?$/.test(availableRaw)) {
    return false;
  }
  const amountNum = Number(amountRaw);
  const availableNum = Number(availableRaw);
  if (!Number.isFinite(amountNum) || !Number.isFinite(availableNum)) {
    return false;
  }
  return amountNum > availableNum;
}
