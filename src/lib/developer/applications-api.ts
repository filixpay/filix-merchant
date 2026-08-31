import { API_BASE_URL, ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "@/lib/api/core";
import {
    buildPortalHeaders,
    resolveClientMerchantCode,
    resolveClientOrganizationCode,
} from "@/lib/api/portal-headers";

export type ApiApplicationView = {
    applicationCode: string;
    name?: string;
    description?: string;
    status?: string;
    creationSource?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type ApiCredentialView = {
    credentialId: string;
    environment: string;
    clientId: string;
    status: string;
    createdAt?: string;
    revokedAt?: string | null;
    expiresAt?: string | null;
};

export type IssuedCredentialView = {
    credentialId: string;
    clientId: string;
    clientSecret: string;
    environment: string;
};

export type CreateApplicationInput = {
    applicationCode: string;
    name: string;
    description?: string;
};

function applicationsPath(applicationCode?: string): string {
    const base = ENDPOINTS.PORTAL.DEVELOPER_APPLICATIONS;
    if (!applicationCode) return base;
    return `${base}/${encodeURIComponent(applicationCode)}`;
}

function credentialsPath(applicationCode: string, credentialId?: string): string {
    const base = `${applicationsPath(applicationCode)}/credentials`;
    if (credentialId == null) return base;
    return `${base}/${encodeURIComponent(credentialId)}`;
}

function normalizeApplication(row: ApiApplicationView & Record<string, unknown>): ApiApplicationView {
    const code =
        row.applicationCode ||
        (typeof row.application_code === "string" ? row.application_code : undefined) ||
        (typeof row.code === "string" ? row.code : undefined);
    return {
        ...row,
        applicationCode: code || "",
    };
}

function unwrapApplicationList(data: unknown): ApiApplicationView[] {
    if (Array.isArray(data)) {
        return data.map((row) => normalizeApplication(row as ApiApplicationView & Record<string, unknown>));
    }
    if (data && typeof data === "object") {
        const obj = data as { content?: unknown; data?: unknown; items?: unknown };
        const nested = obj.content ?? obj.data ?? obj.items;
        if (Array.isArray(nested)) {
            return nested.map((row) =>
                normalizeApplication(row as ApiApplicationView & Record<string, unknown>),
            );
        }
    }
    return [];
}

export async function listApplications(token: string): Promise<ApiApplicationView[]> {
    const data = await request<unknown>(applicationsPath(), {
        method: "GET",
        headers: authHeaders(token),
    });
    return unwrapApplicationList(data).filter((row) => Boolean(row.applicationCode));
}

export async function createApplication(
    token: string,
    input: CreateApplicationInput,
): Promise<ApiApplicationView> {
    return request<ApiApplicationView>(applicationsPath(), {
        method: "POST",
        headers: {
            ...authHeaders(token),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            applicationCode: input.applicationCode.trim().toLowerCase(),
            name: input.name.trim(),
            description: input.description?.trim() || undefined,
        }),
    });
}

export async function archiveApplication(
    token: string,
    applicationCode: string,
): Promise<ApiApplicationView> {
    return request<ApiApplicationView>(applicationsPath(applicationCode), {
        method: "PATCH",
        headers: {
            ...authHeaders(token),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "ARCHIVED" }),
    });
}

export async function listApplicationCredentials(
    token: string,
    applicationCode: string,
): Promise<ApiCredentialView[]> {
    const data = await request<ApiCredentialView[]>(credentialsPath(applicationCode), {
        method: "GET",
        headers: authHeaders(token),
    });
    return Array.isArray(data) ? data : [];
}

export async function createSandboxCredential(
    token: string,
    applicationCode: string,
): Promise<IssuedCredentialView> {
    return request<IssuedCredentialView>(credentialsPath(applicationCode), {
        method: "POST",
        headers: {
            ...authHeaders(token),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ environment: "SANDBOX" }),
    });
}

/** LIVE create — environment hardcoded; UI disable is UX only (backend 409 is SSOT). */
export async function createLiveCredential(
    token: string,
    applicationCode: string,
): Promise<IssuedCredentialView> {
    return request<IssuedCredentialView>(credentialsPath(applicationCode), {
        method: "POST",
        headers: {
            ...authHeaders(token),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ environment: "LIVE" }),
    });
}

export async function rotateApplicationCredential(
    token: string,
    applicationCode: string,
    credentialId: string,
): Promise<IssuedCredentialView> {
    return request<IssuedCredentialView>(
        `${credentialsPath(applicationCode, credentialId)}/rotate`,
        {
            method: "POST",
            headers: authHeaders(token),
        },
    );
}

/** Backend returns 204 No Content — do not use generic request() JSON unwrap. */
export async function revokeApplicationCredential(
    token: string,
    applicationCode: string,
    credentialId: string,
): Promise<void> {
    const url = `${API_BASE_URL}${credentialsPath(applicationCode, credentialId)}/revoke`;
    const merchantCode = resolveClientMerchantCode();
    const organizationCode = resolveClientOrganizationCode();
    const response = await fetch(url, {
        method: "POST",
        headers: {
            ...buildPortalHeaders({ merchantCode, organizationCode }),
            ...authHeaders(token),
        },
    });
    if (response.status === 204 || response.status === 200) {
        return;
    }
    let message = `Revoke failed (${response.status})`;
    try {
        const body = (await response.json()) as { message?: string };
        if (body.message) message = body.message;
    } catch {
        // ignore
    }
    throw new Error(message);
}

/** @internal test helpers */
export const applicationsApiPaths = {
    list: () => applicationsPath(),
    one: (code: string) => applicationsPath(code),
    credentials: (code: string) => credentialsPath(code),
    rotate: (code: string, id: string) => `${credentialsPath(code, id)}/rotate`,
    revoke: (code: string, id: string) => `${credentialsPath(code, id)}/revoke`,
};
