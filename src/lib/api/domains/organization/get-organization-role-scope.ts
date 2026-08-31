import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { OrganizationRoleScopeResponse } from "./types";

export async function getOrganizationRoleScope(
    token: string,
    organizationCode: number | string,
    roleId: string,
): Promise<OrganizationRoleScopeResponse> {
    const path = `${ENDPOINTS.PORTAL.organizationRoleScopes(organizationCode, roleId)}?type=MERCHANT`;
    return request<OrganizationRoleScopeResponse>(path, {
        headers: authHeaders(token),
    });
}
