import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { UpdateMerchantContactRequest } from "./types";

export async function updateMerchantContact(
    token: string,
    body: UpdateMerchantContactRequest,
): Promise<void> {
    return request<void>(ENDPOINTS.PORTAL.MERCHANT_CONTACT, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify(body),
    });
}
