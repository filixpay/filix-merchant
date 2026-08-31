import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { MerchantCloseRequest } from "./types";

export async function cancelCloseRequest(token: string, id: number): Promise<MerchantCloseRequest> {
    return request<MerchantCloseRequest>(`${ENDPOINTS.PORTAL.MERCHANT_CLOSE_REQUESTS}/${id}/cancel`, {
        method: "POST",
        headers: authHeaders(token),
    });
}
