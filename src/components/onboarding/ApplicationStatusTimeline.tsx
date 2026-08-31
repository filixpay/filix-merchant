"use client";

import { Timeline, Typography } from "antd";
import { useLocale, useTranslations } from "next-intl";
import type { MerchantApplication } from "@/lib/api/domains/onboarding";
import {
    buildOnboardingProgressPipeline,
    formatOnboardingDateTime,
    type OnboardingTimelineStep,
    type OnboardingTimelineStepState,
} from "@/components/onboarding/onboarding-status-ui";

type ApplicationStatusTimelineProps = {
    application: MerchantApplication;
};

const STATE_COLOR: Record<OnboardingTimelineStepState, string> = {
    done: "green",
    current: "blue",
    pending: "gray",
    error: "red",
};

function stepTitle(step: OnboardingTimelineStep, t: (key: string) => string): string {
    switch (step.key) {
        case "submitted":
            return t("timeline.submittedTitle");
        case "platformReview":
            return t("timeline.platformReviewTitle");
        case "credentialCheck":
            return t("timeline.credentialCheckTitle");
        case "completed":
            return t("timeline.completedTitle");
        case "cancelled":
            return t("status.CANCELLED");
        case "rejected":
            return t("status.REJECTED");
        case "provisionFailed":
            return t("status.PROVISION_FAILED");
        default:
            return step.key;
    }
}

export default function ApplicationStatusTimeline({ application }: ApplicationStatusTimelineProps) {
    const t = useTranslations("Onboarding");
    const locale = useLocale();
    const steps = buildOnboardingProgressPipeline(application);

    const reviewNotes = (application.reviews ?? [])
        .slice()
        .reverse()
        .map((review) => ({
            time: review.createdAt,
            text: `${t(`reviewDecision.${review.decision}`)}${review.comment ? `: ${review.comment}` : ""}`,
        }));

    const items = steps.map((step) => {
        const emphasized =
            step.state === "current" || step.state === "done" || step.state === "error";
        const hint =
            step.hintKey && (step.state === "pending" || step.state === "current" || step.state === "error")
                ? t(step.hintKey)
                : step.hintKey && step.state === "done" && step.key === "completed"
                  ? t(step.hintKey)
                  : undefined;

        return {
            color: STATE_COLOR[step.state],
            children: (
                <div style={{ paddingBottom: 8 }}>
                    <Typography.Text
                        strong={emphasized}
                        type={step.state === "pending" ? "secondary" : undefined}
                    >
                        {stepTitle(step, t)}
                    </Typography.Text>
                    {step.time ? (
                        <div>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {formatOnboardingDateTime(step.time, locale)}
                                {step.key === "submitted"
                                    ? ` · ${t("timeline.submittedByMerchant")}`
                                    : null}
                            </Typography.Text>
                        </div>
                    ) : null}
                    {hint ? (
                        <div>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {hint}
                            </Typography.Text>
                        </div>
                    ) : null}
                    {step.key === "platformReview" && application.returnedReason ? (
                        <div style={{ marginTop: 4 }}>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {application.returnedReason}
                            </Typography.Text>
                        </div>
                    ) : null}
                    {step.key === "platformReview" && reviewNotes.length > 0
                        ? reviewNotes.map((note, index) => (
                              <div key={`${note.text}-${index}`} style={{ marginTop: 4 }}>
                                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                      {note.time
                                          ? `${formatOnboardingDateTime(note.time, locale)} · `
                                          : ""}
                                      {note.text}
                                  </Typography.Text>
                              </div>
                          ))
                        : null}
                    {step.key === "provisionFailed" && application.lastProvisionErrorCode ? (
                        <div style={{ marginTop: 4 }}>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {application.lastProvisionErrorCode}
                            </Typography.Text>
                        </div>
                    ) : null}
                </div>
            ),
        };
    });

    return <Timeline items={items} />;
}
