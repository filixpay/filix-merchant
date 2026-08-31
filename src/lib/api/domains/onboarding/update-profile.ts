import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { ApplicationProfileRequest, MerchantApplication } from "./types";

export async function updateApplicationProfile(
    token: string,
    id: string,
    body: ApplicationProfileRequest,
): Promise<MerchantApplication> {
    return request<MerchantApplication>(`${ENDPOINTS.PORTAL.MERCHANT_APPLICATIONS}/${id}/profile`, {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(body),
    });
}
