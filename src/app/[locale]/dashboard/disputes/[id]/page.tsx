"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { App, Card, Col, Descriptions, Row, Skeleton, Tag, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import { api, type DisputeView, EvidenceCategory } from "@/lib/api";
import { invalidateNotificationState } from "@/lib/notifications/invalidate";
import DashboardPage from "@/components/layout/DashboardPage";
import MerchantActionCenter from "@/components/disputes/MerchantActionCenter";
import ImmutableTimeline from "@/components/disputes/ImmutableTimeline";
import CoveragePanel from "@/components/disputes/CoveragePanel";
import CoverageAssessmentPanel from "@/components/disputes/CoverageAssessmentPanel";
import MerchantOrderLink from "@/components/orders/MerchantOrderLink";
import RelatedRiskPanel from "@/components/risk/RelatedRiskPanel";
import { formatDisputeAmount, getPriorityColor, getStatusColor } from "@/components/disputes/dispute-model";
import { localizeDisputeReason } from "@/components/disputes/dispute-labels";
import ResponseDueDisplay from "@/components/disputes/ResponseDueDisplay";
import styles from "@/components/disputes/DisputeOperationalKpis.module.css";

export default function DisputeDetailPage() {
    const params = useParams<{ id: string }>();
    const locale = useLocale();
    const t = useTranslations("Disputes");
    const tCommon = useTranslations("Common");
    const { message } = App.useApp();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [dispute, setDispute] = useState<DisputeView | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadDispute = useCallback(async () => {
        if (!accessToken || !params.id) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const detail = await api.risk.disputes.get(params.id, accessToken);
            setDispute(detail);
        } catch (err) {
            setError(err instanceof Error ? err.message : tCommon("error"));
            setDispute(null);
        } finally {
            setLoading(false);
        }
    }, [accessToken, params.id, tCommon]);

    useEffect(() => {
        loadDispute();
    }, [loadDispute]);

    const runAction = async (
        action: (token: string) => Promise<DisputeView>,
        successKey: string,
    ) => {
        if (!accessToken) {
            return;
        }

        setSaving(true);
        try {
            const updated = await action(accessToken);
            setDispute(updated);
            invalidateNotificationState();
            message.success(t(successKey));
        } catch (err) {
            message.error(err instanceof Error ? err.message : tCommon("error"));
        } finally {
            setSaving(false);
        }
    };

    const backLink = (
        <Link href={`/${locale}/dashboard/disputes`} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ArrowLeftOutlined />
            {t("back_to_list")}
        </Link>
    );

    if (loading) {
        return (
            <DashboardPage title={t("detail.title")} subtitle={backLink}>
                <Skeleton active paragraph={{ rows: 8 }} />
            </DashboardPage>
        );
    }

    if (!dispute) {
        return (
            <DashboardPage title={t("detail.title")} subtitle={backLink}>
                <Typography.Text type="danger">{error ?? t("detail.not_found")}</Typography.Text>
            </DashboardPage>
        );
    }

    return (
        <DashboardPage
            title={t("detail.title")}
            subtitle={
                <div>
                    {backLink}
                    <Typography.Text type="secondary" style={{ display: "block", marginTop: 4 }}>
                        {dispute.caseNumber}
                    </Typography.Text>
                </div>
            }
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                    <Card size="small" style={{ marginBottom: 16 }}>
                        <Descriptions column={1} size="small" bordered>
                            <Descriptions.Item label={t("headers.case_number")}>{dispute.caseNumber}</Descriptions.Item>
                            <Descriptions.Item label={t("headers.order_id")}>
                                <MerchantOrderLink merchantOrderId={dispute.merchantOrderId} />
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.channel")}>
                                {dispute.channelCode || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.amount")}>
                                <span className={styles.amountCell}>
                                    {formatDisputeAmount(dispute.amount, dispute.currency)}
                                </span>
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.reason")}>
                                {localizeDisputeReason(dispute.reason, t)}
                            </Descriptions.Item>
                            <Descriptions.Item label={t("detail.reason_code")}>
                                {dispute.reasonCode || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.status")}>
                                <Tag color={getStatusColor(dispute.status)}>{t(`status.${dispute.status}`)}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.priority")}>
                                <Tag color={getPriorityColor(dispute.priority)}>
                                    {t(`priority.${dispute.priority}`)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.response_due")}>
                                <ResponseDueDisplay responseDueAt={dispute.responseDueAt} />
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    <MerchantActionCenter
                        dispute={dispute}
                        saving={saving}
                        uploading={uploading}
                        onUploadEvidence={async (file) => {
                            if (!accessToken) {
                                throw new Error(tCommon("error"));
                            }
                            setUploading(true);
                            try {
                                return await api.risk.disputes.uploadEvidence(
                                    dispute.id,
                                    file,
                                    EvidenceCategory.OTHER,
                                    accessToken,
                                );
                            } finally {
                                setUploading(false);
                            }
                        }}
                        onSaveDraft={(evidence) =>
                            runAction(
                                (token) => api.risk.disputes.saveDraft(dispute.id, { evidence }, token),
                                "messages.draft_saved",
                            )
                        }
                        onSubmit={(evidence) =>
                            runAction(
                                (token) => api.risk.disputes.submitEvidence(dispute.id, { evidence }, token),
                                "messages.submitted",
                            )
                        }
                        onAcceptLiability={() =>
                            runAction(
                                (token) => api.risk.disputes.acceptLiability(dispute.id, token),
                                "messages.liability_accepted",
                            )
                        }
                    />
                </Col>
                <Col xs={24} lg={10}>
                    {dispute.coverageAssessmentSummary ? (
                        <div style={{ marginBottom: 16 }}>
                            <CoverageAssessmentPanel
                                summary={dispute.coverageAssessmentSummary}
                                timeline={dispute.coverageAssessmentTimeline ?? []}
                            />
                        </div>
                    ) : null}
                    {dispute.coverageClaim ? (
                        <div style={{ marginBottom: 16 }}>
                            <CoveragePanel coverageClaim={dispute.coverageClaim} />
                        </div>
                    ) : null}
                    {dispute.relatedRisk ? (
                        <div style={{ marginBottom: 16 }}>
                            <RelatedRiskPanel relatedRisk={dispute.relatedRisk} />
                        </div>
                    ) : null}
                    <Card size="small">
                        <ImmutableTimeline events={dispute.events} />
                    </Card>
                </Col>
            </Row>
        </DashboardPage>
    );
}
