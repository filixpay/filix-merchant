import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { OrganizationRoleSummary } from "./types";

export async function listOrganizationRoles(
    token: string,
    organizationCode: number | string,
): Promise<OrganizationRoleSummary[]> {
    return request<OrganizationRoleSummary[]>(
        ENDPOINTS.PORTAL.organizationRoles(organizationCode),
        { headers: authHeaders(token) },
    );
}
