/**
 * Settlement currency options — aligned with create-order ORDER_CURRENCIES.
 * ISO 4217 codes used at merchant registration (immutable after create).
 */
export const SETTLEMENT_CURRENCY_CODES = [
  "AUD",
  "BRL",
  "CAD",
  "CNY",
  "CZK",
  "DKK",
  "EUR",
  "HKD",
  "HUF",
  "ILS",
  "JPY",
  "MYR",
  "MXN",
  "TWD",
  "NZD",
  "NOK",
  "PHP",
  "PLN",
  "GBP",
  "SGD",
  "SEK",
  "CHF",
  "THB",
  "USD",
] as const;

export type SettlementCurrencyCode = (typeof SETTLEMENT_CURRENCY_CODES)[number];

export const SETTLEMENT_CURRENCY_OPTIONS = SETTLEMENT_CURRENCY_CODES.map((value) => ({
  value,
  label: value,
}));

export function formatSettlementCurrencyLabel(code: string, locale = "en"): string {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return code;
  try {
    const name = new Intl.DisplayNames([locale], { type: "currency" }).of(normalized);
    return name ? `${normalized} — ${name}` : normalized;
  } catch {
    return normalized;
  }
}
