import { RiskReviewStatus } from "../shared/contracts";

export type ReviewSortField = "queuedAt" | "createdAt" | "priority" | "status";
export type ReviewSortDirection = "asc" | "desc";

export interface ReviewListQuery {
    page: number;
    size: number;
    keyword: string;
    status: string;
    priority: string;
    reviewType: string;
    sortBy: ReviewSortField;
    sortDir: ReviewSortDirection;
}

export interface ReviewSearchFormValues {
    keyword?: string;
    status?: string;
    priority?: string;
    reviewType?: string;
}

export const DEFAULT_REVIEW_LIST_QUERY: ReviewListQuery = {
    page: 0,
    size: 20,
    keyword: "",
    status: "",
    priority: "",
    reviewType: "",
    sortBy: "queuedAt",
    sortDir: "desc",
};

export const REVIEW_STATUS_OPTIONS = Object.values(RiskReviewStatus);

export function buildReviewSearchParams(query: ReviewListQuery): Record<string, string | number> {
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
    if (query.priority) {
        params.priority = query.priority;
    }
    if (query.reviewType) {
        params.reviewType = query.reviewType;
    }

    return params;
}

export { estimateArrayPageTotal } from "../fraud/list-query";

export function toReviewTableSortOrder(
    sortBy: ReviewSortField,
    sortDir: ReviewSortDirection,
    columnKey: ReviewSortField,
): "ascend" | "descend" | null {
    if (sortBy !== columnKey) {
        return null;
    }
    return sortDir === "asc" ? "ascend" : "descend";
}
