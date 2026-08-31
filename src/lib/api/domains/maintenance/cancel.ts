import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { MerchantChangeRequest } from "./types";

export async function cancelChangeRequest(token: string, id: string): Promise<MerchantChangeRequest> {
    return request<MerchantChangeRequest>(`${ENDPOINTS.PORTAL.MERCHANT_CHANGE_REQUESTS}/${id}/cancel`, {
        method: "POST",
        headers: authHeaders(token),
    });
}
