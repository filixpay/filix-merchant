"use client";

import { Timeline, Typography } from "antd";
import { useTranslations } from "next-intl";
import type { MerchantChangeRequest } from "@/lib/api/domains/maintenance";
import {
    buildChangeProgressPipeline,
    type ChangeTimelineStep,
    type ChangeTimelineStepState,
} from "@/components/maintenance/maintenance-change-ui";

type ChangeStatusTimelineProps = {
    changeRequest: MerchantChangeRequest;
};

const STATE_COLOR: Record<ChangeTimelineStepState, string> = {
    done: "green",
    current: "blue",
    pending: "gray",
    error: "red",
};

function stepTitle(step: ChangeTimelineStep, t: (key: string) => string): string {
    switch (step.key) {
        case "submitted":
            return t("status.SUBMITTED");
        case "review":
            return t("timeline.reviewTitle");
        case "completed":
            return t("timeline.completedTitle");
        case "cancelled":
            return t("status.CANCELLED");
        case "rejected":
            return t("status.REJECTED");
        case "failed":
            return t("status.APPLY_FAILED");
        default:
            return step.key;
    }
}

export default function ChangeStatusTimeline({ changeRequest }: ChangeStatusTimelineProps) {
    const t = useTranslations("Maintenance");
    const steps = buildChangeProgressPipeline(changeRequest);

    const reviewNotes = (changeRequest.reviews ?? [])
        .slice()
        .reverse()
        .map((review) => ({
            time: review.createdAt,
            text: `${t(`reviewDecision.${review.decision}`)}${review.comment ? `: ${review.comment}` : ""}`,
        }));

    const items = steps.map((step) => {
        const strong = step.state === "current" || step.state === "done" || step.state === "error";
        return {
            color: STATE_COLOR[step.state],
            children: (
                <div style={{ paddingBottom: 8 }}>
                    <Typography.Text strong={strong} type={step.state === "pending" ? "secondary" : undefined}>
                        {stepTitle(step, t)}
                    </Typography.Text>
                    {step.time ? (
                        <div>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {new Date(step.time).toLocaleString()}
                                {step.key === "submitted" ? ` · ${t("timeline.submittedByMerchant")}` : null}
                            </Typography.Text>
                        </div>
                    ) : null}
                    {step.state === "pending" && step.hintKey ? (
                        <div>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {t(step.hintKey)}
                            </Typography.Text>
                        </div>
                    ) : null}
                    {step.key === "review" && reviewNotes.length > 0
                        ? reviewNotes.map((note, index) => (
                              <div key={`${note.text}-${index}`} style={{ marginTop: 4 }}>
                                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                      {note.time ? `${new Date(note.time).toLocaleString()} · ` : ""}
                                      {note.text}
                                  </Typography.Text>
                              </div>
                          ))
                        : null}
                    {step.key === "review" && changeRequest.returnedReason ? (
                        <div style={{ marginTop: 4 }}>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {changeRequest.returnedReason}
                            </Typography.Text>
                        </div>
                    ) : null}
                    {step.key === "failed" && changeRequest.lastApplyErrorCode ? (
                        <div style={{ marginTop: 4 }}>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {changeRequest.lastApplyErrorCode}
                            </Typography.Text>
                        </div>
                    ) : null}
                </div>
            ),
        };
    });

    return <Timeline items={items} />;
}
