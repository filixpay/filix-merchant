/**
 * Display fraction digits for a Money decimal string.
 * Fiat uses ISO 4217 currency precision (EUR → 2, JPY → 0).
 * Unknown / crypto codes keep significant fractional digits, clamped 2–8.
 */
export function resolveDisplayFractionDigits(amount: string, assetCode: string): number {
  const code = assetCode?.trim().toUpperCase() || "CNY";
  try {
    const digits = new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
    }).resolvedOptions().maximumFractionDigits;
    if (typeof digits === "number") {
      return digits;
    }
  } catch {
    // Not an ISO 4217 currency — fall through to crypto-style precision.
  }

  const fraction = amount.includes(".") ? (amount.split(".")[1] ?? "") : "";
  const significant = fraction.replace(/0+$/, "").length;
  return Math.min(Math.max(significant, 2), 8);
}

/**
 * Format Money product decimal-string amounts for display.
 * Parsing is formatter-internal only — Money domain types keep amounts as string.
 */
export function formatMoneyAmount(amount: string, assetCode = "CNY", locale = "en-US"): string {
  const raw = amount?.trim() ?? "";
  if (!raw) {
    return "—";
  }
  if (!/^-?\d+(\.\d+)?$/.test(raw)) {
    return raw;
  }

  const digits = resolveDisplayFractionDigits(raw, assetCode);
  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) {
    return raw;
  }

  try {
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(numeric);
    return `${formatted} ${assetCode}`;
  } catch {
    return `${raw} ${assetCode}`;
  }
}

/**
 * Format amount for movement cells: always unsigned body + single assetCode.
 * Callers prepend sign outside this string to avoid "--500.00 USD".
 */
export function formatUnsignedMoneyAmount(
  amount: string,
  assetCode = "CNY",
  locale = "en-US",
): string {
  const raw = amount?.trim() ?? "";
  if (!raw) {
    return "—";
  }
  // Accept optional leading + / - then normalize to absolute decimal string.
  const signedMatch = raw.match(/^([+-]?)(\d+(?:\.\d+)?)$/);
  if (!signedMatch) {
    return raw;
  }
  const absRaw = signedMatch[2];
  return formatMoneyAmount(absRaw, assetCode, locale);
}
