import { permanentRedirect } from "next/navigation";
import {
  isLegalContentLocale,
  legalDocumentPath,
  type LegalSlug,
} from "./content-locales";

/** 308 to /en/{path} when locale has no Legal content. */
export function ensureLegalLocale(locale: string, slug: LegalSlug): void {
  if (isLegalContentLocale(locale)) return;
  permanentRedirect(`/en${legalDocumentPath(slug)}`);
}
