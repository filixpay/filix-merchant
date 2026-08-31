import { ApiError } from "@/lib/api";

export type PortalApiAuthErrorKind = "missing_session" | "portal_rejected" | "other";

/**
 * When NextAuth session exists but portal APIs return 401, re-running signIn()
 * causes an SSO loop. Only re-auth when the browser session itself is missing.
 */
export function classifyPortalApiAuthError(
  err: unknown,
  hasSession: boolean,
): PortalApiAuthErrorKind {
  if (!(err instanceof ApiError) || err.status !== 401) {
    return "other";
  }
  if (!hasSession || err.code === "MISSING_ACCESS_TOKEN") {
    return "missing_session";
  }
  return "portal_rejected";
}

export function shouldReauthOnPortalApiError(kind: PortalApiAuthErrorKind): boolean {
  return kind === "missing_session";
}
