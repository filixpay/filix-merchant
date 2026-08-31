import type { ApiCredentialsView } from "@/lib/api";
import { SANDBOX_SESSION_TTL_SECONDS } from "./sandbox-config";

type StashEntry = {
    credentials: ApiCredentialsView;
    expiresAt: number;
};

const stash = new Map<string, StashEntry>();

export function stashApiCredentials(merchantUserId: string, credentials: ApiCredentialsView): void {
    stash.set(merchantUserId, {
        credentials,
        expiresAt: Date.now() + SANDBOX_SESSION_TTL_SECONDS * 1000,
    });
}

export function takeStashedApiCredentials(merchantUserId: string): ApiCredentialsView | null {
    const entry = stash.get(merchantUserId);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        stash.delete(merchantUserId);
        return null;
    }
    stash.delete(merchantUserId);
    return entry.credentials;
}

export function peekStashedApiCredentials(merchantUserId: string): ApiCredentialsView | null {
    const entry = stash.get(merchantUserId);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        stash.delete(merchantUserId);
        return null;
    }
    return entry.credentials;
}

/** @internal test helper */
export function clearCredentialStash(): void {
    stash.clear();
}
