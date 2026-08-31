/** Display spacing only — API payloads must use the stripped form. */
export function formatAccountNumberForDisplay(raw: string): string {
  const compact = raw.replace(/\s+/g, "");
  if (!compact) return "";
  // Keep alphanumerics for IBAN-style values; group every 4 chars.
  const normalized = compact.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
  return normalized.replace(/(.{4})/g, "$1 ").trim();
}

export function stripAccountNumberSpaces(value: string): string {
  return value.replace(/\s+/g, "").trim();
}

const EMAIL_LIKE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Account holder should be legal name / company — not an email autofill. */
export function looksLikeEmailAccountHolder(value: string): boolean {
  return EMAIL_LIKE.test(value.trim());
}

export const EXTERNAL_ACCOUNT_COUNTRIES = [
  { value: "CN", labelKey: "create.countries.CN" as const },
  { value: "HK", labelKey: "create.countries.HK" as const },
  { value: "US", labelKey: "create.countries.US" as const },
  { value: "GB", labelKey: "create.countries.GB" as const },
  { value: "SG", labelKey: "create.countries.SG" as const },
  { value: "JP", labelKey: "create.countries.JP" as const },
] as const;

export const EXTERNAL_ACCOUNT_CURRENCIES = ["CNY", "USD", "EUR", "HKD", "JPY", "GBP"] as const;

/** First CRYPTO corridor: TRON only (presentation; server admission remains authoritative). */
export const CRYPTO_EXTERNAL_ACCOUNT_NETWORKS = ["TRON"] as const;

export type ExternalAccountTypeChoice = "BANK" | "CRYPTO";

/**
 * Presentation filter for payout destination picker.
 * USDT → ACTIVE CRYPTO × TRON; other assets → ACTIVE BANK.
 */
export function filterPayoutDestinations<
  T extends { status: string; type: string; network?: string | null },
>(accounts: T[], assetCode: string): T[] {
  const active = accounts.filter((a) => a.status === "ACTIVE");
  const asset = assetCode.trim().toUpperCase();
  if (asset === "USDT") {
    return active.filter(
      (a) => a.type === "CRYPTO" && (a.network ?? "").trim().toUpperCase() === "TRON",
    );
  }
  return active.filter((a) => a.type !== "CRYPTO");
}
