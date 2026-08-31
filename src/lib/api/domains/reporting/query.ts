import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { ReportQueryRequest } from "./types";

export async function queryReport<T>(token: string, body: ReportQueryRequest): Promise<T> {
    return request<T>(ENDPOINTS.PORTAL.REPORTS_QUERY, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(body),
    });
}
