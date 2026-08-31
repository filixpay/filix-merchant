"use client";

import Link from "next/link";
import { Card, List, Tag, Typography } from "antd";
import { useLocale, useTranslations } from "next-intl";
import type { RelatedRiskSummary } from "@/lib/api";
import { getPriorityColor } from "@/components/disputes/dispute-model";
import { resolveRiskActionPath } from "@/lib/risk/resolve-risk-action-path";
import { formatFraudRiskType } from "@/components/fraud/fraud-labels";

interface RelatedRiskPanelProps {
    relatedRisk: RelatedRiskSummary;
}

export default function RelatedRiskPanel({ relatedRisk }: RelatedRiskPanelProps) {
    const t = useTranslations("Risk");
    const tFraud = useTranslations("Fraud");
    const tDisputes = useTranslations("Disputes");
    const tReviews = useTranslations("RiskReviews");
    const locale = useLocale();

    const hasFraud = relatedRisk.fraudEvents.length > 0;
    const hasReviews = relatedRisk.reviews.length > 0;

    if (!hasFraud && !hasReviews) {
        return null;
    }

    return (
        <Card size="small" title={t("related_risk.title")}>
            {hasFraud ? (
                <div style={{ marginBottom: hasReviews ? 16 : 0 }}>
                    <Typography.Text strong>{t("related_risk.fraud_events")}</Typography.Text>
                    <List
                        size="small"
                        dataSource={relatedRisk.fraudEvents}
                        renderItem={(item) => (
                            <List.Item>
                                <Link href={resolveRiskActionPath(`/risk/fraud-events/${item.id}`, locale) ?? "#"}>
                                    <Typography.Text>{formatFraudRiskType(tFraud, item.riskType)}</Typography.Text>
                                </Link>
                                <Tag color={getPriorityColor(item.severity)} style={{ marginLeft: 8 }}>
                                    {tDisputes(`priority.${item.severity}`)}
                                </Tag>
                                <Typography.Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                                    {new Date(item.detectedAt).toLocaleString()}
                                </Typography.Text>
                            </List.Item>
                        )}
                    />
                </div>
            ) : null}
            {hasReviews ? (
                <div>
                    <Typography.Text strong>{t("related_risk.reviews")}</Typography.Text>
                    <List
                        size="small"
                        dataSource={relatedRisk.reviews}
                        renderItem={(item) => (
                            <List.Item>
                                <Link href={resolveRiskActionPath(`/risk/reviews/${item.id}`, locale) ?? "#"}>
                                    <Typography.Text>
                                        {item.reviewType} · {item.reasonCode}
                                    </Typography.Text>
                                </Link>
                                <Tag style={{ marginLeft: 8 }}>{tReviews(`status.${item.status}`)}</Tag>
                            </List.Item>
                        )}
                    />
                </div>
            ) : null}
        </Card>
    );
}
