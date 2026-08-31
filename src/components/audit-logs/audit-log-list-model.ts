import type { AuditLogListQuery, AuditResult } from "@/lib/api";
import { toApiDateTime } from "@/components/orders/order-list-model";

export const P0_AUDIT_ACTIONS = [
    "auth.login",
    "auth.logout",
    "auth.password.change",
    "auth.mfa.enable",
    "auth.mfa.disable",
    "auth.access.denied",
    "apikey.create",
    "apikey.rotate",
    "apikey.delete",
    "webhook.create",
    "webhook.update",
    "webhook.delete",
    "webhook.replay",
    "merchant.config.update",
    "coverage.enable",
    "coverage.disable",
    "coverage.update",
    "risk.review.approve",
    "risk.review.reject",
    "risk.review.assign",
    "role.grant",
    "role.revoke",
    "permission.update",
    "operator.create",
    "operator.update",
    "operator.disable",
] as const;

export type P0AuditAction = (typeof P0_AUDIT_ACTIONS)[number];

export const AUDIT_RESULT_OPTIONS: AuditResult[] = ["SUCCESS", "FAILURE", "DENIED"];

export interface AuditLogSearchFormValues {
    dateRange?: [unknown, unknown];
    action?: string;
    result?: AuditResult;
}

export const DEFAULT_AUDIT_LOG_LIST_QUERY: AuditLogListQuery = {
    page: 0,
    size: 20,
};

export function buildAuditLogListQuery(
    values: AuditLogSearchFormValues,
    pagination: Pick<AuditLogListQuery, "page" | "size">,
): AuditLogListQuery {
    const [fromRaw, toRaw] = values.dateRange ?? [];
    return {
        ...pagination,
        from: toApiDateTime(fromRaw),
        to: toApiDateTime(toRaw),
        action: values.action || undefined,
        result: values.result || undefined,
    };
}
