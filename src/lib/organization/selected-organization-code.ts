import { notifyOrganizationCodeChanged } from "./organization-code-events";

const STORAGE_KEY = "selectedOrganizationCode";

export function getStoredSelectedOrganizationCode(): string | null {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved?.trim() ? saved.trim() : null;
}

export function setStoredSelectedOrganizationCode(code: string | number): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, String(code));
    notifyOrganizationCodeChanged(code);
}
