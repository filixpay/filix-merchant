import { notifyMerchantCodeChanged } from "./merchant-code-events";

const STORAGE_KEY = "selectedMerchantCode";

export function getStoredSelectedMerchantCode(): string | null {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved?.trim() ? saved.trim() : null;
}

export function setStoredSelectedMerchantCode(code: string | number): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, String(code));
    notifyMerchantCodeChanged(code);
}

export function clearStoredSelectedMerchantCode(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    notifyMerchantCodeChanged(null);
}
