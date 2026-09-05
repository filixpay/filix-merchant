export const HELP_CONTENT_LOCALES = ["en", "zh"] as const;
export type HelpContentLocale = (typeof HELP_CONTENT_LOCALES)[number];

export function isHelpContentLocale(locale: string): locale is HelpContentLocale {
  return (HELP_CONTENT_LOCALES as readonly string[]).includes(locale);
}
