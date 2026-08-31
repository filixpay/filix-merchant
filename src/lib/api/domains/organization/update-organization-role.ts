import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { OrganizationRoleResponse, UpdateOrganizationRoleRequest } from "./types";

export async function updateOrganizationRole(
    token: string,
    organizationCode: number | string,
    roleId: string,
    body: UpdateOrganizationRoleRequest,
): Promise<OrganizationRoleResponse> {
    return request<OrganizationRoleResponse>(
        ENDPOINTS.PORTAL.organizationRole(organizationCode, roleId),
        {
            method: "PUT",
            headers: authHeaders(token),
            body: JSON.stringify(body),
        },
    );
}
