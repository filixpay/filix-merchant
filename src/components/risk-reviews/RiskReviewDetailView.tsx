"use client";

import { Card, Col, Descriptions, Row, Skeleton, Tag, Typography } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import type { RiskReviewDetail } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import ImmutableTimeline from "@/components/disputes/ImmutableTimeline";
import RelatedRiskPanel from "@/components/risk/RelatedRiskPanel";
import { getPriorityColor } from "@/components/disputes/dispute-model";
import { resolveRiskActionPath } from "@/lib/risk/resolve-risk-action-path";
import { resolveResumeLinkUrl } from "@/lib/notifications/resolve-notification-link";

interface RiskReviewDetailViewProps {
    review: RiskReviewDetail | null;
    loading: boolean;
    error?: string | null;
}

export default function RiskReviewDetailView({ review, loading, error }: RiskReviewDetailViewProps) {
    const locale = useLocale();
    const t = useTranslations("RiskReviews");
    const tDisputes = useTranslations("Disputes");

    const backLink = (
        <Link
            href={`/${locale}/dashboard/risk-reviews`}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
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

    if (!review) {
        return (
            <DashboardPage title={t("detail.title")} subtitle={backLink}>
                <Typography.Text type="danger">{error ?? t("detail.not_found")}</Typography.Text>
            </DashboardPage>
        );
    }

    const fraudHref = review.fraudEventPublicId
        ? resolveRiskActionPath(`/risk/fraud-events/${review.fraudEventPublicId}`, locale)
        : undefined;
    const resumeUrl = resolveResumeLinkUrl({
        resumeUrl: review.resumeUrl,
        content: review.decisionNote,
    });

    return (
        <DashboardPage
            title={t("detail.title")}
            subtitle={
                <div>
                    {backLink}
                    <Typography.Text type="secondary" style={{ display: "block", marginTop: 4 }}>
                        {review.id}
                    </Typography.Text>
                </div>
            }
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                    <Card size="small" style={{ marginBottom: 16 }}>
                        <Descriptions column={1} size="small" bordered>
                            <Descriptions.Item label={t("headers.resource")}>
                                <Tag>{t(`resource_type.${review.resourceType}`)}</Tag> {review.resourceId}
                            </Descriptions.Item>
                            <Descriptions.Item label={t("detail.review_type")}>{review.reviewType}</Descriptions.Item>
                            <Descriptions.Item label={t("detail.reason_code")}>{review.reasonCode}</Descriptions.Item>
                            <Descriptions.Item label={t("headers.reason")}>{review.reason}</Descriptions.Item>
                            <Descriptions.Item label={t("headers.priority")}>
                                <Tag color={getPriorityColor(review.priority)}>
                                    {tDisputes(`priority.${review.priority}`)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.status")}>
                                <Tag>{t(`status.${review.status}`)}</Tag>
                            </Descriptions.Item>
                            {review.queuedAt ? (
                                <Descriptions.Item label={t("detail.queued_at")}>
                                    {new Date(review.queuedAt).toLocaleString()}
                                </Descriptions.Item>
                            ) : null}
                            <Descriptions.Item label={t("headers.created_at")}>
                                {new Date(review.createdAt).toLocaleString()}
                            </Descriptions.Item>
                            {review.decidedAt ? (
                                <Descriptions.Item label={t("detail.decided_at")}>
                                    {new Date(review.decidedAt).toLocaleString()}
                                    {review.decidedBy ? ` · ${review.decidedBy}` : ""}
                                </Descriptions.Item>
                            ) : null}
                            {review.decisionNote ? (
                                <Descriptions.Item label={t("detail.decision_note")}>
                                    {review.decisionNote}
                                </Descriptions.Item>
                            ) : null}
                            {resumeUrl ? (
                                <Descriptions.Item label={t("detail.resume_link")}>
                                    <a href={resumeUrl} target="_blank" rel="noreferrer">
                                        {t("resume_link")}
                                    </a>
                                </Descriptions.Item>
                            ) : null}
                            {review.fraudEventPublicId && fraudHref ? (
                                <Descriptions.Item label={t("detail.linked_fraud")}>
                                    <Link href={fraudHref}>{review.fraudEventPublicId}</Link>
                                </Descriptions.Item>
                            ) : null}
                        </Descriptions>
                    </Card>
                </Col>
                <Col xs={24} lg={10}>
                    <div style={{ marginBottom: 16 }}>
                        <RelatedRiskPanel relatedRisk={review.relatedRisk} />
                    </div>
                    <Card size="small">
                        <ImmutableTimeline events={review.timeline} />
                    </Card>
                </Col>
            </Row>
        </DashboardPage>
    );
}
