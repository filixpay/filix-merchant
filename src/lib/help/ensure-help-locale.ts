import { permanentRedirect } from "next/navigation";
import { isHelpContentLocale } from "./content-locales";

/** 308 to /en/help/... when locale has no Help content. */
export function ensureHelpLocale(locale: string, helpPathSuffix: string): void {
  if (isHelpContentLocale(locale)) return;
  const suffix = helpPathSuffix.startsWith("/")
    ? helpPathSuffix
    : `/${helpPathSuffix}`;
  permanentRedirect(`/en${suffix}`);
}
