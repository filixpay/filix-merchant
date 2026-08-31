const EVENT = "filix:organization-code-changed";

/** Notify React subscribers after `selectedOrganizationCode` is written to localStorage. */
export function notifyOrganizationCodeChanged(code: string | number): void {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
        new CustomEvent(EVENT, { detail: String(code).trim() }),
    );
}

export function subscribeOrganizationCodeChanged(
    listener: (code: string | null) => void,
): () => void {
    if (typeof window === "undefined") return () => undefined;
    const handler = (event: Event) => {
        const detail = (event as CustomEvent<string>).detail;
        listener(detail?.trim() ? detail.trim() : null);
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
}
