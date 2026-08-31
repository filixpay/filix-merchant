import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { OrganizationMemberView } from "./types";

export async function listOrganizationMembers(
    token: string,
    organizationCode: number | string,
): Promise<OrganizationMemberView[]> {
    return request<OrganizationMemberView[]>(
        ENDPOINTS.PORTAL.organizationMembers(organizationCode),
        { headers: authHeaders(token) },
    );
}
