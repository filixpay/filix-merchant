"use client";

import { Card, Col, Descriptions, Row, Skeleton, Tag, Typography } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import type { FraudEventDetail } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import ImmutableTimeline from "@/components/disputes/ImmutableTimeline";
import MerchantOrderLink from "@/components/orders/MerchantOrderLink";
import RelatedRiskPanel from "@/components/risk/RelatedRiskPanel";
import FraudMetadataPanel from "@/components/fraud/metadata/FraudMetadataPanel";
import { formatFraudRiskType, formatFraudSummary } from "@/components/fraud/fraud-labels";
import { getPriorityColor } from "@/components/disputes/dispute-model";

interface FraudDetailViewProps {
    event: FraudEventDetail | null;
    loading: boolean;
    error?: string | null;
}

export default function FraudDetailView({ event, loading, error }: FraudDetailViewProps) {
    const locale = useLocale();
    const t = useTranslations("Fraud");
    const tDisputes = useTranslations("Disputes");

    const backLink = (
        <Link href={`/${locale}/dashboard/fraud`} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ArrowLeftOutlined />
            {t("detail.back_to_list")}
        </Link>
    );

    if (loading) {
        return (
            <DashboardPage title={t("detail.title")} subtitle={backLink}>
                <Skeleton active paragraph={{ rows: 8 }} />
            </DashboardPage>
        );
    }

    if (!event) {
        return (
            <DashboardPage title={t("detail.title")} subtitle={backLink}>
                <Typography.Text type="danger">{error ?? t("detail.not_found")}</Typography.Text>
            </DashboardPage>
        );
    }

    const summary = formatFraudSummary(t, event);

    return (
        <DashboardPage
            title={summary !== "-" ? summary : t("detail.title")}
            subtitle={
                <div>
                    {backLink}
                    <Typography.Text type="secondary" style={{ display: "block", marginTop: 4 }}>
                        {event.id}
                    </Typography.Text>
                </div>
            }
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                    <Card size="small" style={{ marginBottom: 16 }}>
                        <Descriptions column={1} size="small" bordered>
                            <Descriptions.Item label={t("headers.event_type")}>
                                {formatFraudRiskType(t, event.riskType ?? event.eventType)}
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.risk_type")}>
                                {formatFraudRiskType(t, event.riskType)}
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.description")}>{summary}</Descriptions.Item>
                            <Descriptions.Item label={t("headers.severity")}>
                                <Tag color={getPriorityColor(event.severity)}>
                                    {tDisputes(`priority.${event.severity}`)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.status")}>
                                <Tag>{t(`status.${event.status}`)}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.detected_at")}>
                                {new Date(event.detectedAt).toLocaleString()}
                            </Descriptions.Item>
                            {event.merchantOrderId ? (
                                <Descriptions.Item label={t("headers.order_id")}>
                                    <MerchantOrderLink merchantOrderId={event.merchantOrderId} />
                                </Descriptions.Item>
                            ) : null}
                            {event.paymentId != null ? (
                                <Descriptions.Item label={t("detail.payment_id")}>{event.paymentId}</Descriptions.Item>
                            ) : null}
                            {event.provider ? (
                                <Descriptions.Item label={t("detail.provider")}>{event.provider}</Descriptions.Item>
                            ) : null}
                            {event.score != null ? (
                                <Descriptions.Item label={t("detail.score")}>{event.score}</Descriptions.Item>
                            ) : null}
                        </Descriptions>
                    </Card>
                    {event.metadata && Object.keys(event.metadata).length > 0 ? (
                        <Card size="small" title={t("detail.metadata.title")}>
                            <FraudMetadataPanel
                                metadata={event.metadata}
                                metadataSchemaVersion={event.metadataSchemaVersion}
                            />
                        </Card>
                    ) : null}
                </Col>
                <Col xs={24} lg={10}>
                    <div style={{ marginBottom: 16 }}>
                        <RelatedRiskPanel relatedRisk={event.relatedRisk} />
                    </div>
                    <Card size="small">
                        <ImmutableTimeline events={event.timeline} />
                    </Card>
                </Col>
            </Row>
        </DashboardPage>
    );
}
