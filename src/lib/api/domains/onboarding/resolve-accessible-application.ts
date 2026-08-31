import { ApiError } from "../../core";
import { getApplication } from "./get-application";
import { getCurrentApplication } from "./get-current-application";
import type { MerchantApplication } from "./types";

export function isApplicationAccessDeniedError(err: unknown): boolean {
    return (
        err instanceof ApiError &&
        (err.status === 403 || err.code === "APPLICATION_ACCESS_DENIED")
    );
}

export function isApplicationNotFoundError(err: unknown): boolean {
    return (
        err instanceof ApiError &&
        (err.status === 404 || err.code === "APPLICATION_NOT_FOUND")
    );
}

export type ResolveAccessibleApplicationResult = {
    application: MerchantApplication | null;
    /** Preferred id from URL/storage was inaccessible for the signed-in user. */
    discardedPreferredId: boolean;
};

/**
 * Load a merchant application for the current session.
 * Falls back to `/current` when the preferred id is missing, not found, or denied.
 */
export async function resolveAccessibleApplication(
    token: string,
    preferredId?: string | null,
): Promise<ResolveAccessibleApplicationResult> {
    if (preferredId) {
        try {
            const application = await getApplication(token, preferredId);
            return { application, discardedPreferredId: false };
        } catch (err) {
            if (isApplicationAccessDeniedError(err) || isApplicationNotFoundError(err)) {
                return {
                    application: await getCurrentApplication(token),
                    discardedPreferredId: true,
                };
            }
            throw err;
        }
    }

    return {
        application: await getCurrentApplication(token),
        discardedPreferredId: false,
    };
}
