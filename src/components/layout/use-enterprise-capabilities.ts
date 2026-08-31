"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, DiscoverableEnterpriseView } from "@/lib/api";
import { shellQueryKeys } from "@/lib/query/keys";
import {
    findSelectedEnterprise,
    getInitialActiveEnterprise,
    getStoredSelectedEnterpriseCode,
    persistEnterpriseSelection,
    readEnterprisesCache,
    writeEnterprisesCache,
} from "./enterprise-shell";

export function useEnterpriseCapabilities(accessToken: string | undefined) {
    const queryClient = useQueryClient();
    const cached = readEnterprisesCache();

    const query = useQuery({
        queryKey: shellQueryKeys.enterprises(),
        queryFn: async () => {
            const data = await api.enterprise.listDiscoverable(accessToken!);
            writeEnterprisesCache(data);
            return data;
        },
        enabled: Boolean(accessToken),
        placeholderData: cached ?? undefined,
    });

    const enterprises = query.data ?? cached ?? [];

    const [activeEnterprise, setActiveEnterprise] = useState<DiscoverableEnterpriseView | null>(
        () => {
            const initial = getInitialActiveEnterprise();
            if (initial) {
                persistEnterpriseSelection(initial);
            }
            return initial;
        },
    );

    useEffect(() => {
        if (!query.data) return;
        const selected = findSelectedEnterprise(query.data, getStoredSelectedEnterpriseCode());
        if (selected) {
            persistEnterpriseSelection(selected);
            setActiveEnterprise(selected);
        } else {
            setActiveEnterprise(null);
        }
    }, [query.data]);

    const reloadEnterprises = useCallback(async () => {
        if (!accessToken) return;
        await queryClient.invalidateQueries({
            queryKey: shellQueryKeys.enterprises(),
        });
    }, [accessToken, queryClient]);

    const selectEnterprise = useCallback((enterprise: DiscoverableEnterpriseView) => {
        persistEnterpriseSelection(enterprise);
        setActiveEnterprise(enterprise);
    }, []);

    return {
        enterprises,
        enterprisesLoading: query.isLoading && enterprises.length === 0,
        activeEnterprise,
        reloadEnterprises,
        selectEnterprise,
    };
}
