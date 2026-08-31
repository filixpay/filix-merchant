import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type {
    OrganizationRoleScopeResponse,
    ReplaceOrganizationRoleScopeRequest,
} from "./types";

export async function replaceOrganizationRoleScope(
    token: string,
    organizationCode: number | string,
    roleId: string,
    body: ReplaceOrganizationRoleScopeRequest,
): Promise<OrganizationRoleScopeResponse> {
    return request<OrganizationRoleScopeResponse>(
        ENDPOINTS.PORTAL.organizationRoleScopes(organizationCode, roleId),
        {
            method: "PUT",
            headers: authHeaders(token),
            body: JSON.stringify(body),
        },
    );
}
