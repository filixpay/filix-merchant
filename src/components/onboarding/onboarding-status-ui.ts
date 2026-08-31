import type { ApplicationStatus, MerchantApplication } from "@/lib/api/domains/onboarding";

export type OnboardingTimelineStepState = "done" | "current" | "pending" | "error";

export type OnboardingTimelineStepKey =
    | "submitted"
    | "platformReview"
    | "credentialCheck"
    | "completed"
    | "cancelled"
    | "rejected"
    | "provisionFailed";

export type OnboardingTimelineStep = {
    key: OnboardingTimelineStepKey;
    state: OnboardingTimelineStepState;
    time?: string;
    hintKey?: string;
};

export type OnboardingTimelineSource = Pick<
    MerchantApplication,
    | "status"
    | "submittedAt"
    | "approvedAt"
    | "completedAt"
    | "returnedAt"
    | "returnedReason"
    | "lastProvisionFailedAt"
    | "lastProvisionErrorCode"
>;

const HAPPY_PATH: OnboardingTimelineStepKey[] = [
    "submitted",
    "platformReview",
    "credentialCheck",
    "completed",
];

export function formatOnboardingDateTime(value?: string, locale = "zh-CN"): string {
    if (!value) {
        return "—";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "—";
    }
    return date.toLocaleString(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}

export function formatApplicationIdDisplay(id: string): string {
    const normalized = id.replace(/-/g, "").toUpperCase();
    if (normalized.length < 12) {
        return id;
    }
    return `REQ-${normalized.slice(0, 8)}-${normalized.slice(-4)}`;
}

export function getOnboardingStatusTagColor(status: ApplicationStatus): string {
    switch (status) {
        case "DRAFT":
            return "default";
        case "SUBMITTED":
        case "UNDER_REVIEW":
        case "APPROVED":
        case "PROVISIONING":
            return "processing";
        case "RETURNED":
            return "warning";
        case "COMPLETED":
            return "success";
        case "REJECTED":
        case "PROVISION_FAILED":
            return "error";
        case "CANCELLED":
            return "default";
        default:
            return "default";
    }
}

function happyPathSteps(
    states: Record<OnboardingTimelineStepKey, OnboardingTimelineStep>,
): OnboardingTimelineStep[] {
    return HAPPY_PATH.map((key) => states[key]);
}

export function buildOnboardingProgressPipeline(
    application: OnboardingTimelineSource,
): OnboardingTimelineStep[] {
    const { status } = application;

    if (status === "DRAFT") {
        return happyPathSteps({
            submitted: { key: "submitted", state: "pending", hintKey: "timeline.submittedHint" },
            platformReview: {
                key: "platformReview",
                state: "pending",
                hintKey: "timeline.platformReviewHint",
            },
            credentialCheck: {
                key: "credentialCheck",
                state: "pending",
                hintKey: "timeline.credentialCheckHint",
            },
            completed: { key: "completed", state: "pending", hintKey: "timeline.completedHint" },
        });
    }

    if (status === "CANCELLED") {
        const steps: OnboardingTimelineStep[] = [];
        if (application.submittedAt) {
            steps.push({
                key: "submitted",
                state: "done",
                time: application.submittedAt,
            });
        }
        steps.push({
            key: "cancelled",
            state: "error",
            time: application.completedAt,
            hintKey: "timeline.cancelledReason",
        });
        return steps;
    }

    if (status === "REJECTED") {
        return [
            {
                key: "submitted",
                state: "done",
                time: application.submittedAt,
            },
            {
                key: "platformReview",
                state: "done",
                time: application.returnedAt ?? application.approvedAt ?? application.submittedAt,
                hintKey: "timeline.platformReviewHint",
            },
            {
                key: "rejected",
                state: "error",
                time: application.completedAt ?? application.returnedAt,
                hintKey: "timeline.rejectedHint",
            },
        ];
    }

    if (status === "PROVISION_FAILED") {
        return [
            {
                key: "submitted",
                state: "done",
                time: application.submittedAt,
            },
            {
                key: "platformReview",
                state: "done",
                time: application.approvedAt ?? application.submittedAt,
                hintKey: "timeline.platformReviewHint",
            },
            {
                key: "provisionFailed",
                state: "error",
                time: application.lastProvisionFailedAt ?? application.approvedAt,
                hintKey: application.lastProvisionErrorCode
                    ? undefined
                    : "timeline.provisionFailedHint",
            },
        ];
    }

    const submitted: OnboardingTimelineStep = {
        key: "submitted",
        state: "done",
        time: application.submittedAt,
        hintKey: "timeline.submittedDetail",
    };

    let platformReviewState: OnboardingTimelineStepState = "pending";
    let platformReviewTime: string | undefined;
    if (status === "SUBMITTED") {
        platformReviewState = "current";
        platformReviewTime = application.submittedAt;
    } else if (status === "UNDER_REVIEW" || status === "RETURNED") {
        platformReviewState = "current";
        platformReviewTime = application.returnedAt ?? application.submittedAt;
    } else if (
        status === "APPROVED" ||
        status === "PROVISIONING" ||
        status === "COMPLETED"
    ) {
        platformReviewState = "done";
        platformReviewTime = application.approvedAt ?? application.returnedAt ?? application.submittedAt;
    }

    let credentialCheckState: OnboardingTimelineStepState = "pending";
    let credentialCheckTime: string | undefined;
    if (status === "APPROVED" || status === "PROVISIONING") {
        credentialCheckState = "current";
        credentialCheckTime = application.approvedAt;
    } else if (status === "COMPLETED") {
        credentialCheckState = "done";
        credentialCheckTime = application.approvedAt;
    }

    let completedState: OnboardingTimelineStepState = "pending";
    let completedTime: string | undefined;
    if (status === "COMPLETED") {
        completedState = "done";
        completedTime = application.completedAt;
    } else if (status === "PROVISIONING") {
        completedState = "current";
        completedTime = application.approvedAt;
    }

    return [
        submitted,
        {
            key: "platformReview",
            state: platformReviewState,
            time: platformReviewTime,
            hintKey:
                platformReviewState === "current" || platformReviewState === "pending"
                    ? "timeline.platformReviewHint"
                    : undefined,
        },
        {
            key: "credentialCheck",
            state: credentialCheckState,
            time: credentialCheckTime,
            hintKey:
                credentialCheckState === "current" || credentialCheckState === "pending"
                    ? "timeline.credentialCheckHint"
                    : undefined,
        },
        {
            key: "completed",
            state: completedState,
            time: completedTime,
            hintKey:
                completedState === "pending" ? "timeline.completedHint" : "timeline.completedDetail",
        },
    ];
}
