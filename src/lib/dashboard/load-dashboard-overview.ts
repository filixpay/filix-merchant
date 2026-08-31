import type {
    MoneyActivityItem,
    RiskDashboardMetrics,
    RiskPriority,
    TodayOrderTotal,
} from "@/lib/api";
import { RiskPriority as RiskPriorityConst } from "@/lib/api";

export type DashboardOverviewTrendPeriod = "7d" | "30d";

export type DashboardOverviewTrendBucket = {
    period: DashboardOverviewTrendPeriod;
    currentTotal: number;
    previousTotal: number;
    /** Formatted percent change from previous period; guarded to avoid NaN/Infinity. */
    percentChange: string;
};

export type DashboardRiskSummary = {
    openTasksCount: number;
    priority: RiskPriority;
};

export type DashboardOverview = {
    todayGmvByCurrency: Array<{
        currency: string;
        totalAmount: number;
    }>;
    todayOrderCount: number;
    recentActivities: MoneyActivityItem[];
    trend: {
        sevenDay: DashboardOverviewTrendBucket;
        thirtyDay: DashboardOverviewTrendBucket;
    };
    risk: {
        metrics: RiskDashboardMetrics | null;
        openTasksCount: number;
        priority: RiskPriority;
    };
};

export type DashboardOverviewInput = {
    todayOrderTotal: TodayOrderTotal[];
    riskMetrics: RiskDashboardMetrics | null;
    openTasksCount: number;
    trend: {
        /** Asset codes to consider for trend buckets (e.g. from listBalances). */
        assetCodes: string[];
        moneyActivities: MoneyActivityItem[];
        /**
         * Overrides `new Date()` for deterministic bucketing in tests.
         * Use end-exclusive ranges: [start, end).
         */
        now?: Date;
    };
};

function parseMoneyAmount(amount: string | number | null | undefined): number {
    if (typeof amount === "number") return Number.isFinite(amount) ? amount : 0;
    if (amount == null) return 0;
    const parsed = Number.parseFloat(amount);
    return Number.isFinite(parsed) ? parsed : 0;
}

function isMoneyIn(activity: MoneyActivityItem): boolean {
    const mt = (activity.movementType ?? "").toLowerCase();
    // Backend accepts both UI labels ("In") and domain codes ("MONEY_IN").
    return mt === "in" || mt === "money_in" || mt === "money-in";
}

export function formatComparisonPercentChange(
    currentTotal: number,
    previousTotal: number,
): string {
    if (!Number.isFinite(currentTotal) || !Number.isFinite(previousTotal)) return "—";
    if (previousTotal === 0) return "—";

    const pct = ((currentTotal - previousTotal) / previousTotal) * 100;
    if (!Number.isFinite(pct)) return "—";
    return `${pct.toFixed(2)}%`;
}

export function deriveMoneyActivityTrendBuckets(input: {
    assetCodes: string[];
    moneyActivities: MoneyActivityItem[];
    now?: Date;
}): DashboardOverview["trend"] {
    const now = input.now ?? new Date();
    const assetCodes = input.assetCodes;

    // If balances are empty, we intentionally treat the trend as empty even if activity is provided.
    if (assetCodes.length === 0) {
        return {
            sevenDay: {
                period: "7d",
                currentTotal: 0,
                previousTotal: 0,
                percentChange: "—",
            },
            thirtyDay: {
                period: "30d",
                currentTotal: 0,
                previousTotal: 0,
                percentChange: "—",
            },
        };
    }

    const assetCodeSet = new Set(assetCodes);
    const nowMs = now.getTime();

    const sumInRange = (startMs: number, endMs: number) => {
        let total = 0;
        for (const a of input.moneyActivities) {
            if (!assetCodeSet.has(a.assetCode)) continue;
            if (!isMoneyIn(a)) continue;

            const occurredMs = Date.parse(a.occurredAt);
            if (!Number.isFinite(occurredMs)) continue;
            if (occurredMs < startMs || occurredMs >= endMs) continue;

            total += parseMoneyAmount(a.amount);
        }
        return total;
    };

    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    const sevenStart = nowMs - sevenDaysMs;
    const sevenPrevStart = nowMs - 2 * sevenDaysMs;

    const thirtyStart = nowMs - thirtyDaysMs;
    const thirtyPrevStart = nowMs - 2 * thirtyDaysMs;

    const sevenCurrent = sumInRange(sevenStart, nowMs);
    const sevenPrev = sumInRange(sevenPrevStart, sevenStart);

    const thirtyCurrent = sumInRange(thirtyStart, nowMs);
    const thirtyPrev = sumInRange(thirtyPrevStart, thirtyStart);

    return {
        sevenDay: {
            period: "7d",
            currentTotal: sevenCurrent,
            previousTotal: sevenPrev,
            percentChange: formatComparisonPercentChange(sevenCurrent, sevenPrev),
        },
        thirtyDay: {
            period: "30d",
            currentTotal: thirtyCurrent,
            previousTotal: thirtyPrev,
            percentChange: formatComparisonPercentChange(thirtyCurrent, thirtyPrev),
        },
    };
}

