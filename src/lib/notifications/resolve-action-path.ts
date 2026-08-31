import { resolveRiskActionPath } from "@/lib/risk/resolve-risk-action-path";

export function resolveActionPath(locale: string, actionPath?: string): string {
    if (!actionPath) {
        return `/${locale}/dashboard/notifications?tab=tasks`;
    }
    return resolveRiskActionPath(actionPath, locale) ?? `/${locale}/dashboard/notifications?tab=tasks`;
}
