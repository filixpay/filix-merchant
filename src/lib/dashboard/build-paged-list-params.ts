export function buildPagedListParams(
    page: number,
    pageSize: number,
    filters: object = {},
    keys: { page?: string; size?: string } = {},
): Record<string, string | number> {
    const pageKey = keys.page ?? "page";
    const sizeKey = keys.size ?? "size";
    const params: Record<string, string | number> = {
        [pageKey]: page,
        [sizeKey]: pageSize,
    };

    for (const [key, value] of Object.entries(filters as Record<string, string | number | undefined>)) {
        if (value !== undefined && value !== "") {
            params[key] = value;
        }
    }

    return params;
}
