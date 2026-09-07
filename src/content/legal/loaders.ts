import {
  isLegalContentLocale,
  type LegalContentLocale,
  type LegalSlug,
} from "@/lib/legal/content-locales";
import { MERCHANT_FEES_BY_LOCALE } from "./merchant-fees";
import { MERCHANT_TERMS_BY_LOCALE } from "./merchant-terms";
import { PRIVACY_BY_LOCALE } from "./privacy";
import { TERMS_BY_LOCALE } from "./terms";
import type { LegalDocument, LegalPublicationStatus } from "./types";

function asContentLocale(locale: string): LegalContentLocale {
  return isLegalContentLocale(locale) ? locale : "en";
}

export function getLegalDocument(
  slug: LegalSlug,
  locale: string,
): LegalDocument {
  const loc = asContentLocale(locale);
  switch (slug) {
    case "terms":
      return TERMS_BY_LOCALE[loc];
    case "privacy":
      return PRIVACY_BY_LOCALE[loc];
    case "merchant-terms":
      return MERCHANT_TERMS_BY_LOCALE[loc];
    case "merchant-fees":
      return MERCHANT_FEES_BY_LOCALE[loc];
  }
}

export function getTerms(locale: string): LegalDocument {
  return getLegalDocument("terms", locale);
}

export function getPrivacy(locale: string): LegalDocument {
  return getLegalDocument("privacy", locale);
}

export function getMerchantTerms(locale: string): LegalDocument {
  return getLegalDocument("merchant-terms", locale);
}

export function getMerchantFees(locale: string): LegalDocument {
  return getLegalDocument("merchant-fees", locale);
}

/** Sitemap/robots gate: final only when platform Terms + Privacy are final. */
export function getLegalPublicationStatus(): LegalPublicationStatus {
  const terms = TERMS_BY_LOCALE.en.status;
  const privacy = PRIVACY_BY_LOCALE.en.status;
  return terms === "final" && privacy === "final" ? "final" : "draft";
}

export function listIndexableLegalPaths(): { path: string; slug: LegalSlug }[] {
  if (getLegalPublicationStatus() !== "final") return [];
  return [
    { path: "/terms", slug: "terms" },
    { path: "/privacy", slug: "privacy" },
  ];
}
