/** ISO 3166-1 alpha-2 slugs for lipis/flag-icons SVGs in public/flags/. */
const CURRENCY_FLAG_OVERRIDES: Record<string, string> = {
  ANG: "cw",
  EUR: "eu",
  USDT: "usdt",
  XCD: "ag",
  XDR: "un",
  XOF: "sn",
  XPF: "pf",
};

/**
 * Resolve a flag-icons country code for a ledger asset / currency code.
 * Falls back to the first two letters when no explicit override exists.
 */
export function getCurrencyFlagCode(assetCode: string): string | null {
  const code = assetCode.trim().toUpperCase();
  if (!code) {
    return null;
  }

  if (CURRENCY_FLAG_OVERRIDES[code]) {
    return CURRENCY_FLAG_OVERRIDES[code];
  }

  if (/^[A-Z]{3}$/.test(code)) {
    return code.slice(0, 2).toLowerCase();
  }

  return null;
}

export function getCurrencyFlagPath(assetCode: string): string | null {
  const flagCode = getCurrencyFlagCode(assetCode);
  return flagCode ? `/flags/${flagCode}.svg` : null;
}
