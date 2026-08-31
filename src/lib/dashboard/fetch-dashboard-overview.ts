import type {
    MerchantDetailView,
    MoneyActivityItem,
    MoneyAssetBalance,
    TodayOrderTotal,
} from "@/lib/api";

export type DashboardOverviewFetchApi = {
    getTodayOrderTotal: (accessToken: string) => Promise<TodayOrderTotal[]>;
    getRiskDashboard: (accessToken: string) => Promise<unknown>;
    listBalances: (accessToken: string) => Promise<MoneyAssetBalance[]>;
    getActivity: (accessToken: string) => Promise<MoneyActivityItem[]>;
    getMerchantDetail: (accessToken: string) => Promise<MerchantDetailView>;
};

export type DashboardOverviewFetchResult = {
    todayStats: TodayOrderTotal[];
    riskMetrics: unknown | null;
    assetBalances: MoneyAssetBalance[];
    moneyActivities: MoneyActivityItem[];
    fundsLoaded: boolean;
    merchantDetail: MerchantDetailView | null;
};

/** Portal overview APIs require org + merchant context in headers — wait before first fetch. */
export function canFetchDashboardOverview(
    accessToken: string | undefined | null,
    organizationCode: string | null | undefined,
    merchantCode: string | null | undefined,
): boolean {
    return Boolean(
        accessToken?.trim() && organizationCode?.trim() && merchantCode?.trim(),
    );
}

export async function fetchDashboardOverviewData(
    accessToken: string,
    api: DashboardOverviewFetchApi,
): Promise<DashboardOverviewFetchResult> {
    const [todayStatsRes, riskDashboardRes, balancesResult, activityResult, merchantDetail] =
        await Promise.all([
            api.getTodayOrderTotal(accessToken).catch(() => [] as TodayOrderTotal[]),
            api.getRiskDashboard(accessToken).catch(() => null),
            api.listBalances(accessToken).then(
                (balances) => ({ ok: true as const, balances }),
                () => ({ ok: false as const, balances: [] as MoneyAssetBalance[] }),
            ),
            api.getActivity(accessToken).catch(() => [] as MoneyActivityItem[]),
            api.getMerchantDetail(accessToken).catch(() => null),
        ]);

    return {
        todayStats: todayStatsRes || [],
        riskMetrics: riskDashboardRes,
        assetBalances: balancesResult.balances,
        moneyActivities: activityResult,
        fundsLoaded: balancesResult.ok,
        merchantDetail,
    };
}
