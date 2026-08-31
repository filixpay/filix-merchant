import type { PagedResponse } from "./types";
import { authHeaders, request } from "./core";

export function buildQuery(params: Record<string, string | number> = {}) {
    return new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)]),
    ).toString();
}

export function pagedGet<T>(path: string, params: Record<string, string | number>, token: string) {
    const query = buildQuery(params);
    return request<PagedResponse<T>>(`${path}${query ? `?${query}` : ""}`, {
        headers: authHeaders(token),
    });
}
