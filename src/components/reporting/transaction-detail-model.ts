import { ApiError } from "@/lib/api";

export function isReportResourceNotFound(error: unknown): boolean {
    if (!(error instanceof ApiError)) {
        return false;
    }
    if (error.status === 404) {
        return true;
    }
    return error.code === "REPORT_RESOURCE_NOT_FOUND";
}

export function formatOptionalDateTime(value: string | null | undefined): string {
    if (!value) {
        return "-";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleString();
}

export function localizeTimelineEventType(eventType: string | null | undefined): string {
    if (eventType == null || eventType === "") {
        return "-";
    }
    return eventType.replace(/\./g, " · ").replace(/_/g, " ");
}
