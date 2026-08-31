import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { CreateMerchantCloseRequestRequest, MerchantCloseRequest } from "./types";

export async function createCloseRequest(
    token: string,
    body: CreateMerchantCloseRequestRequest,
): Promise<MerchantCloseRequest> {
    return request<MerchantCloseRequest>(ENDPOINTS.PORTAL.MERCHANT_CLOSE_REQUESTS, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(body),
    });
}
