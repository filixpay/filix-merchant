export const LOCALES = ["en", "es", "fr", "de", "zh", "ja", "ko", "ar", "pt"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const ORGANIZATION_EMAIL = "invest@filixpay.com";

export const ORGANIZATION_SAME_AS = ["https://github.com/filixpay"];

export const DEFAULT_OG_IMAGE = "/logo.png";
