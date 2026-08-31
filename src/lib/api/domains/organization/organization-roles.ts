import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type {
    CreateOrganizationRoleRequest,
    OrganizationRoleSummary,
    UpdateOrganizationRoleRequest,
} from "./types";

export async function createOrganizationRole(
    token: string,
    organizationCode: number | string,
    body: CreateOrganizationRoleRequest,
): Promise<OrganizationRoleSummary> {
    return request<OrganizationRoleSummary>(ENDPOINTS.PORTAL.organizationRoles(organizationCode), {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(body),
    });
}

export async function updateOrganizationRole(
    token: string,
    organizationCode: number | string,
    roleId: string,
    body: UpdateOrganizationRoleRequest,
): Promise<OrganizationRoleSummary> {
    return request<OrganizationRoleSummary>(
        ENDPOINTS.PORTAL.organizationRole(organizationCode, roleId),
        {
            method: "PUT",
            headers: authHeaders(token),
            body: JSON.stringify(body),
        },
    );
}

export async function deleteOrganizationRole(
    token: string,
    organizationCode: number | string,
    roleId: string,
): Promise<void> {
    await request<unknown>(ENDPOINTS.PORTAL.organizationRole(organizationCode, roleId), {
        method: "DELETE",
        headers: authHeaders(token),
    });
}
