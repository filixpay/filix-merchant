import { API_BASE_URL, ENDPOINTS } from "@/lib/api-config";
import { ApiError, authHeaders } from "../../core";
import { enterpriseRequest } from "../../enterprise-core";
import {
    buildEnterpriseHeaders,
    resolveClientEnterpriseCode,
} from "../../enterprise-headers";
import type {
    AddEnterpriseMemberRequest,
    AssignEnterpriseMemberKindRequest,
    CreateEnterpriseOrganizationRequest,
    DiscoverableEnterpriseView,
    EnterpriseAuditListQuery,
    EnterpriseAuditLogPage,
    EnterpriseDashboardView,
    EnterpriseMemberView,
    EnterpriseOrganizationDirectoryEntry,
    EnterpriseOrganizationLifecycleRequest,
    EnterpriseSwitchHandoff,
} from "./types";

export type {
    AddEnterpriseMemberRequest,
    AssignEnterpriseMemberKindRequest,
    CreateEnterpriseOrganizationRequest,
    DiscoverableEnterpriseView,
    EnterpriseAuditListQuery,
    EnterpriseAuditLogItem,
    EnterpriseAuditLogPage,
    EnterpriseDailyCount,
    EnterpriseDashboardView,
    EnterpriseMemberView,
    EnterpriseMembershipKind,
    EnterpriseMembershipStatus,
    EnterpriseOrganizationDirectoryEntry,
    EnterpriseOrganizationLifecycleRequest,
    EnterpriseSwitchHandoff,
    EnterpriseTopOrganizationRow,
    OrganizationStatus,
} from "./types";

function toEnterpriseAuditQuery(params: EnterpriseAuditListQuery): string {
    const q = new URLSearchParams();
    if (params.organizationCode != null && String(params.organizationCode).trim()) {
        q.set("organizationCode", String(params.organizationCode).trim());
    }
    if (params.action?.trim()) q.set("action", params.action.trim());
    if (params.from) q.set("from", params.from);
    if (params.to) q.set("to", params.to);
    if (params.page != null) q.set("page", String(params.page));
    if (params.size != null) q.set("size", String(params.size));
    return q.toString();
}

