import { API_BASE_URL, ENDPOINTS } from "@/lib/api-config";
import { developerBffPath } from "@/lib/developer/bff-paths";
import { withSelectedMerchantCode } from "@/lib/developer/bff-request";
import { readResponseErrorMessage } from "@/lib/http/read-response-error";
import { authHeaders, request } from "@/lib/api/core";

export type ExplorerApplication = {
    applicationCode: string;
    name?: string;
    status?: string;
    description?: string;
};

export type ExplorerOperation = {
    operationId: string;
    method: string;
    path: string;
    summary?: string;
};

export type ExplorerExecutePayload = {
    applicationCode: string;
    operationId: string;
    parameters?: {
        path?: Record<string, string>;
        query?: Record<string, string>;
        header?: Record<string, string>;
    };
    body?: unknown;
};

export type ExplorerExecuteResult = {
    status: number;
    headers?: Record<string, string>;
    body?: unknown;
    latencyMs?: number;
    traceId?: string;
};

/** Frozen client fields only — never method/path/url/credentialId/token. */
export function buildExplorerExecuteBody(payload: ExplorerExecutePayload): ExplorerExecutePayload {
    const body: ExplorerExecutePayload = {
        applicationCode: payload.applicationCode,
        operationId: payload.operationId,
    };
    if (payload.parameters) {
        body.parameters = {};
        if (payload.parameters.path && Object.keys(payload.parameters.path).length > 0) {
            body.parameters.path = { ...payload.parameters.path };
        }
        if (payload.parameters.query && Object.keys(payload.parameters.query).length > 0) {
            body.parameters.query = { ...payload.parameters.query };
        }
        if (payload.parameters.header && Object.keys(payload.parameters.header).length > 0) {
            body.parameters.header = { ...payload.parameters.header };
        }
        if (Object.keys(body.parameters).length === 0) {
            delete body.parameters;
        }
    }
    if (payload.body !== undefined) {
        body.body = payload.body;
    }
    return body;
}

export async function listExplorerApplications(token: string): Promise<ExplorerApplication[]> {
    const data = await request<ExplorerApplication[]>(ENDPOINTS.PORTAL.DEVELOPER_APPLICATIONS, {
        method: "GET",
        headers: authHeaders(token),
    });
    return Array.isArray(data) ? data : [];
}

export async function listExplorerOperations(
    token: string,
    apiId: string,
): Promise<ExplorerOperation[]> {
    const path = `${ENDPOINTS.PORTAL.DEVELOPER_CONTRACTS}/${encodeURIComponent(apiId)}/current/operations`;
    const data = await request<ExplorerOperation[]>(path, {
        method: "GET",
        headers: authHeaders(token),
    });
    return Array.isArray(data) ? data : [];
}

/**
 * Transport-only BFF → Merchant `/developer/explorer/execute`.
 * Does not store or handle sandbox token / client secret / credential material.
 */
export async function executeExplorer(payload: ExplorerExecutePayload): Promise<ExplorerExecuteResult> {
    const frozen = buildExplorerExecuteBody(payload);
    const res = await fetch(developerBffPath("explorer/execute"), {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(withSelectedMerchantCode(frozen as Record<string, unknown>)),
    });
    if (!res.ok) {
        throw new Error(await readResponseErrorMessage(res, `Explorer execute failed (${res.status})`));
    }
    const json = (await res.json()) as {
        success?: boolean;
        message?: string;
        data?: ExplorerExecuteResult;
        status?: number;
        body?: unknown;
    };
    // BFF may return ApiResponse wrapper or flat execute result
    if (json.data && typeof json.data === "object" && "status" in json.data) {
        return json.data;
    }
    if (typeof json.status === "number") {
        return json as ExplorerExecuteResult;
    }
    throw new Error(json.message || "Explorer execute response missing data");
}

/** @internal test helper — ensures BFF URL never points at legacy sandbox session path */
export function explorerExecuteBffPath(): string {
    return developerBffPath("explorer/execute");
}

export function explorerMerchantExecuteUrl(): string {
    return `${API_BASE_URL}${ENDPOINTS.PORTAL.DEVELOPER_EXPLORER_EXECUTE}`;
}
