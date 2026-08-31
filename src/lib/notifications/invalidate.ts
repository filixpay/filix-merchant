const listeners = new Set<() => void>();

export function invalidateNotificationState() {
    listeners.forEach((listener) => listener());
}

export function subscribeNotificationInvalidation(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

/** Refresh inbox hooks when the tab becomes visible again. */
export function subscribeNotificationVisibilityRefresh(listener: () => void) {
    if (typeof document === "undefined") {
        return () => undefined;
    }
    const onVisible = () => {
        if (document.visibilityState === "visible") {
            listener();
        }
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
        document.removeEventListener("visibilitychange", onVisible);
        window.removeEventListener("focus", onVisible);
    };
}
