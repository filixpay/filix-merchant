import { ENDPOINTS } from "@/lib/api-config";
import { ApiError, authHeaders, request } from "../../core";
import type { MerchantApplication } from "./types";

export async function getCurrentApplication(
    token: string,
): Promise<MerchantApplication | null> {
    try {
        return await request<MerchantApplication>(
            `${ENDPOINTS.PORTAL.MERCHANT_APPLICATIONS}/current`,
            {
                headers: authHeaders(token),
            },
        );
    } catch (err) {
        if (err instanceof ApiError && (err.status === 404 || err.code === "APPLICATION_NOT_FOUND")) {
            return null;
        }
        throw err;
    }
}
