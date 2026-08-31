export type WidgetDataAvailability = "AVAILABLE" | "NO_DATA";
export type WidgetStatus = "OK" | "FORBIDDEN" | "NOT_FOUND" | "FAILED";

export type WidgetResultDto = {
    widgetId: string;
    status: WidgetStatus;
    dataAvailability?: WidgetDataAvailability;
    data?: Record<string, unknown> | null;
};

export type WidgetBundleDto = {
    results: Record<string, WidgetResultDto>;
};

export type ReportingApiVersion = "V1";
export type ReportDomain = "TRANSACTION";
export type ReportView = "LIST" | "DETAIL" | "TIMELINE";

export type ReportQueryRequest = {
    apiVersion: ReportingApiVersion;
    domain: ReportDomain;
    view: ReportView;
    id?: string;
    filters?: Record<string, unknown>;
    sort?: string;
    page?: number;
    size?: number;
};

export type ReportExportRequest = {
    apiVersion: ReportingApiVersion;
    domain: ReportDomain;
    filters?: Record<string, unknown>;
};

export type WidgetBatchRequest = {
    widgetIds: string[];
};

export type ReportPageDto<T> = {
    items: T[];
    page: number;
    size: number;
    total: number | null;
};

export type TransactionReportRow = {
    reportId: string;
    merchantOrderId: string;
    tradeNo: string;
    status: string;
    orderType: string | null;
    businessId: string | null;
    amount: number;
    currency: string;
    createdAt: string;
    channel: string;
    merchantId: number;
};

export type TransactionReportDetail = {
    reportId: string;
    merchantOrderId: string;
    tradeNo: string;
    status: string;
    orderType: string;
    businessId: string | null;
    amount: number;
    paidAmount: number;
    refundedAmount: number;
    currency: string;
    createdAt: string;
    paidAt: string | null;
    updatedAt: string;
    channel: string;
    subject: string;
    merchantId: number;
};

export type TransactionTimelineItem = {
    eventType?: string | null;
    occurredAt?: string | null;
};

export type TransactionTimeline = {
    reportId: string;
    items: TransactionTimelineItem[];
};

export type WidgetNumericResolution =
    | { state: "available"; value: number }
    | { state: "no_data" }
    | { state: "forbidden" }
    | { state: "failed" }
    | { state: "not_found" };

/**
 * Resolves a numeric widget field without inventing zero for NO_DATA stubs.
 * Prefer dataAvailability over guessing from empty payloads.
 */
export function resolveWidgetNumericValue(
    widget: WidgetResultDto,
    field = "amount",
): WidgetNumericResolution {
    if (widget.status === "NOT_FOUND") {
        return { state: "not_found" };
    }
    if (widget.status === "FORBIDDEN") {
        return { state: "forbidden" };
    }
    if (widget.status === "FAILED") {
        return { state: "failed" };
    }

    if (widget.dataAvailability === "NO_DATA") {
        return { state: "no_data" };
    }

    if (widget.dataAvailability === "AVAILABLE") {
        const raw = widget.data?.[field];
        if (typeof raw === "number" && Number.isFinite(raw)) {
            return { state: "available", value: raw };
        }
        return { state: "no_data" };
    }

    if (widget.data == null) {
        return { state: "no_data" };
    }

    const raw = widget.data[field];
    if (typeof raw === "number" && Number.isFinite(raw)) {
        return { state: "available", value: raw };
    }

    return { state: "no_data" };
}
