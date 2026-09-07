export type LegalSlug = "terms" | "privacy" | "merchant-terms" | "merchant-fees";

export const LEGAL_CONTENT_LOCALES = ["en", "zh"] as const;
export type LegalContentLocale = (typeof LEGAL_CONTENT_LOCALES)[number];

export function isLegalContentLocale(
  locale: string,
): locale is LegalContentLocale {
  return (LEGAL_CONTENT_LOCALES as readonly string[]).includes(locale);
}

/** Public path for a legal document (without locale prefix). */
export function legalDocumentPath(slug: LegalSlug): string {
  switch (slug) {
    case "merchant-terms":
      return "/merchant/terms";
    case "merchant-fees":
      return "/merchant/fees";
    default:
      return `/${slug}`;
  }
}
