import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { ApplicationDocument } from "./types";

export async function listApplicationDocuments(
    token: string,
    applicationId: string,
): Promise<ApplicationDocument[]> {
    return request<ApplicationDocument[]>(
        `${ENDPOINTS.PORTAL.MERCHANT_APPLICATIONS}/${applicationId}/documents`,
        {
            headers: authHeaders(token),
        },
    );
}
