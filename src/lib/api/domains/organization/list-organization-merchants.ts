import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { OrganizationMerchantView } from "./types";

/** List business accounts owned by the Organization from `X-Organization-Code`. */
export async function listOrganizationMerchants(
    token: string,
): Promise<OrganizationMerchantView[]> {
    return request<OrganizationMerchantView[]>(ENDPOINTS.PORTAL.ORGANIZATION_CURRENT_MERCHANTS, {
        headers: authHeaders(token),
    });
}
