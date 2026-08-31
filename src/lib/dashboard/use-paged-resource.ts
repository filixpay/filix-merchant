"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PagedResponse } from "@/lib/api";
import { handleDashboardApiError } from "./handle-dashboard-api-error";
import { normalizePagedResponse } from "./normalize-paged-response";

export type PagedFetcher<T, P> = (params: P, token: string) => Promise<PagedResponse<T>>;

export type UsePagedResourceOptions<T, P> = {
    accessToken: string | undefined;
    params: P;
    fetcher: PagedFetcher<T, P>;
    normalize?: (response: PagedResponse<T>) => { items: T[]; total: number };
    enabled?: boolean;
};

export function usePagedResource<T, P>({
    accessToken,
    params,
    fetcher,
    normalize = normalizePagedResponse,
    enabled = true,
}: UsePagedResourceOptions<T, P>) {
    const [items, setItems] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<unknown | null>(null);
    const itemsRef = useRef<T[]>([]);
    itemsRef.current = items;
    const paramsRef = useRef(params);
    paramsRef.current = params;
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;
    const normalizeRef = useRef(normalize);
    normalizeRef.current = normalize;

    const reload = useCallback(async () => {
        if (!accessToken) {
            setLoading(false);
            setIsRefreshing(false);
            setError(null);
            return;
        }

        const hasExistingRows = itemsRef.current.length > 0;
        setLoading(!hasExistingRows);
        setIsRefreshing(hasExistingRows);
        setError(null);
        try {
            const response = await fetcherRef.current(paramsRef.current, accessToken);
            const normalized = normalizeRef.current(response);
            setItems(normalized.items);
            setTotal(normalized.total);
        } catch (err) {
            const handled = handleDashboardApiError(err);
            if (!handled) {
                setError(err);
            }
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [accessToken]);

    useEffect(() => {
        if (!enabled || !accessToken) {
            setLoading(false);
            setIsRefreshing(false);
            return;
        }
        reload();
    }, [accessToken, enabled, reload, params]);

    return { items, total, loading, isRefreshing, error, reload };
}
