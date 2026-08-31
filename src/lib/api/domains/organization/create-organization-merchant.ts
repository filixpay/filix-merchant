import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type {
    CreateOrganizationMerchantRequest,
    OrganizationMerchantView,
} from "./types";

export async function createOrganizationMerchant(
    token: string,
    body: CreateOrganizationMerchantRequest,
): Promise<OrganizationMerchantView> {
    return request<OrganizationMerchantView>(ENDPOINTS.PORTAL.ORGANIZATION_CURRENT_MERCHANTS, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(body),
    });
}
