import { CoverageClaimStatus, DisputeStatus, RiskPriority } from "@/lib/api";

export type ResponseDueUrgency = "overdue" | "critical" | "soon" | "normal";

export interface ResponseDueInfo {
    urgency: ResponseDueUrgency;
    daysRemaining: number;
    hoursRemaining: number;
}

export function getPriorityColor(priority: RiskPriority): string {
    switch (priority) {
        case RiskPriority.CRITICAL:
        case RiskPriority.HIGH:
            return "red";
        case RiskPriority.MEDIUM:
            return "gold";
        case RiskPriority.LOW:
            return "default";
        default:
            return "default";
    }
}

export function getStatusColor(status: DisputeStatus): string {
    switch (status) {
        case DisputeStatus.DRAFT:
            return "default";
        case DisputeStatus.SUBMITTED:
            return "purple";
        case DisputeStatus.UNDER_REVIEW:
            return "blue";
        case DisputeStatus.WON:
            return "success";
        case DisputeStatus.LOST:
            return "error";
        case DisputeStatus.ACCEPTED:
            return "warning";
        default:
            return "default";
    }
}

export function formatDisputeAmount(amount: number, currency: string): string {
    return `${currency} ${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export function getResponseDueInfo(responseDueAt: string, now = Date.now()): ResponseDueInfo {
    const dueMs = new Date(responseDueAt).getTime();
    const remainingMs = dueMs - now;
    const hoursRemaining = Math.ceil(remainingMs / (60 * 60 * 1000));
    const daysRemaining = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));

    if (remainingMs <= 0) {
        return { urgency: "overdue", daysRemaining: 0, hoursRemaining: 0 };
    }
    if (remainingMs <= 24 * 60 * 60 * 1000) {
        return { urgency: "critical", daysRemaining: 1, hoursRemaining: Math.max(hoursRemaining, 1) };
    }
    if (remainingMs <= 3 * 24 * 60 * 60 * 1000) {
        return { urgency: "soon", daysRemaining: Math.max(daysRemaining, 1), hoursRemaining };
    }
    return { urgency: "normal", daysRemaining: Math.max(daysRemaining, 1), hoursRemaining };
}

export function getCoverageStatusColor(status: CoverageClaimStatus): string {
    switch (status) {
        case CoverageClaimStatus.CREATED:
            return "processing";
        case CoverageClaimStatus.UNDER_REVIEW:
            return "purple";
        case CoverageClaimStatus.APPROVED:
            return "success";
        case CoverageClaimStatus.REJECTED:
            return "error";
        case CoverageClaimStatus.PAID:
            return "success";
        case CoverageClaimStatus.CLOSED:
            return "default";
        default:
            return "default";
    }
}
