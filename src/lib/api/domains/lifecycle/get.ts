import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { MerchantCloseRequest } from "./types";

export async function getCloseRequest(token: string, id: number): Promise<MerchantCloseRequest> {
    return request<MerchantCloseRequest>(`${ENDPOINTS.PORTAL.MERCHANT_CLOSE_REQUESTS}/${id}`, {
        headers: authHeaders(token),
    });
}
