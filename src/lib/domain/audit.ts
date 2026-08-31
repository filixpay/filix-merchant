import type { AuditLogItem, AuditResult } from "@/lib/api/domains/audit/types";

export function getAuditResultColor(result: AuditResult): "success" | "error" | "warning" {
    switch (result) {
        case "SUCCESS":
            return "success";
        case "FAILURE":
            return "error";
        case "DENIED":
            return "warning";
    }
}

export function resolveAuditDeepLink(item: AuditLogItem, locale: string): string | null {
    if (item.resourceType === "REVIEW" && item.resourceId) {
        return `/${locale}/dashboard/risk-reviews/${item.resourceId}`;
    }
    const orderId = item.metadata?.extra?.orderId;
    if (typeof orderId === "string" || typeof orderId === "number") {
        return `/${locale}/dashboard/orders`;
    }
    if (item.traceId) {
        return null;
    }
    return null;
}

export function abbreviateTraceId(traceId: string, maxLength = 12): string {
    if (traceId.length <= maxLength) {
        return traceId;
    }
    return `${traceId.slice(0, maxLength)}…`;
}
