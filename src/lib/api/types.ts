export interface PagedResponse<T> {
    total: number;
    page?: number;
    size?: number;
    pageNumber?: number;
    pageSize?: number;
    totalPages?: number;
    data: T[];
    content?: T[];
    metadata?: Record<string, unknown>;
}

export interface Amount {
    amount: number;
    currency: string;
    formatted?: string;
}
