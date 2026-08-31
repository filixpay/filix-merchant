"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Col, Row, Skeleton, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import DashboardPage from "@/components/layout/DashboardPage";
import TransactionDetailSummary from "@/components/reporting/TransactionDetailSummary";
import TransactionTimelinePanel from "@/components/reporting/TransactionTimelinePanel";
import { isReportResourceNotFound } from "@/components/reporting/transaction-detail-model";
import {
    reportingApi,
    type TransactionReportDetail,
    type TransactionTimeline,
} from "@/lib/api/domains/reporting";
import { resolveReportingBusinessDetailPath } from "@/lib/reporting/reporting-business-detail-path";

export default function ReportingTransactionDetailPage() {
    const params = useParams<{ id: string }>();
    const locale = useLocale();
    const t = useTranslations("Reporting.transactions.detail");
    const tCommon = useTranslations("Common");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [detail, setDetail] = useState<TransactionReportDetail | null>(null);
    const [timeline, setTimeline] = useState<TransactionTimeline | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reportId = params.id;

    const loadTransaction = useCallback(async () => {
        if (!accessToken || !reportId) {
            return;
        }

        setLoading(true);
        setNotFound(false);
        setError(null);
        setDetail(null);
        setTimeline(null);

        try {
            const [detailResult, timelineResult] = await Promise.all([
                reportingApi.query<TransactionReportDetail>(accessToken, {
                    apiVersion: "V1",
                    domain: "TRANSACTION",
                    view: "DETAIL",
                    id: reportId,
                }),
                reportingApi.query<TransactionTimeline>(accessToken, {
                    apiVersion: "V1",
                    domain: "TRANSACTION",
                    view: "TIMELINE",
                    id: reportId,
                }),
            ]);
            setDetail(detailResult);
            setTimeline(timelineResult);
        } catch (err) {
            if (isReportResourceNotFound(err)) {
                setNotFound(true);
            } else {
                setError(err instanceof Error ? err.message : tCommon("error"));
            }
        } finally {
            setLoading(false);
        }
    }, [accessToken, reportId, tCommon]);

    useEffect(() => {
        loadTransaction();
    }, [loadTransaction]);

    const backLink = (
        <Link
            href={`/${locale}/dashboard/reporting/transactions`}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
            <ArrowLeftOutlined />
            {t("back_to_list")}
        </Link>
    );

    if (loading) {
        return (
            <DashboardPage title={t("title")} subtitle={backLink}>
                <Skeleton active paragraph={{ rows: 8 }} />
            </DashboardPage>
        );
    }

    if (notFound) {
        return (
            <DashboardPage title={t("title")} subtitle={backLink}>
                <Typography.Text type="secondary">{t("resource_unavailable")}</Typography.Text>
            </DashboardPage>
        );
    }

    if (!detail) {
        return (
            <DashboardPage title={t("title")} subtitle={backLink}>
                <Typography.Text type="danger">{error ?? tCommon("error")}</Typography.Text>
            </DashboardPage>
        );
    }

    const businessDetailHref = resolveReportingBusinessDetailPath(
        locale,
        detail.orderType,
        detail.businessId,
    );

    return (
        <DashboardPage
            title={t("title")}
            subtitle={
                <div>
                    {backLink}
                    <Typography.Text type="secondary" style={{ display: "block", marginTop: 4 }}>
                        {detail.tradeNo || detail.merchantOrderId}
                    </Typography.Text>
                    {businessDetailHref ? (
                        <div style={{ marginTop: 4 }}>
                            <Link href={businessDetailHref}>{t("view_business_detail")}</Link>
                        </div>
                    ) : null}
                </div>
            }
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                    <TransactionDetailSummary detail={detail} />
                </Col>
                <Col xs={24} lg={10}>
                    <TransactionTimelinePanel items={timeline?.items ?? []} />
                </Col>
            </Row>
        </DashboardPage>
    );
}
