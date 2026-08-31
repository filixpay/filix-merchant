import type { LocationView, SubMerchantView } from "@/lib/api";

export type LocationStatus = "ACTIVE" | "INACTIVE";

function alreadyMasked(value: string): boolean {
    return value.includes("*");
}

/** List-display mask — keep prefix + last 4 (matches merchant profile). */
export function maskLocationPhone(value?: string | null): string {
    if (!value?.trim()) return "-";
    const trimmed = value.trim();
    if (alreadyMasked(trimmed)) return trimmed;
    if (trimmed.length < 7) return "***";
    return `${trimmed.slice(0, 3)}****${trimmed.slice(-4)}`;
}

/** List-display mask — keep first local char + domain (matches merchant profile). */
export function maskLocationEmail(value?: string | null): string {
    if (!value?.trim()) return "-";
    const trimmed = value.trim();
    if (alreadyMasked(trimmed)) return trimmed;
    const at = trimmed.indexOf("@");
    if (at <= 1) return "***";
    return `${trimmed[0]}***${trimmed.slice(at)}`;
}

export function normalizeLocationStatus(status: string | undefined): LocationStatus | string {
    const normalized = status?.trim().toUpperCase();
    if (normalized === "ACTIVE" || normalized === "INACTIVE") {
        return normalized;
    }
    return status ?? "";
}

export function getLocationStatusColor(status: string): string {
    return normalizeLocationStatus(status) === "ACTIVE" ? "success" : "default";
}

export function getLocationStatusLabel(
    status: string,
    translate?: (key: "status_active" | "status_inactive") => string,
): string {
    const normalized = normalizeLocationStatus(status);
    if (normalized === "ACTIVE") {
        return translate?.("status_active") ?? "启用";
    }
    if (normalized === "INACTIVE") {
        return translate?.("status_inactive") ?? "停用";
    }
    return status;
}

export function getLocationDefaultLabel(
    isDefault: boolean | undefined,
    translate?: (key: "yes" | "no") => string,
): string {
    return isDefault ? translate?.("yes") ?? "是" : translate?.("no") ?? "否";
}

export function resolveSubMerchantName(
    location: LocationView,
    subMerchants: SubMerchantView[],
): string {
    return (
        location.subMerchantName ||
        subMerchants.find((s) => s.id === location.subMerchantId)?.name ||
        String(location.subMerchantId || "-")
    );
}
