"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Col, Row, Skeleton, Alert, Button, Tag } from "antd";
import {
    api,
    ApiError,
    MerchantDetailView,
    TodayOrderTotal,
    moneyProductApi,
    type MoneyActivityItem,
    type MoneyAssetBalance,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import ActionCenterWidget from "@/components/notifications/ActionCenterWidget";
import CommerceActivationHost from "@/components/commerce/activation/CommerceActivationHost";
import { normalizePagedResponse } from "@/lib/dashboard/normalize-paged-response";
import { isTrialMerchant } from "@/lib/merchant/merchant-tier";
import { presentDashboardAvailableFunds } from "@/lib/money/dashboard-available-funds";
import DashboardCurrencyRow from "@/components/money/DashboardCurrencyRow";
import {
    canFetchDashboardOverview,
    fetchDashboardOverviewData,
} from "@/lib/dashboard/fetch-dashboard-overview";
import { shapeDashboardOverview, type DashboardOverviewTrendPeriod } from "@/lib/dashboard/load-dashboard-overview";
import { useOpenTasks } from "@/lib/notifications/use-open-tasks";
import { useSelectedOrganizationCode } from "@/lib/organization/use-selected-organization-code";
import { useSelectedMerchantCode } from "@/lib/merchant/use-selected-merchant-code";
import styles from "./dashboard-overview.module.css";

const MAX_VISIBLE_ASSETS = 2;

export default function DashboardOverviewPage() {
    const [todayStats, setTodayStats] = useState<TodayOrderTotal[]>([]);
    const [loading, setLoading] = useState(true);
    const [merchantDetail, setMerchantDetail] = useState<MerchantDetailView | null>(null);
    const [assetBalances, setAssetBalances] = useState<MoneyAssetBalance[]>([]);
    const [moneyActivities, setMoneyActivities] = useState<MoneyActivityItem[]>([]);
    const [fundsLoaded, setFundsLoaded] = useState(false);
    const [riskMetrics, setRiskMetrics] = useState<Awaited<ReturnType<typeof api.risk.dashboard.get>> | null>(null);
    const [trendPeriod, setTrendPeriod] = useState<DashboardOverviewTrendPeriod>("7d");

    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const organizationCode = useSelectedOrganizationCode();
    const merchantCode = useSelectedMerchantCode();
    const { summary: taskSummary } = useOpenTasks(accessToken, 50);

    useEffect(() => {
        if (!accessToken) {
            setLoading(false);
            return;
        }
        // Wait for org + merchant selection — avoids empty KPIs on cold load / hydration race.
        if (!canFetchDashboardOverview(accessToken, organizationCode, merchantCode)) {
            setLoading(true);
            return;
        }

        let cancelled = false;
        setLoading(true);

        void (async () => {
            try {
                const result = await fetchDashboardOverviewData(accessToken, {
                    getTodayOrderTotal: (token) => api.orders.getTodayOrderTotal(token),
                    getRiskDashboard: (token) => api.risk.dashboard.get(token),
                    listBalances: (token) => moneyProductApi.listBalances(token),
                    getActivity: (token) =>
                        moneyProductApi
                            .getActivity({ page: 0, size: 120 }, token)
                            .then((res) => normalizePagedResponse(res).items),
                    getMerchantDetail: (token) => api.merchants.getDetail(token),
                });
                if (cancelled) return;
                setTodayStats(result.todayStats);
                setRiskMetrics(
                    result.riskMetrics as Awaited<ReturnType<typeof api.risk.dashboard.get>> | null,
                );
                setAssetBalances(result.assetBalances);
                setMoneyActivities(result.moneyActivities);
                setFundsLoaded(result.fundsLoaded);
                setMerchantDetail(result.merchantDetail);
            } catch (err) {
                if (cancelled) return;
                console.error(err);
                if (err instanceof ApiError && err.status === 401 && err.code !== "MISSING_ACCESS_TOKEN") {
                    signIn();
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [accessToken, organizationCode, merchantCode]);

    const totalCount = todayStats.reduce((sum, stat) => sum + stat.totalCount, 0);
    const revenueByCurrency = todayStats.filter((s) => s.currency);
    const fundsSummary = presentDashboardAvailableFunds(assetBalances, MAX_VISIBLE_ASSETS);
    const showFundsSummary = fundsLoaded;
    const balanceHref = `/${locale}/dashboard/money/balance`;
    const ordersHref = `/${locale}/dashboard/orders`;
    const activityHref = `/${locale}/dashboard/money/activity`;
    const riskHref = `/${locale}/dashboard/fraud`;

    const overview = useMemo(
        () =>
            shapeDashboardOverview({
                todayOrderTotal: todayStats,
                riskMetrics,
                openTasksCount: taskSummary.openTasks,
                trend: {
                    assetCodes: assetBalances.map((row) => row.assetCode),
                    moneyActivities,
                },
            }),
        [todayStats, riskMetrics, taskSummary.openTasks, assetBalances, moneyActivities],
    );

    const trendWindow = trendPeriod === "7d" ? 7 : 30;
    const trendSeries = useMemo(() => {
        const now = new Date();
        const base = Array.from({ length: trendWindow }, (_, index) => {
            const day = new Date(now);
            day.setDate(now.getDate() - (trendWindow - 1 - index));
            return {
                dayKey: day.toISOString().slice(0, 10),
                label: `${day.getMonth() + 1}/${day.getDate()}`,
                total: 0,
            };
        });
        const indexMap = new Map(base.map((item, idx) => [item.dayKey, idx]));
        for (const item of moneyActivities) {
            const movementType = (item.movementType ?? "").toLowerCase();
            if (!(movementType === "in" || movementType === "money_in" || movementType === "money-in")) {
                continue;
            }
            const dayKey = item.occurredAt.slice(0, 10);
            const targetIndex = indexMap.get(dayKey);
            if (targetIndex == null) continue;
            const amount = typeof item.amount === "number" ? item.amount : Number.parseFloat(item.amount);
            if (Number.isFinite(amount)) {
                base[targetIndex].total += amount;
            }
        }
        return base;
    }, [moneyActivities, trendWindow]);
    const maxTrendTotal = Math.max(1, ...trendSeries.map((entry) => entry.total));
    const trendSummary = trendPeriod === "7d" ? overview.trend.sevenDay : overview.trend.thirtyDay;
    const riskHealthy = overview.risk.priority === "LOW";

    return (
        <DashboardPage
            title={t("title")}
            subtitle={t("subtitle")}
            contentMode="table"
        >
            {loading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
                <>
                    {isTrialMerchant(merchantDetail) ? (
                        <Alert
                            type="info"
                            showIcon
                            message={t("trial_upgrade_banner")}
                            action={
                                <Link href={`/${locale}/dashboard/onboarding/status`}>
                                    <Button size="small" type="primary">
                                        {t("trial_upgrade_action")}
                                    </Button>
                                </Link>
                            }
                            style={{ marginBottom: 16 }}
                        />
                    ) : null}

                    <CommerceActivationHost />

                    <Row gutter={[16, 16]} className={styles.kpiRow}>
                        <Col xs={24} md={12} xl={6}>
                            {showFundsSummary ? (
                                <div className={styles.panel}>
                                    <div className={styles.panelHeader}>
                                        <span className={styles.panelLabel}>{t("stats.available_funds")}</span>
                                        <Link href={balanceHref} className={styles.panelLink}>
                                            {t("stats.view_balance")}
                                        </Link>
                                    </div>

                                    <div className={styles.panelBody}>
                                    {fundsSummary.totalCount === 0 ? (
                                        <div className={styles.emptyValue}>{t("stats.no_available_funds")}</div>
                                    ) : fundsSummary.totalCount === 1 ? (
                                        <DashboardCurrencyRow
                                            assetCode={fundsSummary.visible[0].assetCode}
                                            amount={fundsSummary.visible[0].available}
                                            locale={locale}
                                        />
                                    ) : (
                                        <ul className={styles.assetList}>
                                            {fundsSummary.visible.map((asset) => (
                                                <li key={asset.assetCode}>
                                                    <DashboardCurrencyRow
                                                        assetCode={asset.assetCode}
                                                        amount={asset.available}
                                                        locale={locale}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    </div>

                                    <div className={styles.panelFoot}>
                                        <span className={styles.panelMeta}>
                                            {fundsSummary.hiddenCount > 0
                                                ? t("stats.other_assets", { count: fundsSummary.hiddenCount })
                                                : t("stats.asset_count", { count: fundsSummary.totalCount })}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.panel}>
                                    <span className={styles.panelLabel}>{t("stats.settlement_cycle_label")}</span>
                                    <span className={styles.panelValueCompact}>
                                        {t("stats.settlement_cycle_title")}
                                    </span>
                                    <span className={styles.panelHint}>{t("stats.settlement_cycle_desc")}</span>
                                </div>
                            )}
                        </Col>
                        <Col xs={24} md={12} xl={6}>
                            <div className={styles.panel}>
                                <div className={styles.panelHeader}>
                                    <span className={styles.panelLabel}>
                                        {t("stats.today_funds_revenue")}
                                    </span>
                                    <Link href={activityHref} className={styles.panelLink}>
                                        {t("stats.view_activity")}
                                    </Link>
                                </div>
                                <div className={styles.panelBody}>
                                    {revenueByCurrency.length === 0 ? (
                                        <span className={styles.emptyValue}>—</span>
                                    ) : (
                                        <div className={styles.revenueList}>
                                            {revenueByCurrency.map((stat) => (
                                                <DashboardCurrencyRow
                                                    key={stat.currency}
                                                    assetCode={stat.currency}
                                                    amount={stat.totalAmount.toFixed(2)}
                                                    locale={locale}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} md={12} xl={6}>
                            <div className={styles.panel}>
                                <div className={styles.panelHeader}>
                                    <span className={styles.panelLabel}>{t("stats.orders")}</span>
                                    <Link href={ordersHref} className={styles.panelLink}>
                                        {t("stats.view_orders")}
                                    </Link>
                                </div>
                                <span className={`${styles.panelValue} financial-amount`}>
                                    {totalCount}
                                </span>
                            </div>
                        </Col>
                        <Col xs={24} md={12} xl={6}>
                            <div className={styles.panel}>
                                <div className={styles.panelHeader}>
                                    <span className={styles.panelLabel}>{t("stats.risk_pending")}</span>
                                    <Link href={riskHref} className={styles.panelLink}>
                                        {t("stats.view_risk")}
                                    </Link>
                                </div>
                                <span className={`${styles.panelValue} financial-amount`}>
                                    {taskSummary.openTasks}
                                </span>
                                <span className={styles.panelMeta}>
                                    {riskHealthy ? t("stats.risk_healthy") : t("stats.risk_attention")}
                                </span>
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} className={styles.analyticsRow}>
                        <Col xs={24} lg={16}>
                            <div className={styles.panel}>
                                <div className={styles.panelHeader}>
                                    <div>
                                        <span className={styles.panelLabel}>{t("trend.title")}</span>
                                        <div className={styles.panelHint}>
                                            {t("trend.subtitle")}
                                        </div>
                                    </div>
                                    <div className={styles.segmentActions}>
                                        <Button
                                            size="small"
                                            type={trendPeriod === "7d" ? "primary" : "default"}
                                            onClick={() => setTrendPeriod("7d")}
                                        >
                                            {t("trend.last_7_days")}
                                        </Button>
                                        <Button
                                            size="small"
                                            type={trendPeriod === "30d" ? "primary" : "default"}
                                            onClick={() => setTrendPeriod("30d")}
                                        >
                                            {t("trend.last_30_days")}
                                        </Button>
                                    </div>
                                </div>
                                <div className={styles.trendChart}>
                                    {trendSeries.map((entry) => (
                                        <div key={entry.dayKey} className={styles.trendBarItem}>
                                            <div className={styles.trendBarTrack}>
                                                <div
                                                    className={styles.trendBar}
                                                    style={{
                                                        height: `${Math.max(4, (entry.total / maxTrendTotal) * 100)}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className={styles.trendLabel}>{entry.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.trendSummary}>
                                    <span className={styles.trendValue}>
                                        {trendSummary.currentTotal.toFixed(2)}
                                    </span>
                                    <span className={styles.trendMeta}>
                                        {t("trend.vs_previous")}: {trendSummary.percentChange}
                                    </span>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} lg={8}>
                            <div className={styles.panel}>
                                <div className={styles.panelHeader}>
                                    <span className={styles.panelLabel}>{t("risk_health.title")}</span>
                                    <Tag color={riskHealthy ? "green" : "orange"}>
                                        {riskHealthy ? t("stats.risk_healthy") : t("stats.risk_attention")}
                                    </Tag>
                                </div>
                                <div className={styles.healthGrid}>
                                    <div>
                                        <span className={styles.panelMeta}>{t("risk_health.pending_reviews")}</span>
                                        <span className={styles.healthValue}>{riskMetrics?.pendingReviews ?? 0}</span>
                                    </div>
                                    <div>
                                        <span className={styles.panelMeta}>{t("risk_health.open_disputes")}</span>
                                        <span className={styles.healthValue}>{riskMetrics?.openDisputes ?? 0}</span>
                                    </div>
                                    <div>
                                        <span className={styles.panelMeta}>{t("risk_health.chargeback_rate")}</span>
                                        <span className={styles.healthValue}>
                                            {riskMetrics?.chargebackRatio != null
                                                ? `${(riskMetrics.chargebackRatio * 100).toFixed(2)}%`
                                                : "—"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className={styles.panelMeta}>{t("risk_health.review_sla_hours")}</span>
                                        <span className={styles.healthValue}>
                                            {riskMetrics?.reviewSlaHours != null
                                                ? riskMetrics.reviewSlaHours.toFixed(1)
                                                : "—"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={24}>
                            <ActionCenterWidget />
                        </Col>
                    </Row>
                </>
            )}
        </DashboardPage>
    );
}