export function deriveRecentMoneyActivities(input: {
    assetCodes: string[];
    moneyActivities: MoneyActivityItem[];
    limit?: number;
}): MoneyActivityItem[] {
    const assetCodeSet = new Set(input.assetCodes);
    const limit = Math.max(1, input.limit ?? 6);

    return input.moneyActivities
        .filter((item) => assetCodeSet.size === 0 || assetCodeSet.has(item.assetCode))
        .slice()
        .sort((left, right) => Date.parse(right.occurredAt) - Date.parse(left.occurredAt))
        .slice(0, limit);
}

export function deriveRiskPriority(input: {
    metrics: RiskDashboardMetrics | null;
    openTasksCount: number;
}): RiskPriority {
    const m = input.metrics;
    const openTasksCount = Math.max(0, input.openTasksCount ?? 0);

    const pendingReviews = m?.pendingReviews ?? 0;
    const openDisputes = m?.openDisputes ?? 0;
    const highFraudToday = m?.highFraudToday ?? 0;
    const rejectedToday = m?.rejectedToday ?? 0;
    const pendingReviewAttempts = m?.pendingReviewAttempts ?? 0;
    const blockedAmount =
        m?.blockedAmount?.supported === true ? parseMoneyAmount(m.blockedAmount.value) : 0;

    const hasAnyRiskSignals =
        pendingReviews > 0 ||
        openDisputes > 0 ||
        highFraudToday > 0 ||
        rejectedToday > 0 ||
        pendingReviewAttempts > 0 ||
        blockedAmount > 0;

    const hasAnyDisputesOrFraud = openDisputes > 0 || highFraudToday > 0 || blockedAmount > 0;

    if (!hasAnyRiskSignals && openTasksCount > 0) {
        // Open tasks without risk signals still mean operational attention is needed.
        return RiskPriorityConst.MEDIUM;
    }

    if (hasAnyDisputesOrFraud) {
        return RiskPriorityConst.CRITICAL;
    }

    if (pendingReviews > 0 || pendingReviewAttempts > 0 || rejectedToday > 0) {
        return openTasksCount > 0 ? RiskPriorityConst.HIGH : RiskPriorityConst.MEDIUM;
    }

    // All metrics are zero and tasks are zero.
    if (openTasksCount === 0 && !hasAnyRiskSignals) {
        return RiskPriorityConst.LOW;
    }

    // Fallback: if tasks exist but metrics are empty/zero, stay at MEDIUM.
    return openTasksCount > 0 ? RiskPriorityConst.MEDIUM : RiskPriorityConst.LOW;
}

export function shapeDashboardOverview(input: DashboardOverviewInput): DashboardOverview {
    const todayOrderCount = input.todayOrderTotal.reduce((sum, s) => sum + (s.totalCount ?? 0), 0);

    const gmvByCurrency = new Map<string, number>();
    for (const stat of input.todayOrderTotal) {
        const currency = stat.currency;
        if (!currency) continue;
        const next = parseMoneyAmount(stat.totalAmount);
        gmvByCurrency.set(currency, (gmvByCurrency.get(currency) ?? 0) + next);
    }

    const todayGmvByCurrency = Array.from(gmvByCurrency.entries()).map(([currency, totalAmount]) => ({
        currency,
        totalAmount,
    }));

    const trend = deriveMoneyActivityTrendBuckets({
        assetCodes: input.trend.assetCodes,
        moneyActivities: input.trend.moneyActivities,
        now: input.trend.now,
    });
    const recentActivities = deriveRecentMoneyActivities({
        assetCodes: input.trend.assetCodes,
        moneyActivities: input.trend.moneyActivities,
    });

    const priority = deriveRiskPriority({
        metrics: input.riskMetrics,
        openTasksCount: input.openTasksCount,
    });

    return {
        todayGmvByCurrency,
        todayOrderCount,
        recentActivities,
        trend,
        risk: {
            metrics: input.riskMetrics,
            openTasksCount: input.openTasksCount,
            priority,
        },
    };
}

