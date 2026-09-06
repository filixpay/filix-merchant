import {
  isLegalContentLocale,
  type LegalContentLocale,
  type LegalSlug,
} from "@/lib/legal/content-locales";
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
  return slug === "terms" ? TERMS_BY_LOCALE[loc] : PRIVACY_BY_LOCALE[loc];
}

export function getTerms(locale: string): LegalDocument {
  return getLegalDocument("terms", locale);
}

export function getPrivacy(locale: string): LegalDocument {
  return getLegalDocument("privacy", locale);
}

/** Sitemap/robots gate: final only when both documents are final. */
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
