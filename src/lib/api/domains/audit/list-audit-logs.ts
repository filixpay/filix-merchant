import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { AuditLogListQuery, AuditLogPage } from "./types";

export function toAuditQuery(params: AuditLogListQuery): string {
    const q = new URLSearchParams();
    if (params.from) q.set("from", params.from);
    if (params.to) q.set("to", params.to);
    if (params.actionCategory) q.set("actionCategory", params.actionCategory);
    if (params.action) q.set("action", params.action);
    if (params.result) q.set("result", params.result);
    if (params.page != null) q.set("page", String(params.page));
    if (params.size != null) q.set("size", String(params.size));
    return q.toString();
}

export async function listAuditLogs(
    token: string,
    query: AuditLogListQuery = {},
): Promise<AuditLogPage> {
    const qs = toAuditQuery(query);
    return request<AuditLogPage>(
        `${ENDPOINTS.PORTAL.AUDIT_LOGS}${qs ? `?${qs}` : ""}`,
        { headers: authHeaders(token) },
    );
}
