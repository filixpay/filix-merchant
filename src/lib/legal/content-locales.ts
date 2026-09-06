export type LegalSlug = "terms" | "privacy";

export const LEGAL_CONTENT_LOCALES = ["en", "zh"] as const;
export type LegalContentLocale = (typeof LEGAL_CONTENT_LOCALES)[number];

export function isLegalContentLocale(
  locale: string,
): locale is LegalContentLocale {
  return (LEGAL_CONTENT_LOCALES as readonly string[]).includes(locale);
}
