"use client";

import { Timeline, Typography } from "antd";
import { useTranslations } from "next-intl";
import type { ApplicationReview, ApplicationStatus, MerchantApplication } from "@/lib/api/domains/onboarding";

const STATUS_COLOR: Partial<Record<ApplicationStatus, string>> = {
    SUBMITTED: "blue",
    UNDER_REVIEW: "blue",
    RETURNED: "orange",
    APPROVED: "green",
    PROVISIONING: "green",
    PROVISION_FAILED: "red",
    COMPLETED: "green",
    REJECTED: "red",
    CANCELLED: "gray",
};

type ApplicationStatusTimelineProps = {
    application: MerchantApplication;
};

function formatReview(review: ApplicationReview, t: (key: string) => string) {
    const decisionLabel = t(`reviewDecision.${review.decision}`);
    return `${decisionLabel}${review.comment ? `: ${review.comment}` : ""}`;
}

export default function ApplicationStatusTimeline({ application }: ApplicationStatusTimelineProps) {
    const t = useTranslations("Onboarding");

    const items = [
        {
            color: STATUS_COLOR[application.status] ?? "gray",
            children: (
                <>
                    <Typography.Text strong>{t(`status.${application.status}`)}</Typography.Text>
                    {application.returnedReason ? (
                        <div>{application.returnedReason}</div>
                    ) : null}
                </>
            ),
        },
        ...(application.reviews ?? []).map((review) => ({
            color: STATUS_COLOR[review.decision === "RETURN" ? "RETURNED" : "UNDER_REVIEW"],
            children: (
                <>
                    <Typography.Text type="secondary">
                        {review.createdAt ? new Date(review.createdAt).toLocaleString() : ""}
                    </Typography.Text>
                    <div>{formatReview(review, t)}</div>
                </>
            ),
        })),
    ];

    return <Timeline items={items} />;
}
