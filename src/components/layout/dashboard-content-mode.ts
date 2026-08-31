import { DASHBOARD_ROUTE_MODE_FALLBACKS } from "./dashboard-route-modes";

export type DashboardContentMode = "table" | "form" | "overview";

export function stripLocale(pathname: string) {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length > 0 && parts[0].length === 2) {
        return `/${parts.slice(1).join("/")}`;
    }
    return pathname;
}

export function getRouteDashboardContentMode(pathname: string): DashboardContentMode {
    const route = stripLocale(pathname);
    const matched = DASHBOARD_ROUTE_MODE_FALLBACKS.find(({ prefixes }) =>
        prefixes.some((prefix) =>
            prefix === "/dashboard"
                ? route === prefix
                : route === prefix || route.startsWith(`${prefix}/`),
        ),
    );
    return matched?.mode ?? "form";
}

export function resolveDashboardContentMode(
    routeMode: DashboardContentMode,
    overrideMode: DashboardContentMode | null,
): DashboardContentMode {
    return overrideMode ?? routeMode;
}
