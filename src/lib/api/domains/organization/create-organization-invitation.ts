import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type {
    CreateOrganizationInvitationRequest,
    OrganizationInvitationView,
} from "./types";

export async function createOrganizationInvitation(
    token: string,
    organizationCode: number | string,
    body: CreateOrganizationInvitationRequest,
): Promise<OrganizationInvitationView> {
    return request<OrganizationInvitationView>(
        ENDPOINTS.PORTAL.organizationInvitations(organizationCode),
        {
            method: "POST",
            headers: authHeaders(token),
            body: JSON.stringify(body),
        },
    );
}
