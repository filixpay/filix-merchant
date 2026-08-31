import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { ChangeProfileRequest, MerchantChangeRequest } from "./types";

export async function updateChangeProfile(
    token: string,
    id: string,
    body: ChangeProfileRequest,
): Promise<MerchantChangeRequest> {
    return request<MerchantChangeRequest>(`${ENDPOINTS.PORTAL.MERCHANT_CHANGE_REQUESTS}/${id}/profile`, {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(body),
    });
}
