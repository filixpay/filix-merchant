import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { OrganizationSummaryView } from "./types";

export async function listOrganizations(token: string): Promise<OrganizationSummaryView[]> {
    return request<OrganizationSummaryView[]>(ENDPOINTS.PORTAL.MY_ORGANIZATIONS, {
        headers: authHeaders(token),
    });
}
