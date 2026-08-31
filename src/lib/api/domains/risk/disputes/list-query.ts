import { DisputeStatus } from "../shared/contracts";

export type DisputeSortField =
    | "createdAt"
    | "caseNumber"
    | "merchantOrderId"
    | "channelCode"
    | "amount"
    | "responseDueAt"
    | "status";

export type DisputeSortDirection = "asc" | "desc";

export interface DisputeListQuery {
    page: number;
    size: number;
    keyword: string;
    status: string;
    channelCode: string;
    sortBy: DisputeSortField;
    sortDir: DisputeSortDirection;
}

export interface DisputeSearchFormValues {
    keyword?: string;
    status?: string;
    channelCode?: string;
}

export const DEFAULT_DISPUTE_LIST_QUERY: DisputeListQuery = {
    page: 0,
    size: 20,
    keyword: "",
    status: "",
    channelCode: "",
    sortBy: "createdAt",
    sortDir: "desc",
};

export const DISPUTE_STATUS_OPTIONS = Object.values(DisputeStatus);

export function buildDisputeSearchParams(query: DisputeListQuery): Record<string, string | number> {
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
    if (query.channelCode.trim()) {
        params.channelCode = query.channelCode.trim();
    }

    return params;
}

export function toTableSortOrder(
    sortBy: DisputeSortField,
    sortDir: DisputeSortDirection,
    columnKey: DisputeSortField,
): "ascend" | "descend" | null {
    if (sortBy !== columnKey) {
        return null;
    }
    return sortDir === "asc" ? "ascend" : "descend";
}
