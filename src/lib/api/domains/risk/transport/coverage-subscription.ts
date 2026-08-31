import { ENDPOINTS } from "@/lib/api-config";
import { ApiError, authHeaders, request } from "@/lib/api/core";
import type {
    CoverageSubscriptionSubscribeRequest,
    CoverageSubscriptionView,
} from "@/types/coverageSubscription";

const BASE = ENDPOINTS.PORTAL.RISK_COVERAGE_SUBSCRIPTION;

export async function getCoverageSubscription(token: string): Promise<CoverageSubscriptionView | null> {
    try {
        return await request<CoverageSubscriptionView>(BASE, {
            headers: authHeaders(token),
        });
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return null;
        }
        throw error;
    }
}

export async function subscribeCoverage(
    token: string,
    body: CoverageSubscriptionSubscribeRequest = {},
): Promise<CoverageSubscriptionView> {
    return request<CoverageSubscriptionView>(`${BASE}/subscribe`, {
        method: "POST",
        headers: {
            ...authHeaders(token),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}

export async function unsubscribeCoverage(token: string): Promise<CoverageSubscriptionView> {
    return request<CoverageSubscriptionView>(`${BASE}/unsubscribe`, {
        method: "POST",
        headers: authHeaders(token),
    });
}
