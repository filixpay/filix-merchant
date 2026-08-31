const STORAGE_KEY = "selectedEnterpriseCode";

export function getStoredSelectedEnterpriseCode(): string | null {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved?.trim() ? saved.trim() : null;
}

export function setStoredSelectedEnterpriseCode(code: string | number): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, String(code));
}

export function clearStoredSelectedEnterpriseCode(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
}
