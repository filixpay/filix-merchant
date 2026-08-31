import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { MerchantCloseRequest } from "./types";

export async function listCloseRequests(token: string): Promise<MerchantCloseRequest[]> {
    return request<MerchantCloseRequest[]>(ENDPOINTS.PORTAL.MERCHANT_CLOSE_REQUESTS, {
        headers: authHeaders(token),
    });
}
