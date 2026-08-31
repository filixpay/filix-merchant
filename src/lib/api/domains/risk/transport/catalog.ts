import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "@/lib/api/core";
import type { FraudEventDetailDto, FraudEventDto, ReviewDetailDto, RiskReviewDto } from "../shared/dto";
import {
    mapFraudEventDetailDto,
    mapFraudEventDto,
    mapRiskReviewDetailDto,
    mapRiskReviewDto,
} from "../shared/mappers";
import { buildFraudSearchParams, type FraudListQuery } from "../fraud/list-query";
import { buildReviewSearchParams, type ReviewListQuery } from "../reviews/list-query";

function buildQueryUrl(base: string, params: Record<string, string | number>): string {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        search.set(key, String(value));
    }
    const qs = search.toString();
    return qs ? `${base}?${qs}` : base;
}

export async function fetchRiskReviews(token: string, query?: ReviewListQuery) {
    const url = query
        ? buildQueryUrl(ENDPOINTS.PORTAL.RISK_REVIEWS, buildReviewSearchParams(query))
        : ENDPOINTS.PORTAL.RISK_REVIEWS;
    const items = await request<RiskReviewDto[]>(url, {
        headers: authHeaders(token),
    });
    return (items ?? []).map(mapRiskReviewDto);
}

export async function fetchFraudEvents(token: string, query?: FraudListQuery) {
    const url = query
        ? buildQueryUrl(ENDPOINTS.PORTAL.RISK_FRAUD_EVENTS, buildFraudSearchParams(query))
        : ENDPOINTS.PORTAL.RISK_FRAUD_EVENTS;
    const items = await request<FraudEventDto[]>(url, {
        headers: authHeaders(token),
    });
    return (items ?? []).map(mapFraudEventDto);
}

export async function fetchFraudEventDetail(id: string, token: string) {
    const dto = await request<FraudEventDetailDto>(ENDPOINTS.PORTAL.RISK_FRAUD_EVENT(id), {
        headers: authHeaders(token),
    });
    return mapFraudEventDetailDto(dto);
}

export async function fetchReviewDetail(id: string, token: string) {
    const dto = await request<ReviewDetailDto>(ENDPOINTS.PORTAL.RISK_REVIEW(id), {
        headers: authHeaders(token),
    });
    return mapRiskReviewDetailDto(dto);
}
