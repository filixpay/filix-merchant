import {
    EDITABLE_CHANGE_STATUSES,
    type ChangeRequestStatus,
    type MerchantChangeProfile,
    type MerchantChangeRequest,
} from "@/lib/api/domains/maintenance";

export type ChangeDetailContentMode = "edit" | "view";

/** Edit for draft/returned; otherwise read-only so submitted profile fields stay visible. */
export function getChangeDetailContentMode(
    status: ChangeRequestStatus,
): ChangeDetailContentMode {
    return EDITABLE_CHANGE_STATUSES.includes(status) ? "edit" : "view";
}

export type ChangeProfileDisplayRow = {
    key: string;
    value: string;
};

/** Flatten profile core + extraAttributes for read-only fallback when schema is unavailable. */
export function buildChangeProfileDisplayRows(
    profile?: MerchantChangeProfile | null,
): ChangeProfileDisplayRow[] {
    if (!profile) {
        return [];
    }

    const rows: ChangeProfileDisplayRow[] = [];
    const push = (key: string, value: unknown) => {
        if (value == null) {
            return;
        }
        const text = String(value).trim();
        if (!text) {
            return;
        }
        rows.push({ key, value: text });
    };

    push("businessName", profile.businessName);
    push("phone", profile.phone);
    push("email", profile.email);
    push("registrationCountry", profile.registrationCountry);
    push("merchantType", profile.merchantType);
    push("schemaCode", profile.schemaCode);

    for (const [key, value] of Object.entries(profile.extraAttributes ?? {})) {
        push(key, value);
    }

    return rows;
}

/** Newest ULID first; backend list order is ascending by id. */
export function sortChangeRequestsByIdDesc<T extends { id: string }>(items: T[]): T[] {
    return [...items].sort((a, b) => String(b.id).localeCompare(String(a.id)));
}

export function truncateIdMiddle(id: string, head = 8, tail = 4): string {
    const normalized = String(id);
    if (normalized.length <= head + tail + 1) {
        return normalized;
    }
    return `${normalized.slice(0, head)}...${normalized.slice(-tail)}`;
}

export function getMaintenanceStatusTagColor(status: ChangeRequestStatus): string {
    switch (status) {
        case "DRAFT":
            return "default";
        case "SUBMITTED":
        case "APPLYING":
            return "processing";
        case "UNDER_REVIEW":
        case "RETURNED":
            return "warning";
        case "APPROVED":
        case "COMPLETED":
            return "success";
        case "APPLY_FAILED":
        case "REJECTED":
            return "error";
        case "CANCELLED":
            return "default";
        default:
            return "default";
    }
}

/** List “提交时间”: show timestamp, or soft “未提交” when never submitted. */
export function formatChangeSubmittedAtDisplay(
    submittedAt: string | undefined,
    _status: ChangeRequestStatus,
    notSubmittedLabel: string,
): string {
    if (submittedAt) {
        return new Date(submittedAt).toLocaleString();
    }
    return notSubmittedLabel;
}

export type ChangeTimelineStepState = "done" | "current" | "pending" | "error";

export type ChangeTimelineStep = {
    key: "submitted" | "review" | "completed" | "cancelled" | "rejected" | "failed";
    state: ChangeTimelineStepState;
    time?: string;
    hintKey?: string;
};

type ChangeTimelineSource = Pick<
    MerchantChangeRequest,
    "status" | "submittedAt" | "approvedAt" | "completedAt" | "returnedAt" | "lastApplyFailedAt"
>;

/**
 * Full progress pipeline so the timeline card is never a single lonely node.
 * Happy path: submitted → review → completed.
 */
export function buildChangeProgressPipeline(changeRequest: ChangeTimelineSource): ChangeTimelineStep[] {
    const { status } = changeRequest;

    if (status === "DRAFT") {
        return [
            { key: "submitted", state: "pending" },
            { key: "review", state: "pending", hintKey: "timeline.reviewHint" },
            { key: "completed", state: "pending" },
        ];
    }

    if (status === "CANCELLED") {
        const steps: ChangeTimelineStep[] = [];
        if (changeRequest.submittedAt) {
            steps.push({ key: "submitted", state: "done", time: changeRequest.submittedAt });
        }
        steps.push({
            key: "cancelled",
            state: "error",
            time: changeRequest.completedAt ?? changeRequest.returnedAt,
        });
        return steps;
    }

    const submitted: ChangeTimelineStep = {
        key: "submitted",
        state: status === "SUBMITTED" ? "current" : "done",
        time: changeRequest.submittedAt,
    };

    if (status === "REJECTED") {
        return [
            submitted,
            {
                key: "review",
                state: "done",
                time: changeRequest.returnedAt ?? changeRequest.approvedAt,
                hintKey: "timeline.reviewHint",
            },
            {
                key: "rejected",
                state: "error",
                time: changeRequest.completedAt ?? changeRequest.returnedAt,
            },
        ];
    }

    if (status === "APPLY_FAILED") {
        return [
            submitted,
            {
                key: "review",
                state: "done",
                time: changeRequest.approvedAt ?? changeRequest.returnedAt,
                hintKey: "timeline.reviewHint",
            },
            {
                key: "failed",
                state: "error",
                time: changeRequest.lastApplyFailedAt ?? changeRequest.completedAt,
            },
        ];
    }

    let reviewState: ChangeTimelineStepState = "pending";
    let reviewTime: string | undefined;
    if (status === "UNDER_REVIEW" || status === "RETURNED") {
        reviewState = "current";
        reviewTime = changeRequest.returnedAt ?? changeRequest.approvedAt;
    } else if (status === "APPROVED" || status === "APPLYING" || status === "COMPLETED") {
        reviewState = "done";
        reviewTime = changeRequest.approvedAt ?? changeRequest.returnedAt;
    }

    let completedState: ChangeTimelineStepState = "pending";
    let completedTime: string | undefined;
    if (status === "COMPLETED") {
        completedState = "done";
        completedTime = changeRequest.completedAt;
    } else if (status === "APPROVED" || status === "APPLYING") {
        completedState = "current";
        completedTime = changeRequest.approvedAt;
    }

    return [
        submitted,
        { key: "review", state: reviewState, time: reviewTime, hintKey: "timeline.reviewHint" },
        { key: "completed", state: completedState, time: completedTime },
    ];
}
