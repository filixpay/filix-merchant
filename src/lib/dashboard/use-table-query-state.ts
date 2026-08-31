"use client";

import { useState } from "react";

export function createTableQueryState(defaults: { page: number; pageSize: number }) {
    return {
        ...defaults,
        setPagination: (page: number, pageSize: number) => ({ page, pageSize }),
        reset: () => defaults,
    };
}

export function useTableQueryState(defaults = { page: 0, pageSize: 20 }) {
    const [page, setPage] = useState(defaults.page);
    const [pageSize, setPageSize] = useState(defaults.pageSize);

    const setPagination = (nextPage: number, nextPageSize: number) => {
        setPage(nextPage);
        setPageSize(nextPageSize);
    };

    const reset = () => {
        setPage(defaults.page);
        setPageSize(defaults.pageSize);
    };

    return {
        page,
        pageSize,
        setPage,
        setPageSize,
        setPagination,
        reset,
    };
}
