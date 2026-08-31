const CURRENCY_CODE = "USD";

export function formatCommercePrice(amount: number | null, locale: string): string {
  if (amount === null || Number.isNaN(amount)) {
    return "—";
  }
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${CURRENCY_CODE} ${formatted}`;
}

export const COMMERCE_CURRENCY_CODE = CURRENCY_CODE;
