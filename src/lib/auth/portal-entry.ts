import { sanitizeCallbackUrl } from "./dashboard-route";

/** Stable portal ids — navigation intent only, not authorization. */
export type PortalId = "merchant" | "enterprise";

/**
 * Parse `portal` query. Invalid / missing → null (show dual cards; no fallback).
 */
export function parsePortalQuery(raw: string | null | undefined): PortalId | null {
  if (raw === "merchant" || raw === "enterprise") {
    return raw;
  }
  return null;
}

export function portalDefaultLanding(locale: string, portal: PortalId): string {
  return portal === "enterprise"
    ? `/${locale}/enterprise/dashboard`
    : `/${locale}/onboarding/gate`;
}

/**
 * True when callback is inside the chosen portal path boundary.
 * Merchant: /{locale}/dashboard/** or /{locale}/onboarding/**
 * Enterprise: /{locale}/enterprise/**
 */
export function isCallbackInPortalBoundary(
  callbackPath: string,
  locale: string,
  portal: PortalId,
): boolean {
  if (portal === "enterprise") {
    const prefix = `/${locale}/enterprise`;
    return callbackPath === prefix || callbackPath.startsWith(`${prefix}/`);
  }
  const dashboardPrefix = `/${locale}/dashboard`;
  const onboardingPrefix = `/${locale}/onboarding`;
  return (
    callbackPath === dashboardPrefix ||
    callbackPath.startsWith(`${dashboardPrefix}/`) ||
    callbackPath === onboardingPrefix ||
    callbackPath.startsWith(`${onboardingPrefix}/`)
  );
}

/**
 * Resolve post-auth URL for a user-selected portal.
 * portal picks boundary; callbackUrl may deep-link inside that boundary.
 */
export function resolveLoginCallbackUrl(input: {
  locale: string;
  selectedPortal: PortalId;
  rawCallbackUrl: string | null | undefined;
}): string {
  const fallback = portalDefaultLanding(input.locale, input.selectedPortal);
  const sanitized = sanitizeCallbackUrl(input.rawCallbackUrl, fallback);
  if (!isCallbackInPortalBoundary(sanitized, input.locale, input.selectedPortal)) {
    return fallback;
  }
  return sanitized;
}
