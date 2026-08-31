import type { Dayjs } from "dayjs";
import type { ReportPageDto, TransactionReportRow } from "@/lib/api/domains/reporting/types";

export const TRANSACTION_STATUS_OPTIONS = [
    "PENDING",
    "PROCESSING",
    "PARTIAL_SUCCESS",
    "SUCCESS",
    "CLOSED",
    "FAILED",
    "REQUIRES_CAPTURE",
    "DISPUTED",
] as const;

export type TransactionListQuery = {
    page: number;
    size: number;
    merchantOrderId: string;
    status: string;
    channel: string;
    amountMin: string;
    amountMax: string;
    createdAtFrom?: string;
    createdAtTo?: string;
};

export type TransactionSearchFormValues = {
    merchantOrderId?: string;
    status?: string;
    channel?: string;
    amountMin?: number;
    amountMax?: number;
    createdTimeRange?: [Dayjs | null, Dayjs | null];
};

export const DEFAULT_TRANSACTION_LIST_QUERY: TransactionListQuery = {
    page: 0,
    size: 20,
    merchantOrderId: "",
    status: "",
    channel: "",
    amountMin: "",
    amountMax: "",
};

export function toApiDateTime(value: Dayjs | null | undefined): string | undefined {
    if (!value) {
        return undefined;
    }
    return value.toISOString();
}

export function buildTransactionFilters(query: TransactionListQuery): Record<string, unknown> {
    const filters: Record<string, unknown> = {};
    if (query.merchantOrderId) {
        filters.merchantOrderId = query.merchantOrderId;
    }
    if (query.status) {
        filters.status = query.status;
    }
    if (query.channel) {
        filters.channel = query.channel;
    }
    if (query.amountMin) {
        filters.amountMin = query.amountMin;
    }
    if (query.amountMax) {
        filters.amountMax = query.amountMax;
    }
    if (query.createdAtFrom) {
        filters.createdAtFrom = query.createdAtFrom;
    }
    if (query.createdAtTo) {
        filters.createdAtTo = query.createdAtTo;
    }
    return filters;
}

export function buildTransactionListQuery(
    values: TransactionSearchFormValues,
    paging: Pick<TransactionListQuery, "page" | "size">,
): TransactionListQuery {
    const [createdStart, createdEnd] = values.createdTimeRange ?? [];
    return {
        ...paging,
        merchantOrderId: values.merchantOrderId?.trim() ?? "",
        status: values.status ?? "",
        channel: values.channel?.trim() ?? "",
        amountMin: values.amountMin != null ? String(values.amountMin) : "",
        amountMax: values.amountMax != null ? String(values.amountMax) : "",
        createdAtFrom: toApiDateTime(createdStart ?? undefined),
        createdAtTo: toApiDateTime(createdEnd ?? undefined),
    };
}

export function normalizeTransactionPage(response: ReportPageDto<TransactionReportRow>): {
    items: TransactionReportRow[];
    total: number;
} {
    return {
        items: response.items ?? [],
        total: response.total ?? 0,
    };
}

export function formatTransactionAmount(amount: number, currency: string): string {
    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currency || "USD",
        }).format(amount);
    } catch {
        return `${amount} ${currency}`;
    }
}

export function formatTransactionDateTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleString();
}

export type TransactionStatusTone = "success" | "warning" | "danger" | "neutral";

export function presentTransactionStatusTone(status: string | null | undefined): TransactionStatusTone {
    switch ((status ?? "").trim().toUpperCase()) {
        case "SUCCESS":
        case "PARTIAL_SUCCESS":
            return "success";
        case "PENDING":
        case "PROCESSING":
        case "REQUIRES_CAPTURE":
            return "warning";
        case "FAILED":
        case "DISPUTED":
            return "danger";
        case "CLOSED":
            return "neutral";
        default:
            return "neutral";
    }
}
