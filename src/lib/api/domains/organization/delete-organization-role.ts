import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";

export async function deleteOrganizationRole(
    token: string,
    organizationCode: number | string,
    roleId: string,
): Promise<void> {
    await request<string>(ENDPOINTS.PORTAL.organizationRole(organizationCode, roleId), {
        method: "DELETE",
        headers: authHeaders(token),
    });
}
