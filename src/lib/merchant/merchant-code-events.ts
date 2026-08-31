const EVENT = "filix:merchant-code-changed";

/** Notify React subscribers after `selectedMerchantCode` is written to localStorage. */
export function notifyMerchantCodeChanged(code: string | number | null): void {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
        new CustomEvent(EVENT, {
            detail: code == null ? null : String(code).trim(),
        }),
    );
}

export function subscribeMerchantCodeChanged(
    listener: (code: string | null) => void,
): () => void {
    if (typeof window === "undefined") return () => undefined;
    const handler = (event: Event) => {
        const detail = (event as CustomEvent<string | null>).detail;
        listener(detail?.trim() ? detail.trim() : null);
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
}
