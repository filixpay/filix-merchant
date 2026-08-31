import { API_BASE_URL, ENDPOINTS } from "@/lib/api-config";
import { ApiError, authHeaders } from "../../core";
import { buildPortalHeaders, resolveClientMerchantCode, resolveClientOrganizationCode } from "../../portal-headers";
import type { ReportExportRequest } from "./types";

export async function exportReport(token: string, body: ReportExportRequest): Promise<Blob> {
    const merchantCode = resolveClientMerchantCode();
    const organizationCode = resolveClientOrganizationCode();
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PORTAL.REPORTS_EXPORT}`, {
        method: "POST",
        headers: {
            ...buildPortalHeaders({ merchantCode, organizationCode }),
            ...authHeaders(token),
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        let message = `Request failed with status ${response.status}`;
        let code: string | number | undefined = response.status;
        try {
            const data = (await response.json()) as {
                message?: string;
                code?: string | number;
            };
            if (data.message) message = data.message;
            if (data.code != null) code = data.code;
        } catch {
            // CSV error bodies may be empty / non-JSON
        }
        throw new ApiError(message, response.status, code);
    }

    return response.blob();
}
