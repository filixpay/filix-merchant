import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type {
    CreateOrganizationTeamRequest,
    OrganizationTeamMemberView,
    OrganizationTeamView,
    TeamRole,
} from "./types";

export async function listOrganizationTeams(
    token: string,
    organizationCode: number | string,
): Promise<OrganizationTeamView[]> {
    return request<OrganizationTeamView[]>(ENDPOINTS.PORTAL.organizationTeams(organizationCode), {
        headers: authHeaders(token),
    });
}

export async function createOrganizationTeam(
    token: string,
    organizationCode: number | string,
    body: CreateOrganizationTeamRequest,
): Promise<OrganizationTeamView> {
    return request<OrganizationTeamView>(ENDPOINTS.PORTAL.organizationTeams(organizationCode), {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(body),
    });
}

export async function updateOrganizationTeam(
    token: string,
    organizationCode: number | string,
    teamId: string,
    body: { name?: string; description?: string },
): Promise<OrganizationTeamView> {
    return request<OrganizationTeamView>(
        ENDPOINTS.PORTAL.organizationTeam(organizationCode, teamId),
        {
            method: "PATCH",
            headers: authHeaders(token),
            body: JSON.stringify(body),
        },
    );
}

export async function archiveOrganizationTeam(
    token: string,
    organizationCode: number | string,
    teamId: string,
): Promise<void> {
    await request<unknown>(ENDPOINTS.PORTAL.organizationTeamArchive(organizationCode, teamId), {
        method: "POST",
        headers: authHeaders(token),
    });
}

export async function listOrganizationTeamMembers(
    token: string,
    organizationCode: number | string,
    teamId: string,
): Promise<OrganizationTeamMemberView[]> {
    return request<OrganizationTeamMemberView[]>(
        ENDPOINTS.PORTAL.organizationTeamMembers(organizationCode, teamId),
        { headers: authHeaders(token) },
    );
}

export async function addOrganizationTeamMember(
    token: string,
    organizationCode: number | string,
    teamId: string,
    membershipId: string,
    teamRole: TeamRole,
): Promise<OrganizationTeamMemberView> {
    return request<OrganizationTeamMemberView>(
        ENDPOINTS.PORTAL.organizationTeamMembers(organizationCode, teamId),
        {
            method: "POST",
            headers: authHeaders(token),
            body: JSON.stringify({ membershipId, teamRole }),
        },
    );
}

export async function removeOrganizationTeamMember(
    token: string,
    organizationCode: number | string,
    teamId: string,
    membershipId: string,
): Promise<void> {
    await request<unknown>(
        ENDPOINTS.PORTAL.organizationTeamMember(organizationCode, teamId, membershipId),
        {
            method: "DELETE",
            headers: authHeaders(token),
        },
    );
}
