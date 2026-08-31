import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { MerchantApplication } from "./types";

export async function getApplication(token: string, id: string): Promise<MerchantApplication> {
    return request<MerchantApplication>(`${ENDPOINTS.PORTAL.MERCHANT_APPLICATIONS}/${id}`, {
        headers: authHeaders(token),
    });
}
