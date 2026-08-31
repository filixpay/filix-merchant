import type { PagedResponse } from "@/lib/api";

export function normalizePagedResponse<T>(response: PagedResponse<T>): {
    items: T[];
    total: number;
} {
    return {
        items: response.content ?? response.data ?? [],
        total: response.total ?? 0,
    };
}
