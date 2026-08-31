export const APP_LOCALES = ["en", "es", "fr", "de", "zh", "ja", "ko", "ar", "pt"] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

export function getSessionCookieName(): string {
  return process.env.NODE_ENV === "production"
    ? "__Secure-filix-merchant.session-token"
    : "filix-merchant.session-token";
}

export function parseLocaleDashboardPath(
  pathname: string,
): { locale: AppLocale; isDashboard: boolean } | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return null;
  }

  const maybeLocale = segments[0];
  if (!APP_LOCALES.includes(maybeLocale as AppLocale)) {
    return null;
  }

  return {
    locale: maybeLocale as AppLocale,
    isDashboard: segments[1] === "dashboard",
  };
}

export function parseLocaleEnterprisePath(
  pathname: string,
): { locale: AppLocale; isEnterprise: boolean } | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return null;
  }

  const maybeLocale = segments[0];
  if (!APP_LOCALES.includes(maybeLocale as AppLocale)) {
    return null;
  }

  return {
    locale: maybeLocale as AppLocale,
    isEnterprise: segments[1] === "enterprise",
  };
}

export function parseLocaleOnboardingPath(
  pathname: string,
): { locale: AppLocale; isOnboarding: boolean } | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return null;
  }

  const maybeLocale = segments[0];
  if (!APP_LOCALES.includes(maybeLocale as AppLocale)) {
    return null;
  }

  return {
    locale: maybeLocale as AppLocale,
    isOnboarding: segments[1] === "onboarding",
  };
}

/** Only allow same-origin relative callback paths. */
export function sanitizeCallbackUrl(raw: string | null | undefined, fallback: string): string {
  if (!raw) {
    return fallback;
  }

  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  return trimmed;
}

export function buildLoginUrl(
  origin: string,
  locale: AppLocale,
  callbackPath: string,
  options?: { portal?: "merchant" | "enterprise" },
): URL {
  const loginUrl = new URL(`/${locale}/login`, origin);
  loginUrl.searchParams.set("callbackUrl", callbackPath);
  if (options?.portal) {
    loginUrl.searchParams.set("portal", options.portal);
  }
  return loginUrl;
}
