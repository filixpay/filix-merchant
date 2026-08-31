import { ApiError } from "@/lib/api";

export const MERCHANT_SCOPE_DENIED_CODE = "MERCHANT_SCOPE_DENIED";

export function isMerchantScopeDeniedError(err: unknown): boolean {
    return err instanceof ApiError && err.code === MERCHANT_SCOPE_DENIED_CODE;
}

type ScopeDeniedListener = () => void;

const scopeDeniedListeners = new Set<ScopeDeniedListener>();

export function subscribeMerchantScopeDenied(listener: ScopeDeniedListener): () => void {
    scopeDeniedListeners.add(listener);
    return () => {
        scopeDeniedListeners.delete(listener);
    };
}

export function notifyMerchantScopeDenied(): void {
    for (const listener of scopeDeniedListeners) {
        listener();
    }
}
