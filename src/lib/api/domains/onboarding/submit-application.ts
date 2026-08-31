import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { MerchantApplication } from "./types";

export async function submitApplication(token: string, id: string): Promise<MerchantApplication> {
    return request<MerchantApplication>(`${ENDPOINTS.PORTAL.MERCHANT_APPLICATIONS}/${id}/submit`, {
        method: "POST",
        headers: authHeaders(token),
    });
}