export const enterpriseApi = {
    listDiscoverable(token: string): Promise<DiscoverableEnterpriseView[]> {
        return enterpriseRequest<DiscoverableEnterpriseView[]>(
            ENDPOINTS.ENTERPRISE.MY_ENTERPRISES,
            {
                headers: authHeaders(token),
                includeEnterpriseCode: false,
            },
        );
    },

    dashboard(token: string, enterpriseCode?: string | null): Promise<EnterpriseDashboardView> {
        return enterpriseRequest<EnterpriseDashboardView>(ENDPOINTS.ENTERPRISE.DASHBOARD, {
            headers: authHeaders(token),
            enterpriseCode,
        });
    },

    async exportDashboardCsv(token: string, enterpriseCode?: string | null): Promise<Blob> {
        const resolved = resolveClientEnterpriseCode(enterpriseCode);
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ENTERPRISE.DASHBOARD_EXPORT}`, {
            headers: buildEnterpriseHeaders({
                token,
                enterpriseCode: resolved,
                contentType: false,
            }),
        });
        if (!response.ok) {
            let message = `Request failed with status ${response.status}`;
            let code: string | number | undefined = response.status;
            try {
                const data = (await response.json()) as {
                    message?: string;
                    code?: string | number;
                };
                if (data.message) message = data.message;
                if (data.code != null) code = data.code;
            } catch {
                // CSV error bodies may be empty / non-JSON
            }
            throw new ApiError(message, response.status, code);
        }
        return response.blob();
    },

    listAudit(
        token: string,
        query: EnterpriseAuditListQuery = {},
        enterpriseCode?: string | null,
    ): Promise<EnterpriseAuditLogPage> {
        const qs = toEnterpriseAuditQuery(query);
        return enterpriseRequest<EnterpriseAuditLogPage>(
            `${ENDPOINTS.ENTERPRISE.AUDIT}${qs ? `?${qs}` : ""}`,
            {
                headers: authHeaders(token),
                enterpriseCode,
            },
        );
    },

    listOrganizations(
        token: string,
        enterpriseCode?: string | null,
    ): Promise<EnterpriseOrganizationDirectoryEntry[]> {
        return enterpriseRequest<EnterpriseOrganizationDirectoryEntry[]>(
            ENDPOINTS.ENTERPRISE.ORGANIZATIONS,
            {
                headers: authHeaders(token),
                enterpriseCode,
            },
        );
    },

    createOrganization(
        token: string,
        body: CreateEnterpriseOrganizationRequest,
        enterpriseCode?: string | null,
    ): Promise<EnterpriseOrganizationDirectoryEntry> {
        return enterpriseRequest<EnterpriseOrganizationDirectoryEntry>(
            ENDPOINTS.ENTERPRISE.ORGANIZATIONS,
            {
                method: "POST",
                headers: authHeaders(token),
                enterpriseCode,
                body: JSON.stringify(body),
            },
        );
    },

    suspendOrganization(
        token: string,
        organizationCode: number | string,
        body: EnterpriseOrganizationLifecycleRequest,
        enterpriseCode?: string | null,
    ): Promise<void> {
        return enterpriseRequest<void>(
            ENDPOINTS.ENTERPRISE.organizationSuspend(organizationCode),
            {
                method: "POST",
                headers: authHeaders(token),
                enterpriseCode,
                body: JSON.stringify(body),
            },
        );
    },

    activateOrganization(
        token: string,
        organizationCode: number | string,
        body: EnterpriseOrganizationLifecycleRequest,
        enterpriseCode?: string | null,
    ): Promise<void> {
        return enterpriseRequest<void>(
            ENDPOINTS.ENTERPRISE.organizationActivate(organizationCode),
            {
                method: "POST",
                headers: authHeaders(token),
                enterpriseCode,
                body: JSON.stringify(body),
            },
        );
    },

    listMembers(token: string, enterpriseCode?: string | null): Promise<EnterpriseMemberView[]> {
        return enterpriseRequest<EnterpriseMemberView[]>(ENDPOINTS.ENTERPRISE.MEMBERS, {
            headers: authHeaders(token),
            enterpriseCode,
        });
    },

    addMember(
        token: string,
        body: AddEnterpriseMemberRequest,
        enterpriseCode?: string | null,
    ): Promise<EnterpriseMemberView> {
        return enterpriseRequest<EnterpriseMemberView>(ENDPOINTS.ENTERPRISE.MEMBERS, {
            method: "POST",
            headers: authHeaders(token),
            enterpriseCode,
            body: JSON.stringify(body),
        });
    },

    assignKind(
        token: string,
        identityId: string,
        body: AssignEnterpriseMemberKindRequest,
        enterpriseCode?: string | null,
    ): Promise<void> {
        return enterpriseRequest<void>(ENDPOINTS.ENTERPRISE.memberKind(identityId), {
            method: "PUT",
            headers: authHeaders(token),
            enterpriseCode,
            body: JSON.stringify(body),
        });
    },

    suspendMember(
        token: string,
        identityId: string,
        enterpriseCode?: string | null,
    ): Promise<void> {
        return enterpriseRequest<void>(ENDPOINTS.ENTERPRISE.memberSuspend(identityId), {
            method: "POST",
            headers: authHeaders(token),
            enterpriseCode,
        });
    },

    removeMember(
        token: string,
        identityId: string,
        enterpriseCode?: string | null,
    ): Promise<void> {
        return enterpriseRequest<void>(ENDPOINTS.ENTERPRISE.memberRemove(identityId), {
            method: "POST",
            headers: authHeaders(token),
            enterpriseCode,
        });
    },

    switchOrganization(
        token: string,
        organizationCode: number | string,
        enterpriseCode?: string | null,
    ): Promise<EnterpriseSwitchHandoff> {
        return enterpriseRequest<EnterpriseSwitchHandoff>(
            ENDPOINTS.ENTERPRISE.switchOrganization(organizationCode),
            {
                method: "POST",
                headers: authHeaders(token),
                enterpriseCode,
            },
        );
    },
};
