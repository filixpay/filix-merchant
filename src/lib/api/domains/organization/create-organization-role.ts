import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { CreateOrganizationRoleRequest, OrganizationRoleResponse } from "./types";

export async function createOrganizationRole(
    token: string,
    organizationCode: number | string,
    body: CreateOrganizationRoleRequest,
): Promise<OrganizationRoleResponse> {
    return request<OrganizationRoleResponse>(
        ENDPOINTS.PORTAL.organizationRoles(organizationCode),
        {
            method: "POST",
            headers: authHeaders(token),
            body: JSON.stringify(body),
        },
    );
}
