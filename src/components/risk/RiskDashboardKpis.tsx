"use client";

import Link from "next/link";
import { Skeleton } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight, ShieldAlert } from "lucide-react";
import type { RiskDashboardMetrics } from "@/lib/api";
import styles from "./RiskDashboardKpis.module.css";

interface RiskDashboardKpisProps {
    metrics: RiskDashboardMetrics | null;
    loading: boolean;
}

export default function RiskDashboardKpis({ metrics, loading }: RiskDashboardKpisProps) {
    const t = useTranslations("Risk.dashboard");
    const locale = useLocale();

    if (loading) {
        return <Skeleton active paragraph={{ rows: 2 }} />;
    }

    if (!metrics) {
        return null;
    }

    const blockedDisplay = metrics.blockedAmount.supported
        ? (metrics.blockedAmount.value ?? "-")
        : "-";

    const reviewSlaDisplay =
        metrics.reviewSlaHours != null
            ? metrics.reviewSlaHours.toFixed(1)
            : "-";

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.headerTitle}>
                    <ShieldAlert className={styles.headerIcon} size={16} strokeWidth={1.5} />
                    {t("title")}
                </h3>
                <Link href={`/${locale}/dashboard/fraud`} className={styles.headerLink}>
                    {t("view_fraud")} <ChevronRight size={12} strokeWidth={1.75} />
                </Link>
            </div>

            <div className={styles.body}>
                <div className={styles.actions}>
                    <div className={styles.sectionLabel}>
                        <span className={styles.sectionDot} />
                        {t("pending_events")}
                    </div>

                    <div className={styles.actionGrid}>
                        <div
                            className={`${styles.actionCard} ${
                                metrics.pendingReviews > 0 ? styles.actionCardWarn : ""
                            }`}
                        >
                            <div className={styles.actionHeader}>
                                <span
                                    className={`${styles.actionTitle} ${
                                        metrics.pendingReviews > 0 ? styles.actionTitleActiveWarn : ""
                                    }`}
                                >
                                    {t("pending_reviews")}
                                </span>
                                {metrics.pendingReviews > 0 ? <span className={styles.pulseWarn} /> : null}
                            </div>
                            <span
                                className={`financial-amount ${styles.actionValue} ${
                                    metrics.pendingReviews > 0 ? styles.actionValueWarn : ""
                                }`}
                            >
                                {metrics.pendingReviews}
                            </span>
                        </div>

                        <div
                            className={`${styles.actionCard} ${
                                metrics.openDisputes > 0 ? styles.actionCardDanger : ""
                            }`}
                        >
                            <div className={styles.actionHeader}>
                                <span
                                    className={`${styles.actionTitle} ${
                                        metrics.openDisputes > 0 ? styles.actionTitleActiveDanger : ""
                                    }`}
                                >
                                    {t("open_disputes")}
                                </span>
                                {metrics.openDisputes > 0 ? <span className={styles.pulseDanger} /> : null}
                            </div>
                            <span
                                className={`financial-amount ${styles.actionValue} ${
                                    metrics.openDisputes > 0 ? styles.actionValueDanger : ""
                                }`}
                            >
                                {metrics.openDisputes}
                            </span>
                        </div>

                        <div
                            className={`${styles.actionCard} ${
                                metrics.highFraudToday > 0 ? styles.actionCardDanger : ""
                            }`}
                        >
                            <div className={styles.actionHeader}>
                                <span
                                    className={`${styles.actionTitle} ${
                                        metrics.highFraudToday > 0 ? styles.actionTitleActiveDanger : ""
                                    }`}
                                >
                                    {t("high_fraud_today")}
                                </span>
                                {metrics.highFraudToday > 0 ? <span className={styles.pulseDanger} /> : null}
                            </div>
                            <span
                                className={`financial-amount ${styles.actionValue} ${
                                    metrics.highFraudToday > 0 ? styles.actionValueDanger : ""
                                }`}
                            >
                                {metrics.highFraudToday}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.metrics}>
                    <div className={styles.sectionLabel}>{t("monitoring_metrics")}</div>
                    <div className={styles.metricGrid}>
                        <div>
                            <span className={styles.metricLabel}>{t("rejected_today")}</span>
                            <span className={`financial-amount ${styles.metricValue}`}>
                                {metrics.rejectedToday}
                            </span>
                        </div>
                        <div>
                            <span className={styles.metricLabel}>{t("pending_review_attempts")}</span>
                            <span className={`financial-amount ${styles.metricValue}`}>
                                {metrics.pendingReviewAttempts}
                            </span>
                        </div>
                        <div>
                            <span className={styles.metricLabel}>{t("blocked_amount")}</span>
                            <span className={`financial-amount ${styles.metricValue}`}>{blockedDisplay}</span>
                        </div>
                        <div>
                            <span className={styles.metricLabel}>{t("review_sla_hours")}</span>
                            <span className={`financial-amount ${styles.metricValue}`}>
                                {reviewSlaDisplay}
                            </span>
                        </div>
                        <div>
                            <span className={styles.metricLabel}>{t("chargeback_ratio")}</span>
                            <span className={`financial-amount ${styles.metricValue} ${styles.metricValuePositive}`}>
                                {metrics.chargebackRatio != null
                                    ? `${(metrics.chargebackRatio * 100).toFixed(2)}%`
                                    : "-"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
