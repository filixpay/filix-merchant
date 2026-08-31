/**
 * Credit-center party label: prefer legal name; append alias when different.
 * Never show alias alone (no name → undefined so callers use their fallback).
 */
export function formatPartyDisplayName(
    party?: { name?: string | null; alias?: string | null } | null,
): string | undefined {
    const name = party?.name?.trim() || "";
    const alias = party?.alias?.trim() || "";
    if (name && alias && alias !== name) {
        return `${name}（${alias}）`;
    }
    if (name) {
        return name;
    }
    return undefined;
}

export function filterByCreditLineId<T extends { creditLine?: { id?: number } | null }>(
    items: T[],
    creditLineId: number | null | undefined,
): T[] {
    if (creditLineId == null) {
        return items;
    }
    return items.filter((item) => item.creditLine?.id === creditLineId);
}

export function formatCreditAmount(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}

export function formatCreditDateTime(dateString: string): string {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}

export function getCreditStatusColor(status: string): string {
    return status === "ACTIVE" ? "success" : "default";
}

export function getTransactionTypeColor(type: string): string {
    switch (type) {
        case "USE":
            return "error";
        case "REPAY":
            return "success";
        case "ADJUST":
            return "processing";
        case "REFUND":
            return "purple";
        default:
            return "default";
    }
}

export function getAdjustmentAmountColor(amount: number): string {
    if (amount > 0) return "#10b981";
    if (amount < 0) return "#ef4444";
    return "#64748b";
}
