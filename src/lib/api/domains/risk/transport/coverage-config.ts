import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "@/lib/api/core";
import type {
    CoverageConfigCreateRequest,
    CoverageConfigUpdateRequest,
    CoverageConfigView,
    CoverageConnectionTestResult,
    CoverageProviderSchema,
} from "@/types/coverageConfig";

export async function listCoverageConfigs(token: string): Promise<CoverageConfigView[]> {
    const items = await request<CoverageConfigView[]>(ENDPOINTS.PORTAL.RISK_COVERAGE_CONFIG, {
        headers: authHeaders(token),
    });
    return items ?? [];
}

export async function getActiveCoverageConfig(token: string): Promise<CoverageConfigView | null> {
    try {
        return await request<CoverageConfigView>(`${ENDPOINTS.PORTAL.RISK_COVERAGE_CONFIG}/active`, {
            headers: authHeaders(token),
        });
    } catch {
        return null;
    }
}

export async function listCoverageProviders(token: string): Promise<CoverageProviderSchema[]> {
    const items = await request<CoverageProviderSchema[]>(
        `${ENDPOINTS.PORTAL.RISK_COVERAGE_CONFIG}/providers`,
        { headers: authHeaders(token) },
    );
    return items ?? [];
}

export async function createCoverageConfig(
    token: string,
    body: CoverageConfigCreateRequest,
): Promise<CoverageConfigView> {
    return request<CoverageConfigView>(ENDPOINTS.PORTAL.RISK_COVERAGE_CONFIG, {
        method: "POST",
        headers: {
            ...authHeaders(token),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}

export async function updateCoverageConfig(
    token: string,
    mccId: string,
    body: CoverageConfigUpdateRequest,
): Promise<CoverageConfigView> {
    return request<CoverageConfigView>(`${ENDPOINTS.PORTAL.RISK_COVERAGE_CONFIG}/${encodeURIComponent(mccId)}`, {
        method: "PUT",
        headers: {
            ...authHeaders(token),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}

export async function activateCoverageConfig(token: string, mccId: string): Promise<CoverageConfigView> {
    return request<CoverageConfigView>(
        `${ENDPOINTS.PORTAL.RISK_COVERAGE_CONFIG}/${encodeURIComponent(mccId)}/activate`,
        {
            method: "POST",
            headers: authHeaders(token),
        },
    );
}

export async function deactivateCoverageConfig(token: string, mccId: string): Promise<CoverageConfigView> {
    return request<CoverageConfigView>(
        `${ENDPOINTS.PORTAL.RISK_COVERAGE_CONFIG}/${encodeURIComponent(mccId)}/deactivate`,
        {
            method: "POST",
            headers: authHeaders(token),
        },
    );
}

export async function enterCoverageMaintenance(token: string, mccId: string): Promise<CoverageConfigView> {
    return request<CoverageConfigView>(
        `${ENDPOINTS.PORTAL.RISK_COVERAGE_CONFIG}/${encodeURIComponent(mccId)}/maintenance`,
        {
            method: "POST",
            headers: authHeaders(token),
        },
    );
}

export async function resumeCoverageFromMaintenance(token: string, mccId: string): Promise<CoverageConfigView> {
    return request<CoverageConfigView>(
        `${ENDPOINTS.PORTAL.RISK_COVERAGE_CONFIG}/${encodeURIComponent(mccId)}/resume`,
        {
            method: "POST",
            headers: authHeaders(token),
        },
    );
}

export async function testCoverageConnection(
    token: string,
    mccId: string,
): Promise<CoverageConnectionTestResult> {
    return request<CoverageConnectionTestResult>(
        `${ENDPOINTS.PORTAL.RISK_COVERAGE_CONFIG}/${encodeURIComponent(mccId)}/test`,
        {
            method: "POST",
            headers: authHeaders(token),
        },
    );
}
