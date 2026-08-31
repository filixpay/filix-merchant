import type { DashboardContentMode } from "./dashboard-content-mode";

export const DASHBOARD_ROUTE_MODE_FALLBACKS: Array<{
    mode: DashboardContentMode;
    prefixes: string[];
}> = [
    {
        mode: "table",
        prefixes: [
            "/dashboard/orders",
            "/dashboard/refunds",
            "/dashboard/payment-splits",
            "/dashboard/deposits",
            "/dashboard/payouts",
            "/dashboard/payout-records",
            "/dashboard/transfer-records",
            "/dashboard/transfers",
            "/dashboard/reviews",
            "/dashboard/payouts/audit",
            "/dashboard/payouts/review",
            "/dashboard/customers",
            "/dashboard/sub-merchants",
            "/dashboard/locations",
            "/dashboard/bank-accounts",
            "/dashboard/credit/limit",
            "/dashboard/credit/adjustment-records",
            "/dashboard/credit/transactions",
            "/dashboard/member-credit/available-credit",
            "/dashboard/member-credit/adjustment-history",
            "/dashboard/member-credit/payment-history",
            "/dashboard/configs",
            "/dashboard/checkouts",
            "/dashboard/money/crypto",
            "/dashboard/service-plan",
            "/dashboard/money/settlements",
            "/dashboard/money/settlements/statements",
            "/dashboard/disputes",
            "/dashboard/risk-reviews",
            "/dashboard/risk-rules",
            "/dashboard/fraud",
            "/dashboard/audit-logs",
            "/dashboard",
        ].sort((first, second) => second.length - first.length),
    },
];
