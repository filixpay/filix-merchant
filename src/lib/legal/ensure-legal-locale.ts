import { permanentRedirect } from "next/navigation";
import {
  isLegalContentLocale,
  type LegalSlug,
} from "./content-locales";

/** 308 to /en/{slug} when locale has no Legal content. */
export function ensureLegalLocale(locale: string, slug: LegalSlug): void {
  if (isLegalContentLocale(locale)) return;
  permanentRedirect(`/en/${slug}`);
}
