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
            "/dashboard/transfers",
            "/dashboard/reviews",
            "/dashboard/customers",
            "/dashboard/sub-merchants",
            "/dashboard/locations",
            "/dashboard/credit/limit",
            "/dashboard/member-credit/available-credit",
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
