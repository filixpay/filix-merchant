"use client";

import { Card, Descriptions, Tag, Timeline, Typography } from "antd";
import { useTranslations } from "next-intl";
import type { CoverageClaimView } from "@/lib/api";
import { formatDisputeAmount, getCoverageStatusColor } from "@/components/disputes/dispute-model";

interface CoveragePanelProps {
    coverageClaim: CoverageClaimView;
}

export default function CoveragePanel({ coverageClaim }: CoveragePanelProps) {
    const t = useTranslations("Disputes");

    const sortedEvents = [...coverageClaim.events].sort((a, b) => a.sequenceNo - b.sequenceNo);

    return (
        <Card size="small" title={t("coverage.title")}>
            <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label={t("coverage.headers.status")}>
                    <Tag color={getCoverageStatusColor(coverageClaim.status)}>
                        {t(`coverage.status.${coverageClaim.status}`)}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t("coverage.headers.provider")}>
                    {coverageClaim.provider}
                </Descriptions.Item>
                <Descriptions.Item label={t("coverage.headers.amount")}>
                    {formatDisputeAmount(coverageClaim.claimAmount, coverageClaim.currency)}
                </Descriptions.Item>
                {coverageClaim.assessmentPublicId ? (
                    <Descriptions.Item label={t("coverage.headers.assessment_id")}>
                        <Typography.Text copyable>{coverageClaim.assessmentPublicId}</Typography.Text>
                    </Descriptions.Item>
                ) : null}
                {coverageClaim.providerClaimId ? (
                    <Descriptions.Item label={t("coverage.headers.provider_claim_id")}>
                        {coverageClaim.providerClaimId}
                    </Descriptions.Item>
                ) : null}
            </Descriptions>

            {sortedEvents.length > 0 ? (
                <div style={{ marginTop: 16 }}>
                    <Typography.Title level={5} style={{ marginTop: 0 }}>
                        {t("coverage.timeline.title")}
                    </Typography.Title>
                    <Timeline
                        mode="left"
                        items={sortedEvents.map((event) => ({
                            key: event.id,
                            label: new Date(event.occurredAt).toLocaleString(),
                            children: (
                                <div>
                                    <Typography.Text strong>
                                        {t(`coverage.event_type.${event.eventType}`)}
                                    </Typography.Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Tag color={getCoverageStatusColor(event.status)}>
                                            {t(`coverage.status.${event.status}`)}
                                        </Tag>
                                    </div>
                                    {event.reason ? (
                                        <Typography.Paragraph
                                            type="secondary"
                                            style={{ marginBottom: 0, marginTop: 4 }}
                                        >
                                            {event.reason}
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
