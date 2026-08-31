import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { OrganizationMemberView } from "./types";

export async function removeOrganizationMember(
    token: string,
    organizationCode: number | string,
    identityId: string,
): Promise<void> {
    await request<string>(
        ENDPOINTS.PORTAL.organizationMember(organizationCode, identityId),
        {
            method: "DELETE",
            headers: authHeaders(token),
        },
    );
}

export async function changeOrganizationMemberRole(
    token: string,
    organizationCode: number | string,
    identityId: string,
    roleId: string,
): Promise<void> {
    await request<string>(
        ENDPOINTS.PORTAL.organizationMemberRole(organizationCode, identityId),
        {
            method: "PUT",
            headers: authHeaders(token),
            body: JSON.stringify({ roleId }),
        },
    );
}

export async function acceptOrganizationInvitation(
    token: string,
    invitationToken: string,
): Promise<OrganizationMemberView> {
    return request<OrganizationMemberView>(
        ENDPOINTS.PORTAL.organizationInvitationAccept(invitationToken),
        {
            method: "POST",
            headers: authHeaders(token),
        },
    );
}
