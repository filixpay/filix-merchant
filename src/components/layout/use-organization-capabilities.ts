"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, OrganizationSummaryView } from "@/lib/api";
import { shellQueryKeys } from "@/lib/query/keys";
import {
    findSelectedOrganization,
    getInitialActiveOrganization,
    getStoredSelectedOrganizationCode,
    persistOrganizationSelection,
    readOrganizationsCache,
    writeOrganizationsCache,
} from "./organization-shell";

export function useOrganizationCapabilities(accessToken: string | undefined) {
    const queryClient = useQueryClient();
    const cached = readOrganizationsCache();

    const query = useQuery({
        queryKey: shellQueryKeys.organizations(),
        queryFn: async () => {
            const data = await api.organizations.list(accessToken!);
            writeOrganizationsCache(data);
            return data;
        },
        enabled: Boolean(accessToken),
        placeholderData: cached ?? undefined,
    });

    const organizations = query.data ?? cached ?? [];

    const [activeOrganization, setActiveOrganization] = useState<OrganizationSummaryView | null>(
        () => {
            const initial = getInitialActiveOrganization();
            if (initial) {
                persistOrganizationSelection(initial);
            }
            return initial;
        },
    );

    useEffect(() => {
        if (!query.data) return;
        const selected = findSelectedOrganization(query.data, getStoredSelectedOrganizationCode());
        if (selected) {
            persistOrganizationSelection(selected);
            setActiveOrganization(selected);
        } else {
            setActiveOrganization(null);
        }
    }, [query.data]);

    const reloadOrganizations = useCallback(async () => {
        if (!accessToken) return;
        await queryClient.invalidateQueries({
            queryKey: shellQueryKeys.organizations(),
        });
    }, [accessToken, queryClient]);

    const selectOrganization = useCallback((organization: OrganizationSummaryView) => {
        persistOrganizationSelection(organization);
        setActiveOrganization(organization);
    }, []);

    return {
        organizations,
        organizationsLoading: query.isLoading && organizations.length === 0,
        activeOrganization,
        reloadOrganizations,
        selectOrganization,
    };
}
