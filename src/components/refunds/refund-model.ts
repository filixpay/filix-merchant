import type { RefundStatus, RefundTimelineEvent, RefundView } from "@/lib/api";

export type RefundProgressStep = "requested" | "approval" | "executing" | "terminal";

export type RefundProgressStepState = "done" | "current" | "upcoming" | "failed" | "skipped";

export type RefundProgress = Record<RefundProgressStep, RefundProgressStepState>;

const REFUND_STATUS_I18N_KEYS = [
    "REQUESTED",
    "EXECUTING",
    "SUCCEEDED",
    "FAILED",
    "CANCELLED",
] as const;

export type RefundStatusI18nKey = (typeof REFUND_STATUS_I18N_KEYS)[number];

export function getRefundStatusColor(status: string): string {
    switch (status) {
        case "SUCCEEDED":
        case "SUCCESS":
        case "COMPLETED":
            return "success";
        case "REQUESTED":
        case "EXECUTING":
        case "PENDING":
        case "PROCESSING":
            return "processing";
        case "FAILED":
        case "CANCELLED":
        case "FAILD":
            return "error";
        default:
            return "default";
    }
}

/** Map runtime RefundStatus to Refunds.status.* i18n key; unknown → null (caller shows raw). */
export function refundStatusI18nKey(status: string): RefundStatusI18nKey | null {
    return (REFUND_STATUS_I18N_KEYS as readonly string[]).includes(status)
        ? (status as RefundStatusI18nKey)
        : null;
}

export function formatRefundAmount(refund: RefundView): string {
    return String(refund.amount ?? "-");
}

/**
 * Status progress for refund detail (order-like).
 * Amounts above auto-execute threshold stay REQUESTED until audit → show approval step.
 */
export function presentRefundProgress(
    status: RefundStatus,
    awaitingApproval = false,
): RefundProgress {
    const code = String(status ?? "").toUpperCase();

    if (code === "SUCCEEDED") {
        return {
            requested: "done",
            approval: awaitingApproval ? "done" : "skipped",
            executing: "done",
            terminal: "done",
        };
    }
    if (code === "FAILED" || code === "CANCELLED") {
        return {
            requested: "done",
            approval: "skipped",
            executing: "failed",
            terminal: "failed",
        };
    }
    if (code === "EXECUTING") {
        return {
            requested: "done",
            approval: "skipped",
            executing: "current",
            terminal: "upcoming",
        };
    }
    // REQUESTED
    if (awaitingApproval) {
        return {
            requested: "done",
            approval: "current",
            executing: "upcoming",
            terminal: "upcoming",
        };
    }
    return {
        requested: "current",
        approval: "skipped",
        executing: "upcoming",
        terminal: "upcoming",
    };
}

export function timelineEventColor(code: string): string {
    if (code === "SUCCEEDED" || code === "ATTEMPT_SUCCEEDED") return "green";
    if (code === "FAILED" || code === "CANCELLED" || code === "ATTEMPT_FAILED" || code === "ATTEMPT_FAILED_SUBMIT") {
        return "red";
    }
    if (code === "AWAITING_APPROVAL") return "orange";
    if (code.startsWith("ATTEMPT_") || code === "EXECUTING") return "blue";
    return "gray";
}

export function ensureTimeline(refund: RefundView): RefundTimelineEvent[] {
    if (refund.timeline && refund.timeline.length > 0) {
        return refund.timeline;
    }
    const events: RefundTimelineEvent[] = [];
    if (refund.createdAt) {
        events.push({ code: "REQUESTED", at: refund.createdAt });
    }
    if (refund.awaitingApproval) {
        events.push({
            code: "AWAITING_APPROVAL",
            at: refund.createdAt,
            detail: refund.autoExecuteThreshold
                ? `threshold ${refund.autoExecuteThreshold}`
                : undefined,
        });
    }
    if (refund.status === "SUCCEEDED" && refund.completedAt) {
        events.push({ code: "SUCCEEDED", at: refund.completedAt });
    }
    return events;
}
