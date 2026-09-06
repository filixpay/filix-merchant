import type { HelpContentLocale } from "@/lib/help/content-locales";
import { isHelpContentLocale } from "@/lib/help/content-locales";

/** Suffix for Help `<title>` tags (H1 stays without suffix). */
const HELP_TITLE_SUFFIX: Record<HelpContentLocale, string> = {
  en: "Help Center",
  zh: "帮助中心",
};

const HELP_TITLE_SEP: Record<HelpContentLocale, string> = {
  en: " | ",
  zh: "｜",
};

export function helpContentLocale(locale: string): HelpContentLocale {
  return isHelpContentLocale(locale) ? locale : "en";
}

/** Build document title: `{heading}｜帮助中心` / `{heading} | Help Center`. */
export function formatHelpDocumentTitle(
  heading: string,
  locale: string,
): string {
  const loc = helpContentLocale(locale);
  return `${heading}${HELP_TITLE_SEP[loc]}${HELP_TITLE_SUFFIX[loc]}`;
}

export function helpBreadcrumbHomeName(locale: string): string {
  return helpContentLocale(locale) === "zh" ? "首页" : "Home";
}
