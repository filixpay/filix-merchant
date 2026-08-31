"use client";

import { Card, Descriptions, Tag, Timeline, Typography } from "antd";
import { useLocale, useTranslations } from "next-intl";
import type { CoverageAssessmentLogView, CoverageAssessmentSummaryView } from "@/lib/api";
import { formatOrderMoneyAmount } from "@/components/orders/order-detail-format";

interface CoverageAssessmentPanelProps {
    summary: CoverageAssessmentSummaryView;
    timeline: readonly CoverageAssessmentLogView[];
}

function assessmentStatusColor(status: string): string {
    switch (status) {
        case "COVERED":
            return "success";
        case "NOT_COVERED":
            return "error";
        case "PARTIAL":
            return "warning";
        default:
            return "default";
    }
}

export default function CoverageAssessmentPanel({ summary, timeline }: CoverageAssessmentPanelProps) {
    const t = useTranslations("Disputes.coverage_assessment");
    const locale = useLocale();

    const sortedTimeline = [...timeline].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));

    return (
        <Card size="small" title={t("title")}>
            <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label={t("headers.status")}>
                    <Tag color={assessmentStatusColor(summary.status)}>
                        {t(`status.${summary.status}`, { defaultValue: summary.status })}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t("headers.provider")}>{summary.provider}</Descriptions.Item>
                <Descriptions.Item label={t("headers.stage")}>
                    {t(`stage.${summary.evaluationStage}`, { defaultValue: summary.evaluationStage })}
                </Descriptions.Item>
                {summary.limitAmount != null && summary.currency ? (
                    <Descriptions.Item label={t("headers.limit")}>
                        {formatOrderMoneyAmount(summary.limitAmount, summary.currency, locale)}
                    </Descriptions.Item>
                ) : null}
                {summary.primaryReferenceMasked ? (
                    <Descriptions.Item label={t("headers.reference")}>
                        {summary.primaryReferenceType
                            ? `${summary.primaryReferenceType}: ${summary.primaryReferenceMasked}`
                            : summary.primaryReferenceMasked}
                    </Descriptions.Item>
                ) : null}
                <Descriptions.Item label={t("headers.assessment_id")}>{summary.id}</Descriptions.Item>
            </Descriptions>

            {sortedTimeline.length > 1 ? (
                <div style={{ marginTop: 16 }}>
                    <Typography.Title level={5} style={{ marginTop: 0 }}>
                        {t("timeline.title")}
                    </Typography.Title>
                    <Timeline
                        mode="left"
                        items={sortedTimeline.map((entry) => ({
                            key: entry.id,
                            label: new Date(entry.occurredAt).toLocaleString(),
                            children: (
                                <div>
                                    <Typography.Text strong>
                                        {t(`stage.${entry.evaluationStage}`, {
                                            defaultValue: entry.evaluationStage,
                                        })}
                                    </Typography.Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Tag color={assessmentStatusColor(entry.status)}>
                                            {t(`status.${entry.status}`, { defaultValue: entry.status })}
                                        </Tag>
                                    </div>
                                    {entry.reason ? (
                                        <Typography.Paragraph
                                            type="secondary"
                                            style={{ marginBottom: 0, marginTop: 4 }}
                                        >
                                            {entry.reason}
                                        </Typography.Paragraph>
                                    ) : null}
                                </div>
                            ),
                        }))}
                    />
                </div>
            ) : null}
        </Card>
    );
}
