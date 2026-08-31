import type { ApiCredentialView } from "@/lib/developer/applications-api";

export type CredentialEnvironment = "LIVE" | "SANDBOX";

/**
 * UI disable for Create LIVE is an optimization / UX affordance only.
 * API must remain correct when called directly or concurrently.
 * Backend single-ACTIVE (HTTP 409) is the source of truth.
 */
export function hasActiveLiveCredential(
    credentials: readonly Pick<ApiCredentialView, "environment" | "status">[],
): boolean {
    return credentials.some(
        (c) =>
            (c.environment || "").toUpperCase() === "LIVE" &&
            (c.status || "").toUpperCase() === "ACTIVE",
    );
}

export function hasActiveSandboxCredential(
    credentials: readonly Pick<ApiCredentialView, "environment" | "status">[],
): boolean {
    return credentials.some(
        (c) =>
            (c.environment || "").toUpperCase() === "SANDBOX" &&
            (c.status || "").toUpperCase() === "ACTIVE",
    );
}

/** Lifecycle-only: archived apps cannot create; active LIVE already exists → disable create. */
export function isLiveCreateDisabledByLifecycle(
    applicationStatus: string | undefined,
    credentials: readonly Pick<ApiCredentialView, "environment" | "status">[],
): boolean {
    if ((applicationStatus || "").toUpperCase() === "ARCHIVED") {
        return true;
    }
    return hasActiveLiveCredential(credentials);
}

export function filterCredentialsByEnvironment(
    credentials: readonly ApiCredentialView[],
    environment: CredentialEnvironment,
): ApiCredentialView[] {
    const target = environment.toUpperCase();
    return credentials.filter((c) => (c.environment || "").toUpperCase() === target);
}
