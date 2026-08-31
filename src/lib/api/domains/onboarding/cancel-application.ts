import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { MerchantApplication } from "./types";

export async function cancelApplication(token: string, id: string): Promise<MerchantApplication> {
    return request<MerchantApplication>(`${ENDPOINTS.PORTAL.MERCHANT_APPLICATIONS}/${id}/cancel`, {
        method: "POST",
        headers: authHeaders(token),
    });
}
