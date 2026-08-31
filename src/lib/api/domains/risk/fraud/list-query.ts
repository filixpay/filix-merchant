import { FraudEventStatus, RiskPriority } from "../shared/contracts";

export type FraudSortField = "detectedAt" | "severity" | "status" | "eventType";
export type FraudSortDirection = "asc" | "desc";

export interface FraudListQuery {
    page: number;
    size: number;
    keyword: string;
    status: string;
    severity: string;
    sortBy: FraudSortField;
    sortDir: FraudSortDirection;
}

export interface FraudSearchFormValues {
    keyword?: string;
    status?: string;
    severity?: string;
}

export const DEFAULT_FRAUD_LIST_QUERY: FraudListQuery = {
    page: 0,
    size: 20,
    keyword: "",
    status: "",
    severity: "",
    sortBy: "detectedAt",
    sortDir: "desc",
};

export const FRAUD_STATUS_OPTIONS = Object.values(FraudEventStatus);
export const FRAUD_SEVERITY_OPTIONS = Object.values(RiskPriority);

export function buildFraudSearchParams(query: FraudListQuery): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: query.page,
        size: query.size,
        sortBy: query.sortBy,
        sortDir: query.sortDir,
    };

    if (query.keyword.trim()) {
        params.keyword = query.keyword.trim();
    }
    if (query.status) {
        params.status = query.status;
    }
    if (query.severity) {
        params.severity = query.severity;
    }

    return params;
}

export function estimateArrayPageTotal(page: number, size: number, itemCount: number): number {
    if (itemCount < size) {
        return page * size + itemCount;
    }
    return (page + 1) * size + 1;
}

export function toFraudTableSortOrder(
    sortBy: FraudSortField,
    sortDir: FraudSortDirection,
    columnKey: FraudSortField,
): "ascend" | "descend" | null {
    if (sortBy !== columnKey) {
        return null;
    }
    return sortDir === "asc" ? "ascend" : "descend";
}
